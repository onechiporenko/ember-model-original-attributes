import DS from 'ember-data';
import {getOwner} from '@ember/application';
import {get, set} from '@ember/object';
import {run} from '@ember/runloop';
import {resolve} from 'rsvp';
import {moduleForModel, test} from 'ember-qunit';
import {updateModelClass} from 'ember-model-original-attributes/op-utils';

moduleForModel('user', 'Unit | Model | user', {
  needs: ['model:rel'],

  beforeEach() {
    const store = this.store();
    const owner = getOwner(store);
    owner.register('adapter:application', DS.JSONAPIAdapter.extend({
      createRecord(store, modelClass, snapshot) {
        const json = snapshot.serialize();
        json.data.id = '1';
        return resolve(json);
      },
      updateRecord(store, modelClass, snapshot) {
        return resolve(snapshot.serialize({includeId: true}));
      }
    }));
    updateModelClass(store, 'user', {
      originalAttributes: {
        models: {
          user: {
            attrs: ['name', 'val', 'rel', 'rel2', 'comp']
          }
        }
      }
    });
  }
});

test('#originalName (new computed property)', function (assert) {
  assert.expect(6);
  let model = this.subject({name: 'test'});
  run(() => model.set('name', 'newName'));
  assert.equal(model.get('name'), 'newName', '`name` is updated');
  assert.equal(model.get('originalName'), undefined, '`originalName` is undefined, because record is new and not saved');
  run(() => model.save().then(() => assert.equal(model.get('originalName'), 'newName', 'record is saved, so `originalValue` is updated')));

  run(() => model.set('name', 'newNewName'));
  assert.equal(model.get('name'), 'newNewName', '`name` is updated (2)');
  assert.equal(model.get('originalName'), 'newName', '`originalValue` for dirty (updated) record is equal to the old value');
  run(() => model.save().then(() => assert.equal(model.get('originalName'), 'newNewName', 'record is saved, so `originalValue` is updated (2)')));
});

test('#originalVal (existing attribute)', function (assert) {
  const UserModel = this.store().modelFor('user');
  const originalValAttr = get(UserModel, 'attributes').get('originalVal');
  assert.equal(originalValAttr.type, 'string');
  assert.equal(originalValAttr.isAttribute, true);
});

test('#originalRel (existing belongsTo)', function (assert) {
  const UserModel = this.store().modelFor('user');
  const originalRelAttr = get(UserModel, 'relationshipsByName').get('originalRel');
  assert.equal(originalRelAttr.kind, 'belongsTo');
  assert.equal(originalRelAttr.isRelationship, true);
});

test('#originalRel2 (existing hasMany)', function (assert) {
  const UserModel = this.store().modelFor('user');
  const originalRelAttr = get(UserModel, 'relationshipsByName').get('originalRel2');
  assert.equal(originalRelAttr.kind, 'hasMany');
  assert.equal(originalRelAttr.isRelationship, true);
});

test('#originalComp (existing computed)', function (assert) {
  const model = this.subject();
  assert.equal(model.get('originalComp'), 'some-val');
  run(() => set(model, 'comp', 'new-val'));
  assert.equal(model.get('originalComp'), 'some-val');
  run(() => model.save().then(() => assert.equal(model.get('originalComp'), 'some-val')));
});