import DS from 'ember-data';
import {computed} from '@ember/object';

export default DS.Model.extend({
  name: DS.attr('string'),
  val: DS.attr('string'),
  originalVal: DS.attr('string'),
  rel: DS.attr('string'),
  rel2: DS.attr('string'),
  comp: DS.attr('string'),
  originalRel: DS.belongsTo('rel'),
  originalRel2: DS.hasMany('rel'),
  originalComp: computed('fakeKey', function () {return 'some-val';})
});
