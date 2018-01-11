# ember-model-original-attributes

[![Build Status](https://travis-ci.org/onechiporenko/ember-model-original-attributes.svg?branch=master)](https://travis-ci.org/onechiporenko/ember-model-original-attributes)
[![npm version](https://badge.fury.io/js/ember-model-original-attributes.png)](http://badge.fury.io/js/ember-model-original-attributes)

> Add new computed properties to Models with values equal to some saved attribute's values.

## Install

```bash
ember install ember-model-original-attributes
```

## Usage

Create a section `originalAttributes` in the `config/environment.js`:

```javascript
module.exports = function(/* environment, appConfig */) {
  return {
    originalAttributes: {
      prefix: 'old',
      models: {
        user: {
          attrs: ['firstName', 'lastName']
        }
      }
    }
  };
};
```

Model `user` will have two new computed properties called `oldFirstName` and `oldLastName`. Both of them will be equal to the saved values of the `firstName` and `lastName`.

Existing computed properties, attributes or relationships won't be overridden.

Prefix `original` is used by default.

Property `models` is a hash with keys equal to Model names. Its values are hashes with property `attrs`. Each `attrs` is an array with attribute names that should be processed.

```javascript
store.findRecord('user', '1').then(user => {
  user.get('firstName');      // 'Jim'
  user.get('oldFirstName');   // 'Jim'
  user.set('firstName', 'Tychus');
  user.get('firstName');      // 'Tychus'
  user.get('oldFirstName');   // 'Jim'
  user.save().then(() => {
    user.get('firstName');    // 'Tychus'
    user.get('oldFirstName'); // 'Tychus'
  });
});
```
