"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSelectors = exports.createActions = void 0;

var _lodash = require("lodash");

const createActions = (store, actions) => (0, _lodash.reduce)(actions, (acc, action, name) => ({ ...acc,
  [name]: (...args) => store.dispatch(action(...args))
}), {});

exports.createActions = createActions;

const createSelectors = (store, selectors) => (0, _lodash.reduce)(selectors, (acc, selector, name) => ({ ...acc,
  [name]: (...args) => selector(store.getState(), ...args)
}), {});

exports.createSelectors = createSelectors;