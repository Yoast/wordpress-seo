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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/src/wp-seo-network-admin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/src/wp-seo-network-admin.js":
/*!****************************************!*\
  !*** ./js/src/wp-seo-network-admin.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _a11ySpeak = __webpack_require__(/*! a11y-speak */ \"./node_modules/a11y-speak/a11y-speak.js\");\n\nvar _a11ySpeak2 = _interopRequireDefault(_a11ySpeak);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n(function ($) {\n\t\"use strict\";\n\n\t/**\n  * Displays given settings errors.\n  *\n  * @param {Object} settingsErrors The list of settings error objects.\n  *\n  * @returns {void}\n  */\n\n\tfunction displaySettingsErrors(settingsErrors) {\n\t\tvar $heading = $(\".wrap > h1\");\n\t\tvar notices;\n\t\tvar prefix;\n\n\t\tif (!settingsErrors.length) {\n\t\t\treturn;\n\t\t}\n\n\t\tnotices = settingsErrors.map(function (settingsError) {\n\t\t\treturn \"<div class='\" + settingsError.type + \" notice'><p>\" + settingsError.message + \"</p></div>\";\n\t\t});\n\n\t\t$heading.after(notices.join(\"\"));\n\n\t\tprefix = wpseoNetworkAdminGlobalL10n.error_prefix;\n\t\tif (settingsErrors[0].type === \"updated\") {\n\t\t\tprefix = wpseoNetworkAdminGlobalL10n.success_prefix;\n\t\t}\n\n\t\t(0, _a11ySpeak2.default)(prefix.replace(\"%s\", settingsErrors[0].message), \"assertive\");\n\t}\n\n\t/**\n  * Handles a form submission with AJAX.\n  *\n  * @param {Event} event The submission event.\n  *\n  * @returns {void}\n  */\n\tfunction handleAJAXSubmission(event) {\n\t\tvar $form = $(this);\n\t\tvar $submit = $form.find(\"[type='submit']:focus\");\n\t\tvar formData = $form.serialize();\n\n\t\tevent.preventDefault();\n\n\t\t$(\".wrap > .notice\").remove();\n\n\t\tif (!$submit.length) {\n\t\t\t$submit = $(\".wpseotab.active [type='submit']\");\n\t\t}\n\n\t\tif ($submit.attr(\"name\") === \"action\") {\n\t\t\tformData = formData.replace(/action=([a-zA-Z0-9_]+)/, \"action=\" + $submit.val());\n\t\t}\n\n\t\t$.ajax({\n\t\t\ttype: \"POST\",\n\t\t\turl: ajaxurl,\n\t\t\tdata: formData\n\t\t}).done(function (response) {\n\t\t\tif (!response.data) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tdisplaySettingsErrors(response.data);\n\t\t}).fail(function (xhr) {\n\t\t\tvar response = xhr.responseJSON;\n\n\t\t\tif (!response || !response.data) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tdisplaySettingsErrors(response.data);\n\t\t});\n\n\t\treturn false;\n\t}\n\n\t$(document).ready(function () {\n\t\tvar $form = $(\"#wpseo-conf\");\n\n\t\tif (!$form.length) {\n\t\t\treturn;\n\t\t}\n\n\t\t$form.on(\"submit\", handleAJAXSubmission);\n\t});\n})(jQuery); /* global wpseoNetworkAdminGlobalL10n, ajaxurl *///# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9qcy9zcmMvd3Atc2VvLW5ldHdvcmstYWRtaW4uanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vanMvc3JjL3dwLXNlby1uZXR3b3JrLWFkbWluLmpzP2RlZjkiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIHdwc2VvTmV0d29ya0FkbWluR2xvYmFsTDEwbiwgYWpheHVybCAqL1xuXG5pbXBvcnQgYTExeVNwZWFrIGZyb20gXCJhMTF5LXNwZWFrXCI7XG5cbiggZnVuY3Rpb24oICQgKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdC8qKlxuXHQgKiBEaXNwbGF5cyBnaXZlbiBzZXR0aW5ncyBlcnJvcnMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc0Vycm9ycyBUaGUgbGlzdCBvZiBzZXR0aW5ncyBlcnJvciBvYmplY3RzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGRpc3BsYXlTZXR0aW5nc0Vycm9ycyggc2V0dGluZ3NFcnJvcnMgKSB7XG5cdFx0dmFyICRoZWFkaW5nID0gJCggXCIud3JhcCA+IGgxXCIgKTtcblx0XHR2YXIgbm90aWNlcztcblx0XHR2YXIgcHJlZml4O1xuXG5cdFx0aWYgKCAhIHNldHRpbmdzRXJyb3JzLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRub3RpY2VzID0gc2V0dGluZ3NFcnJvcnMubWFwKCBmdW5jdGlvbiggc2V0dGluZ3NFcnJvciApIHtcblx0XHRcdHJldHVybiBcIjxkaXYgY2xhc3M9J1wiICsgc2V0dGluZ3NFcnJvci50eXBlICsgXCIgbm90aWNlJz48cD5cIiArIHNldHRpbmdzRXJyb3IubWVzc2FnZSArIFwiPC9wPjwvZGl2PlwiO1xuXHRcdH0gKTtcblxuXHRcdCRoZWFkaW5nLmFmdGVyKCBub3RpY2VzLmpvaW4oIFwiXCIgKSApO1xuXG5cdFx0cHJlZml4ID0gd3BzZW9OZXR3b3JrQWRtaW5HbG9iYWxMMTBuLmVycm9yX3ByZWZpeDtcblx0XHRpZiAoIHNldHRpbmdzRXJyb3JzWyAwIF0udHlwZSA9PT0gXCJ1cGRhdGVkXCIgKSB7XG5cdFx0XHRwcmVmaXggPSB3cHNlb05ldHdvcmtBZG1pbkdsb2JhbEwxMG4uc3VjY2Vzc19wcmVmaXg7XG5cdFx0fVxuXG5cdFx0YTExeVNwZWFrKCBwcmVmaXgucmVwbGFjZSggXCIlc1wiLCBzZXR0aW5nc0Vycm9yc1sgMCBdLm1lc3NhZ2UgKSwgXCJhc3NlcnRpdmVcIiApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgYSBmb3JtIHN1Ym1pc3Npb24gd2l0aCBBSkFYLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgc3VibWlzc2lvbiBldmVudC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBoYW5kbGVBSkFYU3VibWlzc2lvbiggZXZlbnQgKSB7XG5cdFx0dmFyICRmb3JtICAgID0gJCggdGhpcyApO1xuXHRcdHZhciAkc3VibWl0ICA9ICRmb3JtLmZpbmQoIFwiW3R5cGU9J3N1Ym1pdCddOmZvY3VzXCIgKTtcblx0XHR2YXIgZm9ybURhdGEgPSAkZm9ybS5zZXJpYWxpemUoKTtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHQkKCBcIi53cmFwID4gLm5vdGljZVwiICkucmVtb3ZlKCk7XG5cblx0XHRpZiAoICEgJHN1Ym1pdC5sZW5ndGggKSB7XG5cdFx0XHQkc3VibWl0ID0gJCggXCIud3BzZW90YWIuYWN0aXZlIFt0eXBlPSdzdWJtaXQnXVwiICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAkc3VibWl0LmF0dHIoIFwibmFtZVwiICkgPT09IFwiYWN0aW9uXCIgKSB7XG5cdFx0XHRmb3JtRGF0YSA9IGZvcm1EYXRhLnJlcGxhY2UoIC9hY3Rpb249KFthLXpBLVowLTlfXSspLywgXCJhY3Rpb249XCIgKyAkc3VibWl0LnZhbCgpICk7XG5cdFx0fVxuXG5cdFx0JC5hamF4KCB7XG5cdFx0XHR0eXBlOiBcIlBPU1RcIixcblx0XHRcdHVybDogYWpheHVybCxcblx0XHRcdGRhdGE6IGZvcm1EYXRhLFxuXHRcdH0gKVxuXHRcdFx0LmRvbmUoIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0aWYgKCAhIHJlc3BvbnNlLmRhdGEgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGlzcGxheVNldHRpbmdzRXJyb3JzKCByZXNwb25zZS5kYXRhICk7XG5cdFx0XHR9IClcblx0XHRcdC5mYWlsKCBmdW5jdGlvbiggeGhyICkge1xuXHRcdFx0XHR2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VKU09OO1xuXG5cdFx0XHRcdGlmICggISByZXNwb25zZSB8fCAhIHJlc3BvbnNlLmRhdGEgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGlzcGxheVNldHRpbmdzRXJyb3JzKCByZXNwb25zZS5kYXRhICk7XG5cdFx0XHR9ICk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQkKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblx0XHR2YXIgJGZvcm0gPSAkKCBcIiN3cHNlby1jb25mXCIgKTtcblxuXHRcdGlmICggISAkZm9ybS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JGZvcm0ub24oIFwic3VibWl0XCIsIGhhbmRsZUFKQVhTdWJtaXNzaW9uICk7XG5cdH0gKTtcbn0oIGpRdWVyeSApICk7XG4iXSwibWFwcGluZ3MiOiI7O0FBRUE7QUFDQTs7Ozs7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./js/src/wp-seo-network-admin.js\n");

