import {updateModelClass} from '../op-utils';

export function initialize(appInstance) {
  const config = appInstance.resolveRegistration('config:environment');
  const store = appInstance.lookup('service:store');
  const originalAttributes = config && config.originalAttributes ? config.originalAttributes : {};
  const {models} = originalAttributes;
  if (!models) {
    return;
  }
  Object.keys(models).forEach(modelName => updateModelClass(store, modelName, config));
}

export default {
  after: 'ember-data',
  initialize
};
