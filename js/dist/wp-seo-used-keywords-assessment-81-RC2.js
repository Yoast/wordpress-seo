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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global analysisWorker */


var _yoastseo = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UsedKeywordsPlugin = _yoastseo.bundledPlugins.usedKeywords;

var UsedKeywordsAssessment = function () {
	/**
  * Constructs the used keyword assessment for the analysis worker.
  */
	function UsedKeywordsAssessment() {
		_classCallCheck(this, UsedKeywordsAssessment);

		this._initialized = false;
	}

	/**
  * Registers the used keyword assessment with the analysis worker.
  *
  * @returns {void}
  */


	_createClass(UsedKeywordsAssessment, [{
		key: "register",
		value: function register() {
			analysisWorker.registerMessageHandler("updateKeywordUsage", this.updateKeywordUsage.bind(this), "used-keywords-assessment");
			analysisWorker.registerMessageHandler("initialize", this.initialize.bind(this), "used-keywords-assessment");
		}

		/**
   * Initializes the used keywords plugin provided by YoastSEO.js
   *
   * @param {Object} options The options to send to the UsedKeywordsPlugin.
   *
   * @returns {void}
   */

	}, {
		key: "initialize",
		value: function initialize(options) {
			this._plugin = new UsedKeywordsPlugin(analysisWorker, options);
			this._plugin.registerPlugin();
			this._initialized = true;
		}

		/**
   * Updates keyword usage in the used keywords plugin.
   *
   * @param {Object} keywordUsage Information about when keywords are used in other posts.
   *
   * @returns {void}
   */

	}, {
		key: "updateKeywordUsage",
		value: function updateKeywordUsage(keywordUsage) {
			if (!this._initialized) {
				throw new Error("UsedKeywordsAssessment must be initialized before keywords can be updated.");
			}

			this._plugin.updateKeywordUsage(keywordUsage);

			// Refresh assessment in the worker to make sure our assessment is refreshed.
			analysisWorker.refreshAssessment("usedKeywords", "previouslyUsedKeywords");
		}
	}]);

	return UsedKeywordsAssessment;
}();

var keywordsAssessment = new UsedKeywordsAssessment();

keywordsAssessment.register();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = yoast.analysis;

/***/ })
/******/ ]);