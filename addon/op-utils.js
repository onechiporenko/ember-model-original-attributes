import {computed, get} from '@ember/object';
import {capitalize} from '@ember/string';
import {A} from '@ember/array';

/**
 * @param {string} attrName
 * @returns {computed}
 */
export function getOriginalComputed(attrName) {
  return computed(attrName, 'hasDirtyAttributes', 'isSaving', function () {
    const attrValue = get(this, attrName);
    if (!get(this, 'hasDirtyAttributes')) {
      return attrValue;
    }
    const changedAttributes = this.changedAttributes();
    const isSaving = get(this, 'isSaving');
    return !isSaving && changedAttributes[attrName] ? changedAttributes[attrName][0] : attrValue;
  });
}

/**
 * @param {DS.Store} store
 * @param {DS.Model} modelName
 * @param {object} config
 */
export function updateModelClass(store, modelName, config) {
  const originalAttributes = config && config.originalAttributes ? config.originalAttributes : {};
  const {prefix = 'original', models} = originalAttributes;
  const modelClass = store.modelFor(modelName);
  if (!modelClass) {
    return;
  }

  const computedProperties = A([]);
  modelClass.eachComputedProperty(name => computedProperties.pushObject(name));
  const {attrs} = models[modelName];
  if (!attrs) {
    return;
  }
  attrs.forEach(attrName => {
    if (!computedProperties.includes(attrName)) {
      return;
    }
    const newAttrName = `${prefix}${capitalize(attrName)}`;
    if (computedProperties.includes(newAttrName)) {
      return;
    }
    modelClass.reopen({
      [newAttrName]: getOriginalComputed(attrName)
    });
  });
}
