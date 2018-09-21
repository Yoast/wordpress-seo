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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/src/wp-seo-admin-media.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/src/wp-seo-admin-media.js":
/*!**************************************!*\
  !*** ./js/src/wp-seo-admin-media.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/* global wpseoMediaL10n */\n/* global wp */\n/* jshint -W097 */\n/* jshint -W003 */\n/* jshint unused:false */\n\n// Taken and adapted from http://www.webmaster-source.com/2013/02/06/using-the-wordpress-3-5-media-uploader-in-your-plugin-or-theme/\njQuery(document).ready(function ($) {\n\t\"use strict\";\n\n\tif (typeof wp.media === \"undefined\") {\n\t\treturn;\n\t}\n\n\t$(\".wpseo_image_upload_button\").each(function (index, element) {\n\t\tvar wpseoTargetId = $(element).attr(\"id\").replace(/_button$/, \"\");\n\t\t// eslint-disable-next-line\n\t\tvar wpseoCustomUploader = wp.media.frames.file_frame = wp.media({\n\t\t\ttitle: wpseoMediaL10n.choose_image,\n\t\t\tbutton: { text: wpseoMediaL10n.choose_image },\n\t\t\tmultiple: false\n\t\t});\n\n\t\twpseoCustomUploader.on(\"select\", function () {\n\t\t\tvar attachment = wpseoCustomUploader.state().get(\"selection\").first().toJSON();\n\t\t\t$(\"#\" + wpseoTargetId).val(attachment.url);\n\t\t});\n\n\t\t$(element).click(function (e) {\n\t\t\te.preventDefault();\n\t\t\twpseoCustomUploader.open();\n\t\t});\n\t});\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9qcy9zcmMvd3Atc2VvLWFkbWluLW1lZGlhLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL2pzL3NyYy93cC1zZW8tYWRtaW4tbWVkaWEuanM/MDdhNyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgd3BzZW9NZWRpYUwxMG4gKi9cbi8qIGdsb2JhbCB3cCAqL1xuLyoganNoaW50IC1XMDk3ICovXG4vKiBqc2hpbnQgLVcwMDMgKi9cbi8qIGpzaGludCB1bnVzZWQ6ZmFsc2UgKi9cblxuLy8gVGFrZW4gYW5kIGFkYXB0ZWQgZnJvbSBodHRwOi8vd3d3LndlYm1hc3Rlci1zb3VyY2UuY29tLzIwMTMvMDIvMDYvdXNpbmctdGhlLXdvcmRwcmVzcy0zLTUtbWVkaWEtdXBsb2FkZXItaW4teW91ci1wbHVnaW4tb3ItdGhlbWUvXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoXG5cdGZ1bmN0aW9uKCAkICkge1xuXHRcdFwidXNlIHN0cmljdFwiO1xuXHRcdGlmKCB0eXBlb2Ygd3AubWVkaWEgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JCggXCIud3BzZW9faW1hZ2VfdXBsb2FkX2J1dHRvblwiICkuZWFjaCggZnVuY3Rpb24oIGluZGV4LCBlbGVtZW50ICkge1xuXHRcdFx0dmFyIHdwc2VvVGFyZ2V0SWQgPSAkKCBlbGVtZW50ICkuYXR0ciggXCJpZFwiICkucmVwbGFjZSggL19idXR0b24kLywgXCJcIiApO1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5cdFx0XHR2YXIgd3BzZW9DdXN0b21VcGxvYWRlciA9IHdwLm1lZGlhLmZyYW1lcy5maWxlX2ZyYW1lID0gd3AubWVkaWEoIHtcblx0XHRcdFx0dGl0bGU6IHdwc2VvTWVkaWFMMTBuLmNob29zZV9pbWFnZSxcblx0XHRcdFx0YnV0dG9uOiB7IHRleHQ6IHdwc2VvTWVkaWFMMTBuLmNob29zZV9pbWFnZSB9LFxuXHRcdFx0XHRtdWx0aXBsZTogZmFsc2UsXG5cdFx0XHR9ICk7XG5cblx0XHRcdHdwc2VvQ3VzdG9tVXBsb2FkZXIub24oIFwic2VsZWN0XCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgYXR0YWNobWVudCA9IHdwc2VvQ3VzdG9tVXBsb2FkZXIuc3RhdGUoKS5nZXQoIFwic2VsZWN0aW9uXCIgKS5maXJzdCgpLnRvSlNPTigpO1xuXHRcdFx0XHQkKCBcIiNcIiArIHdwc2VvVGFyZ2V0SWQgKS52YWwoIGF0dGFjaG1lbnQudXJsICk7XG5cdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHQkKCBlbGVtZW50ICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHdwc2VvQ3VzdG9tVXBsb2FkZXIub3BlbigpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuKTtcbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./js/src/wp-seo-admin-media.js\n");

/***/ })

/******/ });