/***/ }),

/***/ "./node_modules/a11y-speak/a11y-speak.js":
/*!***********************************************!*\
  !*** ./node_modules/a11y-speak/a11y-speak.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var containerPolite, containerAssertive, previousMessage = \"\";\n\n/**\n * Build the live regions markup.\n *\n * @param {String} ariaLive Optional. Value for the \"aria-live\" attribute, default \"polite\".\n *\n * @returns {Object} $container The ARIA live region jQuery object.\n */\nvar addContainer = function( ariaLive ) {\n\tariaLive = ariaLive || \"polite\";\n\n\tvar container = document.createElement( \"div\" );\n\tcontainer.id = \"a11y-speak-\" + ariaLive;\n\tcontainer.className = \"a11y-speak-region\";\n\n\tvar screenReaderTextStyle = \"clip: rect(1px, 1px, 1px, 1px); position: absolute; height: 1px; width: 1px; overflow: hidden; word-wrap: normal;\";\n\tcontainer.setAttribute( \"style\", screenReaderTextStyle );\n\n\tcontainer.setAttribute( \"aria-live\", ariaLive );\n\tcontainer.setAttribute( \"aria-relevant\", \"additions text\" );\n\tcontainer.setAttribute( \"aria-atomic\", \"true\" );\n\n\tdocument.querySelector( \"body\" ).appendChild( container );\n\treturn container;\n};\n\n/**\n * Specify a function to execute when the DOM is fully loaded.\n *\n * @param {Function} callback A function to execute after the DOM is ready.\n *\n * @returns {void}\n */\nvar domReady = function( callback ) {\n\tif ( document.readyState === \"complete\" || ( document.readyState !== \"loading\" && !document.documentElement.doScroll ) ) {\n\t\treturn callback();\n\t}\n\n\tdocument.addEventListener( \"DOMContentLoaded\", callback );\n};\n\n/**\n * Create the live regions when the DOM is fully loaded.\n */\ndomReady( function() {\n\tcontainerPolite = document.getElementById( \"a11y-speak-polite\" );\n\tcontainerAssertive = document.getElementById( \"a11y-speak-assertive\" );\n\n\tif ( containerPolite === null ) {\n\t\tcontainerPolite = addContainer( \"polite\" );\n\t}\n\tif ( containerAssertive === null ) {\n\t\tcontainerAssertive = addContainer( \"assertive\" );\n\t}\n} );\n\n/**\n * Clear the live regions.\n */\nvar clear = function() {\n\tvar regions = document.querySelectorAll( \".a11y-speak-region\" );\n\tfor ( var i = 0; i < regions.length; i++ ) {\n\t\tregions[ i ].textContent = \"\";\n\t}\n};\n\n/**\n * Update the ARIA live notification area text node.\n *\n * @param {String} message  The message to be announced by Assistive Technologies.\n * @param {String} ariaLive Optional. The politeness level for aria-live. Possible values:\n *                          polite or assertive. Default polite.\n */\nvar A11ySpeak = function( message, ariaLive ) {\n\t// Clear previous messages to allow repeated strings being read out.\n\tclear();\n\n\t/*\n\t * Strip HTML tags (if any) from the message string. Ideally, messages should\n\t * be simple strings, carefully crafted for specific use with A11ySpeak.\n\t * When re-using already existing strings this will ensure simple HTML to be\n\t * stripped out and replaced with a space. Browsers will collapse multiple\n\t * spaces natively.\n\t */\n\tmessage = message.replace( /<[^<>]+>/g, \" \" );\n\n\tif ( previousMessage === message ) {\n\t\tmessage = message + \"\\u00A0\";\n\t}\n\n\tpreviousMessage = message;\n\n\tif ( containerAssertive && \"assertive\" === ariaLive ) {\n\t\tcontainerAssertive.textContent = message;\n\t} else if ( containerPolite ) {\n\t\tcontainerPolite.textContent = message;\n\t}\n};\n\nmodule.exports = A11ySpeak;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvYTExeS1zcGVhay9hMTF5LXNwZWFrLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ExMXktc3BlYWsvYTExeS1zcGVhay5qcz84Y2NkIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBjb250YWluZXJQb2xpdGUsIGNvbnRhaW5lckFzc2VydGl2ZSwgcHJldmlvdXNNZXNzYWdlID0gXCJcIjtcblxuLyoqXG4gKiBCdWlsZCB0aGUgbGl2ZSByZWdpb25zIG1hcmt1cC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJpYUxpdmUgT3B0aW9uYWwuIFZhbHVlIGZvciB0aGUgXCJhcmlhLWxpdmVcIiBhdHRyaWJ1dGUsIGRlZmF1bHQgXCJwb2xpdGVcIi5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSAkY29udGFpbmVyIFRoZSBBUklBIGxpdmUgcmVnaW9uIGpRdWVyeSBvYmplY3QuXG4gKi9cbnZhciBhZGRDb250YWluZXIgPSBmdW5jdGlvbiggYXJpYUxpdmUgKSB7XG5cdGFyaWFMaXZlID0gYXJpYUxpdmUgfHwgXCJwb2xpdGVcIjtcblxuXHR2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuXHRjb250YWluZXIuaWQgPSBcImExMXktc3BlYWstXCIgKyBhcmlhTGl2ZTtcblx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IFwiYTExeS1zcGVhay1yZWdpb25cIjtcblxuXHR2YXIgc2NyZWVuUmVhZGVyVGV4dFN0eWxlID0gXCJjbGlwOiByZWN0KDFweCwgMXB4LCAxcHgsIDFweCk7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgaGVpZ2h0OiAxcHg7IHdpZHRoOiAxcHg7IG92ZXJmbG93OiBoaWRkZW47IHdvcmQtd3JhcDogbm9ybWFsO1wiO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcInN0eWxlXCIsIHNjcmVlblJlYWRlclRleHRTdHlsZSApO1xuXG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1saXZlXCIsIGFyaWFMaXZlICk7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1yZWxldmFudFwiLCBcImFkZGl0aW9ucyB0ZXh0XCIgKTtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLWF0b21pY1wiLCBcInRydWVcIiApO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIFwiYm9keVwiICkuYXBwZW5kQ2hpbGQoIGNvbnRhaW5lciApO1xuXHRyZXR1cm4gY29udGFpbmVyO1xufTtcblxuLyoqXG4gKiBTcGVjaWZ5IGEgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBET00gaXMgZnVsbHkgbG9hZGVkLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEEgZnVuY3Rpb24gdG8gZXhlY3V0ZSBhZnRlciB0aGUgRE9NIGlzIHJlYWR5LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG52YXIgZG9tUmVhZHkgPSBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG5cdGlmICggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiIHx8ICggZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJsb2FkaW5nXCIgJiYgIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbCApICkge1xuXHRcdHJldHVybiBjYWxsYmFjaygpO1xuXHR9XG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJET01Db250ZW50TG9hZGVkXCIsIGNhbGxiYWNrICk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgbGl2ZSByZWdpb25zIHdoZW4gdGhlIERPTSBpcyBmdWxseSBsb2FkZWQuXG4gKi9cbmRvbVJlYWR5KCBmdW5jdGlvbigpIHtcblx0Y29udGFpbmVyUG9saXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwiYTExeS1zcGVhay1wb2xpdGVcIiApO1xuXHRjb250YWluZXJBc3NlcnRpdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJhMTF5LXNwZWFrLWFzc2VydGl2ZVwiICk7XG5cblx0aWYgKCBjb250YWluZXJQb2xpdGUgPT09IG51bGwgKSB7XG5cdFx0Y29udGFpbmVyUG9saXRlID0gYWRkQ29udGFpbmVyKCBcInBvbGl0ZVwiICk7XG5cdH1cblx0aWYgKCBjb250YWluZXJBc3NlcnRpdmUgPT09IG51bGwgKSB7XG5cdFx0Y29udGFpbmVyQXNzZXJ0aXZlID0gYWRkQ29udGFpbmVyKCBcImFzc2VydGl2ZVwiICk7XG5cdH1cbn0gKTtcblxuLyoqXG4gKiBDbGVhciB0aGUgbGl2ZSByZWdpb25zLlxuICovXG52YXIgY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0dmFyIHJlZ2lvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi5hMTF5LXNwZWFrLXJlZ2lvblwiICk7XG5cdGZvciAoIHZhciBpID0gMDsgaSA8IHJlZ2lvbnMubGVuZ3RoOyBpKysgKSB7XG5cdFx0cmVnaW9uc1sgaSBdLnRleHRDb250ZW50ID0gXCJcIjtcblx0fVxufTtcblxuLyoqXG4gKiBVcGRhdGUgdGhlIEFSSUEgbGl2ZSBub3RpZmljYXRpb24gYXJlYSB0ZXh0IG5vZGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgIFRoZSBtZXNzYWdlIHRvIGJlIGFubm91bmNlZCBieSBBc3Npc3RpdmUgVGVjaG5vbG9naWVzLlxuICogQHBhcmFtIHtTdHJpbmd9IGFyaWFMaXZlIE9wdGlvbmFsLiBUaGUgcG9saXRlbmVzcyBsZXZlbCBmb3IgYXJpYS1saXZlLiBQb3NzaWJsZSB2YWx1ZXM6XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgcG9saXRlIG9yIGFzc2VydGl2ZS4gRGVmYXVsdCBwb2xpdGUuXG4gKi9cbnZhciBBMTF5U3BlYWsgPSBmdW5jdGlvbiggbWVzc2FnZSwgYXJpYUxpdmUgKSB7XG5cdC8vIENsZWFyIHByZXZpb3VzIG1lc3NhZ2VzIHRvIGFsbG93IHJlcGVhdGVkIHN0cmluZ3MgYmVpbmcgcmVhZCBvdXQuXG5cdGNsZWFyKCk7XG5cblx0Lypcblx0ICogU3RyaXAgSFRNTCB0YWdzIChpZiBhbnkpIGZyb20gdGhlIG1lc3NhZ2Ugc3RyaW5nLiBJZGVhbGx5LCBtZXNzYWdlcyBzaG91bGRcblx0ICogYmUgc2ltcGxlIHN0cmluZ3MsIGNhcmVmdWxseSBjcmFmdGVkIGZvciBzcGVjaWZpYyB1c2Ugd2l0aCBBMTF5U3BlYWsuXG5cdCAqIFdoZW4gcmUtdXNpbmcgYWxyZWFkeSBleGlzdGluZyBzdHJpbmdzIHRoaXMgd2lsbCBlbnN1cmUgc2ltcGxlIEhUTUwgdG8gYmVcblx0ICogc3RyaXBwZWQgb3V0IGFuZCByZXBsYWNlZCB3aXRoIGEgc3BhY2UuIEJyb3dzZXJzIHdpbGwgY29sbGFwc2UgbXVsdGlwbGVcblx0ICogc3BhY2VzIG5hdGl2ZWx5LlxuXHQgKi9cblx0bWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZSggLzxbXjw+XSs+L2csIFwiIFwiICk7XG5cblx0aWYgKCBwcmV2aW91c01lc3NhZ2UgPT09IG1lc3NhZ2UgKSB7XG5cdFx0bWVzc2FnZSA9IG1lc3NhZ2UgKyBcIlxcdTAwQTBcIjtcblx0fVxuXG5cdHByZXZpb3VzTWVzc2FnZSA9IG1lc3NhZ2U7XG5cblx0aWYgKCBjb250YWluZXJBc3NlcnRpdmUgJiYgXCJhc3NlcnRpdmVcIiA9PT0gYXJpYUxpdmUgKSB7XG5cdFx0Y29udGFpbmVyQXNzZXJ0aXZlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcblx0fSBlbHNlIGlmICggY29udGFpbmVyUG9saXRlICkge1xuXHRcdGNvbnRhaW5lclBvbGl0ZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQTExeVNwZWFrO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/a11y-speak/a11y-speak.js\n");

/***/ })

/******/ });