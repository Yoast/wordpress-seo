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
eval("\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global analysisWorker */\n\n\nvar _yoastseo = __webpack_require__(1);\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar UsedKeywordsPlugin = _yoastseo.bundledPlugins.usedKeywords;\n\nvar UsedKeywordsAssessment = function () {\n\t/**\n  * Constructs the used keyword assessment for the analysis worker.\n  */\n\tfunction UsedKeywordsAssessment() {\n\t\t_classCallCheck(this, UsedKeywordsAssessment);\n\n\t\tthis._initialized = false;\n\t}\n\n\t/**\n  * Registers the used keyword assessment with the analysis worker.\n  *\n  * @returns {void}\n  */\n\n\n\t_createClass(UsedKeywordsAssessment, [{\n\t\tkey: \"register\",\n\t\tvalue: function register() {\n\t\t\tanalysisWorker.registerMessageHandler(\"updateKeywordUsage\", this.updateKeywordUsage.bind(this), \"used-keywords-assessment\");\n\t\t\tanalysisWorker.registerMessageHandler(\"initialize\", this.initialize.bind(this), \"used-keywords-assessment\");\n\t\t}\n\n\t\t/**\n   * Initializes the used keywords plugin provided by YoastSEO.js\n   *\n   * @param {Object} options The options to send to the UsedKeywordsPlugin.\n   *\n   * @returns {void}\n   */\n\n\t}, {\n\t\tkey: \"initialize\",\n\t\tvalue: function initialize(options) {\n\t\t\tthis._plugin = new UsedKeywordsPlugin(analysisWorker, options);\n\t\t\tthis._plugin.registerPlugin();\n\t\t\tthis._initialized = true;\n\t\t}\n\n\t\t/**\n   * Updates keyword usage in the used keywords plugin.\n   *\n   * @param {Object} keywordUsage Information about when keywords are used in other posts.\n   *\n   * @returns {void}\n   */\n\n\t}, {\n\t\tkey: \"updateKeywordUsage\",\n\t\tvalue: function updateKeywordUsage(keywordUsage) {\n\t\t\tif (!this._initialized) {\n\t\t\t\tthrow new Error(\"UsedKeywordsAssessment must be initialized before keywords can be updated.\");\n\t\t\t}\n\n\t\t\tthis._plugin.updateKeywordUsage(keywordUsage);\n\n\t\t\t// Refresh assessment in the worker to make sure our assessment is refreshed.\n\t\t\tanalysisWorker.refreshAssessment(\"usedKeywords\", \"previouslyUsedKeywords\");\n\t\t}\n\t}]);\n\n\treturn UsedKeywordsAssessment;\n}();\n\nvar keywordsAssessment = new UsedKeywordsAssessment();\n\nkeywordsAssessment.register();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9qcy9zcmMvd3Atc2VvLXVzZWQta2V5d29yZHMtYXNzZXNzbWVudC5qcz8yOWIyIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCBhbmFseXNpc1dvcmtlciAqL1xuaW1wb3J0IHsgYnVuZGxlZFBsdWdpbnMgfSBmcm9tIFwieW9hc3RzZW9cIjtcbmNvbnN0IFVzZWRLZXl3b3Jkc1BsdWdpbiA9IGJ1bmRsZWRQbHVnaW5zLnVzZWRLZXl3b3JkcztcblxuY2xhc3MgVXNlZEtleXdvcmRzQXNzZXNzbWVudCB7XG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3RzIHRoZSB1c2VkIGtleXdvcmQgYXNzZXNzbWVudCBmb3IgdGhlIGFuYWx5c2lzIHdvcmtlci5cblx0ICovXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuX2luaXRpYWxpemVkID0gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogUmVnaXN0ZXJzIHRoZSB1c2VkIGtleXdvcmQgYXNzZXNzbWVudCB3aXRoIHRoZSBhbmFseXNpcyB3b3JrZXIuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0cmVnaXN0ZXIoKSB7XG5cdFx0YW5hbHlzaXNXb3JrZXIucmVnaXN0ZXJNZXNzYWdlSGFuZGxlciggXCJ1cGRhdGVLZXl3b3JkVXNhZ2VcIiwgdGhpcy51cGRhdGVLZXl3b3JkVXNhZ2UuYmluZCggdGhpcyApLCBcInVzZWQta2V5d29yZHMtYXNzZXNzbWVudFwiICk7XG5cdFx0YW5hbHlzaXNXb3JrZXIucmVnaXN0ZXJNZXNzYWdlSGFuZGxlciggXCJpbml0aWFsaXplXCIsIHRoaXMuaW5pdGlhbGl6ZS5iaW5kKCB0aGlzICksIFwidXNlZC1rZXl3b3Jkcy1hc3Nlc3NtZW50XCIgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplcyB0aGUgdXNlZCBrZXl3b3JkcyBwbHVnaW4gcHJvdmlkZWQgYnkgWW9hc3RTRU8uanNcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgdG8gc2VuZCB0byB0aGUgVXNlZEtleXdvcmRzUGx1Z2luLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGluaXRpYWxpemUoIG9wdGlvbnMgKSB7XG5cdFx0dGhpcy5fcGx1Z2luID0gbmV3IFVzZWRLZXl3b3Jkc1BsdWdpbiggYW5hbHlzaXNXb3JrZXIsIG9wdGlvbnMgKTtcblx0XHR0aGlzLl9wbHVnaW4ucmVnaXN0ZXJQbHVnaW4oKTtcblx0XHR0aGlzLl9pbml0aWFsaXplZCA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyBrZXl3b3JkIHVzYWdlIGluIHRoZSB1c2VkIGtleXdvcmRzIHBsdWdpbi5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGtleXdvcmRVc2FnZSBJbmZvcm1hdGlvbiBhYm91dCB3aGVuIGtleXdvcmRzIGFyZSB1c2VkIGluIG90aGVyIHBvc3RzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdHVwZGF0ZUtleXdvcmRVc2FnZSgga2V5d29yZFVzYWdlICkge1xuXHRcdGlmICggISB0aGlzLl9pbml0aWFsaXplZCApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvciggXCJVc2VkS2V5d29yZHNBc3Nlc3NtZW50IG11c3QgYmUgaW5pdGlhbGl6ZWQgYmVmb3JlIGtleXdvcmRzIGNhbiBiZSB1cGRhdGVkLlwiICk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fcGx1Z2luLnVwZGF0ZUtleXdvcmRVc2FnZSgga2V5d29yZFVzYWdlICk7XG5cblx0XHQvLyBSZWZyZXNoIGFzc2Vzc21lbnQgaW4gdGhlIHdvcmtlciB0byBtYWtlIHN1cmUgb3VyIGFzc2Vzc21lbnQgaXMgcmVmcmVzaGVkLlxuXHRcdGFuYWx5c2lzV29ya2VyLnJlZnJlc2hBc3Nlc3NtZW50KCBcInVzZWRLZXl3b3Jkc1wiLCBcInByZXZpb3VzbHlVc2VkS2V5d29yZHNcIiApO1xuXHR9XG59XG5cbmNvbnN0IGtleXdvcmRzQXNzZXNzbWVudCA9IG5ldyBVc2VkS2V5d29yZHNBc3Nlc3NtZW50KCk7XG5cbmtleXdvcmRzQXNzZXNzbWVudC5yZWdpc3RlcigpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGpzL3NyYy93cC1zZW8tdXNlZC1rZXl3b3Jkcy1hc3Nlc3NtZW50LmpzIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7OztBQUFBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBR0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

eval("module.exports = yoast.analysis;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcInlvYXN0LmFuYWx5c2lzXCI/MTA3MiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHlvYXN0LmFuYWx5c2lzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwieW9hc3QuYW5hbHlzaXNcIlxuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///1\n");

/***/ })
/******/ ]);