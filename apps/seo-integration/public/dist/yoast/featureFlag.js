window["yoast"] = window["yoast"] || {}; window["yoast"]["featureFlag"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./packages/feature-flag/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./packages/feature-flag/src/index.js":
/*!********************************************!*\
  !*** ./packages/feature-flag/src/index.js ***!
  \********************************************/
/*! exports provided: isFeatureEnabled, enableFeatures, enabledFeatures */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isFeatureEnabled", function() { return isFeatureEnabled; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enableFeatures", function() { return enableFeatures; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enabledFeatures", function() { return enabledFeatures; });
/**
 * Checks whether the given feature is enabled.
 *
 * @param {string} featureName      The name of the feature to check.
 *
 * @returns {boolean} `true` when the feature is enabled, `false` if not.
 */
const isFeatureEnabled = function (featureName) {
  if (self.wpseoFeatureFlags) {
    return self.wpseoFeatureFlags.includes(featureName);
  }

  return false;
};
/**
 * Enables the features with the given names.
 *
 * @param {string[]} featureNames   A list of names of the features to enable.
 *
 * @returns {void}
 */


const enableFeatures = function (featureNames) {
  // If no features have been enabled yet, initialize the global array.
  if (!self.wpseoFeatureFlags) {
    self.wpseoFeatureFlags = [];
  } // Check whether the features are already enabled, if not: add them.


  featureNames.forEach(name => {
    if (!self.wpseoFeatureFlags.includes(name)) {
      self.wpseoFeatureFlags.push(name);
    }
  });
};
/**
 * Returns the list of enabled features.
 *
 * @returns {string[]} The list of enabled features.
 */


const enabledFeatures = function () {
  return self.wpseoFeatureFlags || [];
};



/***/ })

/******/ });