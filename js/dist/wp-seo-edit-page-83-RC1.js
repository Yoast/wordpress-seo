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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/src/wp-seo-edit-page.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/src/wp-seo-edit-page.js":
/*!************************************!*\
  !*** ./js/src/wp-seo-edit-page.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n(function ($) {\n\t// Set the yoast-tooltips on the list table links columns that have links.\n\t$(\".yoast-column-header-has-tooltip\").each(function () {\n\t\tvar parentLink = $(this).closest(\"th\").find(\"a\");\n\n\t\tparentLink.addClass(\"yoast-tooltip yoast-tooltip-n yoast-tooltip-multiline\").attr(\"aria-label\", $(this).data(\"label\"));\n\t});\n\n\t// Clean up the columns titles HTML for the Screen Options checkboxes labels.\n\t$(\".yoast-column-header-has-tooltip, .yoast-tooltip\", \"#screen-meta\").each(function () {\n\t\tvar text = $(this).text();\n\t\t$(this).replaceWith(text);\n\t});\n})(jQuery);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9qcy9zcmMvd3Atc2VvLWVkaXQtcGFnZS5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9qcy9zcmMvd3Atc2VvLWVkaXQtcGFnZS5qcz9iZjg0Il0sInNvdXJjZXNDb250ZW50IjpbIiggZnVuY3Rpb24oICQgKSB7XG5cdC8vIFNldCB0aGUgeW9hc3QtdG9vbHRpcHMgb24gdGhlIGxpc3QgdGFibGUgbGlua3MgY29sdW1ucyB0aGF0IGhhdmUgbGlua3MuXG5cdCQoIFwiLnlvYXN0LWNvbHVtbi1oZWFkZXItaGFzLXRvb2x0aXBcIiApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBwYXJlbnRMaW5rID0gJCggdGhpcyApLmNsb3Nlc3QoIFwidGhcIiApLmZpbmQoIFwiYVwiICk7XG5cblx0XHRwYXJlbnRMaW5rXG5cdFx0XHQuYWRkQ2xhc3MoIFwieW9hc3QtdG9vbHRpcCB5b2FzdC10b29sdGlwLW4geW9hc3QtdG9vbHRpcC1tdWx0aWxpbmVcIiApXG5cdFx0XHQuYXR0ciggXCJhcmlhLWxhYmVsXCIsICQoIHRoaXMgKS5kYXRhKCBcImxhYmVsXCIgKSApO1xuXHR9ICk7XG5cblx0Ly8gQ2xlYW4gdXAgdGhlIGNvbHVtbnMgdGl0bGVzIEhUTUwgZm9yIHRoZSBTY3JlZW4gT3B0aW9ucyBjaGVja2JveGVzIGxhYmVscy5cblx0JCggXCIueW9hc3QtY29sdW1uLWhlYWRlci1oYXMtdG9vbHRpcCwgLnlvYXN0LXRvb2x0aXBcIiwgXCIjc2NyZWVuLW1ldGFcIiApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdHZhciB0ZXh0ID0gJCggdGhpcyApLnRleHQoKTtcblx0XHQkKCB0aGlzICkucmVwbGFjZVdpdGgoIHRleHQgKTtcblx0fSApO1xufSggalF1ZXJ5ICkgKTtcbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./js/src/wp-seo-edit-page.js\n");

/***/ })

/******/ });