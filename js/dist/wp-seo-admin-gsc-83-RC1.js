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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/src/wp-seo-admin-gsc.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/src/wp-seo-admin-gsc.js":
/*!************************************!*\
  !*** ./js/src/wp-seo-admin-gsc.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/* global ajaxurl */\n/* global tb_click */\n\njQuery(function () {\n\tjQuery(\".subsubsub .yoast_help\").on(\"click active\", function () {\n\t\tvar targetElementID = \"#\" + jQuery(this).attr(\"aria-controls\");\n\t\tjQuery(\".yoast-help-panel\").not(targetElementID).hide();\n\t});\n\n\t// Store the control that opened the modal dialog for later use.\n\tvar $gscModalFocusedBefore;\n\n\tjQuery(\"#gsc_auth_code\").click(function () {\n\t\tvar authUrl = jQuery(\"#gsc_auth_url\").val(),\n\t\t    w = 600,\n\t\t    h = 500,\n\t\t    left = screen.width / 2 - w / 2,\n\t\t    top = screen.height / 2 - h / 2;\n\t\treturn window.open(authUrl, \"wpseogscauthcode\", \"toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, \" + \"copyhistory=no, width=\" + w + \", height=\" + h + \", top=\" + top + \", left=\" + left);\n\t});\n\n\t// Accessibility improvements for the Create Redirect modal dialog.\n\tjQuery(\".wpseo-open-gsc-redirect-modal\").click(function (event) {\n\t\tvar $modal;\n\t\tvar $modalTitle;\n\t\tvar $closeButtonTop;\n\t\tvar $closeButtonBottom;\n\n\t\t// Get the link text to be used as the modal title.\n\t\tvar title = jQuery(this).text();\n\n\t\t// Prevent default action.\n\t\tevent.preventDefault();\n\t\t// Prevent triggering Thickbox original click.\n\t\tevent.stopPropagation();\n\t\t// Get the control that opened the modal dialog.\n\t\t$gscModalFocusedBefore = jQuery(this);\n\t\t// Call Thickbox now and bind `this`. The Thickbox UI is now available.\n\t\t// eslint-disable-next-line\n\t\ttb_click.call(this);\n\n\t\t// Get the Thickbox modal elements.\n\t\t$modal = jQuery(\"#TB_window\");\n\t\t$modalTitle = jQuery(\"#TB_ajaxWindowTitle\");\n\t\t$closeButtonTop = jQuery(\"#TB_closeWindowButton\");\n\t\t$closeButtonBottom = jQuery(\".wpseo-redirect-close\", $modal);\n\n\t\t// Set the modal title.\n\t\t$modalTitle.text(title);\n\n\t\t// Set ARIA role and ARIA attributes.\n\t\t$modal.attr({\n\t\t\trole: \"dialog\",\n\t\t\t\"aria-labelledby\": \"TB_ajaxWindowTitle\",\n\t\t\t\"aria-describedby\": \"TB_ajaxContent\"\n\t\t}).on(\"keydown\", function (event) {\n\t\t\tvar id;\n\n\t\t\t// Constrain tabbing within the modal.\n\t\t\tif (9 === event.which) {\n\t\t\t\tid = event.target.id;\n\n\t\t\t\tif (jQuery(event.target).hasClass(\"wpseo-redirect-close\") && !event.shiftKey) {\n\t\t\t\t\t$closeButtonTop.focus();\n\t\t\t\t\tevent.preventDefault();\n\t\t\t\t} else if (id === \"TB_closeWindowButton\" && event.shiftKey) {\n\t\t\t\t\t$closeButtonBottom.focus();\n\t\t\t\t\tevent.preventDefault();\n\t\t\t\t}\n\t\t\t}\n\t\t});\n\t});\n\n\tjQuery(document.body).on(\"click\", \".wpseo-redirect-close\", function () {\n\t\t// Close the Thickbox modal when clicking on the bottom button.\n\t\tjQuery(this).closest(\"#TB_window\").find(\"#TB_closeWindowButton\").trigger(\"click\");\n\t}).on(\"thickbox:removed\", function () {\n\t\t// Move focus back to the element that opened the modal.\n\t\t$gscModalFocusedBefore.focus();\n\t});\n});\n\n/**\n * Decrement current category count by one.\n *\n * @param {string} category The category count to update.\n *\n * @returns {void}\n */\nfunction wpseoUpdateCategoryCount(category) {\n\tvar countElement = jQuery(\"#gsc_count_\" + category + \"\");\n\tvar newCount = parseInt(countElement.text(), 10) - 1;\n\tif (newCount < 0) {\n\t\tnewCount = 0;\n\t}\n\n\tcountElement.text(newCount);\n}\n\n/**\n * Sends the request to mark the given url as fixed.\n *\n * @param {string} nonce    The nonce for the request\n * @param {string} platform The platform to mark the issue for.\n * @param {string} category The category to mark the issue for.\n * @param {string} url      The url to mark as fixed.\n *\n * @returns {void}\n */\nfunction wpseoSendMarkAsFixed(nonce, platform, category, url) {\n\tjQuery.post(ajaxurl, {\n\t\taction: \"wpseo_mark_fixed_crawl_issue\",\n\t\t// eslint-disable-next-line\n\t\tajax_nonce: nonce,\n\t\tplatform: platform,\n\t\tcategory: category,\n\t\turl: url\n\t}, function (response) {\n\t\tif (\"true\" === response) {\n\t\t\twpseoUpdateCategoryCount(jQuery(\"#field_category\").val());\n\t\t\tjQuery('span:contains(\"' + url + '\")').closest(\"tr\").remove();\n\t\t}\n\t});\n}\n\n/**\n * Marks a search console crawl issue as fixed.\n *\n * @param {string} url The URL that has been fixed.\n *\n * @returns {void}\n */\nfunction wpseoMarkAsFixed(url) {\n\twpseoSendMarkAsFixed(jQuery(\".wpseo-gsc-ajax-security\").val(), jQuery(\"#field_platform\").val(), jQuery(\"#field_category\").val(), url);\n}\n\nwindow.wpseoUpdateCategoryCount = wpseoUpdateCategoryCount;\nwindow.wpseoMarkAsFixed = wpseoMarkAsFixed;\nwindow.wpseoSendMarkAsFixed = wpseoSendMarkAsFixed;\n\n/* eslint-disable camelcase */\nwindow.wpseo_update_category_count = wpseoUpdateCategoryCount;\nwindow.wpseo_mark_as_fixed = wpseoMarkAsFixed;\nwindow.wpseo_send_mark_as_fixed = wpseoSendMarkAsFixed;\n/* eslint-enable camelcase *///# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9qcy9zcmMvd3Atc2VvLWFkbWluLWdzYy5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9qcy9zcmMvd3Atc2VvLWFkbWluLWdzYy5qcz9iZmU1Il0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCBhamF4dXJsICovXG4vKiBnbG9iYWwgdGJfY2xpY2sgKi9cblxualF1ZXJ5KCBmdW5jdGlvbigpIHtcblx0alF1ZXJ5KCBcIi5zdWJzdWJzdWIgLnlvYXN0X2hlbHBcIiApLm9uKFxuXHRcdFwiY2xpY2sgYWN0aXZlXCIsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRsZXQgdGFyZ2V0RWxlbWVudElEID0gXCIjXCIgKyBqUXVlcnkoIHRoaXMgKS5hdHRyKCBcImFyaWEtY29udHJvbHNcIiApO1xuXHRcdFx0alF1ZXJ5KCBcIi55b2FzdC1oZWxwLXBhbmVsXCIgKS5ub3QoIHRhcmdldEVsZW1lbnRJRCApLmhpZGUoKTtcblx0XHR9XG5cdCk7XG5cblxuXHQvLyBTdG9yZSB0aGUgY29udHJvbCB0aGF0IG9wZW5lZCB0aGUgbW9kYWwgZGlhbG9nIGZvciBsYXRlciB1c2UuXG5cdHZhciAkZ3NjTW9kYWxGb2N1c2VkQmVmb3JlO1xuXG5cdGpRdWVyeSggXCIjZ3NjX2F1dGhfY29kZVwiICkuY2xpY2soXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgYXV0aFVybCA9IGpRdWVyeSggXCIjZ3NjX2F1dGhfdXJsXCIgKS52YWwoKSxcblx0XHRcdFx0dyA9IDYwMCxcblx0XHRcdFx0aCA9IDUwMCxcblx0XHRcdFx0bGVmdCA9ICggc2NyZWVuLndpZHRoIC8gMiApIC0gKCB3IC8gMiApLFxuXHRcdFx0XHR0b3AgPSAoIHNjcmVlbi5oZWlnaHQgLyAyICkgLSAoIGggLyAyICk7XG5cdFx0XHRyZXR1cm4gd2luZG93Lm9wZW4oXG5cdFx0XHRcdGF1dGhVcmwsXG5cdFx0XHRcdFwid3BzZW9nc2NhdXRoY29kZVwiLFxuXHRcdFx0XHRcInRvb2xiYXI9bm8sIGxvY2F0aW9uPW5vLCBkaXJlY3Rvcmllcz1ubywgc3RhdHVzPW5vLCBtZW51YmFyPW5vLCBzY3JvbGxiYXJzPXllcywgcmVzaXphYmxlPW5vLCBcIiArXG5cdFx0XHRcdFwiY29weWhpc3Rvcnk9bm8sIHdpZHRoPVwiICsgdyArIFwiLCBoZWlnaHQ9XCIgKyBoICsgXCIsIHRvcD1cIiArIHRvcCArIFwiLCBsZWZ0PVwiICsgbGVmdFxuXHRcdFx0KTtcblx0XHR9XG5cdCk7XG5cblx0Ly8gQWNjZXNzaWJpbGl0eSBpbXByb3ZlbWVudHMgZm9yIHRoZSBDcmVhdGUgUmVkaXJlY3QgbW9kYWwgZGlhbG9nLlxuXHRqUXVlcnkoIFwiLndwc2VvLW9wZW4tZ3NjLXJlZGlyZWN0LW1vZGFsXCIgKS5jbGljayhcblx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHR2YXIgJG1vZGFsO1xuXHRcdFx0dmFyICRtb2RhbFRpdGxlO1xuXHRcdFx0dmFyICRjbG9zZUJ1dHRvblRvcDtcblx0XHRcdHZhciAkY2xvc2VCdXR0b25Cb3R0b207XG5cblx0XHRcdC8vIEdldCB0aGUgbGluayB0ZXh0IHRvIGJlIHVzZWQgYXMgdGhlIG1vZGFsIHRpdGxlLlxuXHRcdFx0dmFyIHRpdGxlID0galF1ZXJ5KCB0aGlzICkudGV4dCgpO1xuXG5cdFx0XHQvLyBQcmV2ZW50IGRlZmF1bHQgYWN0aW9uLlxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdC8vIFByZXZlbnQgdHJpZ2dlcmluZyBUaGlja2JveCBvcmlnaW5hbCBjbGljay5cblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0Ly8gR2V0IHRoZSBjb250cm9sIHRoYXQgb3BlbmVkIHRoZSBtb2RhbCBkaWFsb2cuXG5cdFx0XHQkZ3NjTW9kYWxGb2N1c2VkQmVmb3JlID0galF1ZXJ5KCB0aGlzICk7XG5cdFx0XHQvLyBDYWxsIFRoaWNrYm94IG5vdyBhbmQgYmluZCBgdGhpc2AuIFRoZSBUaGlja2JveCBVSSBpcyBub3cgYXZhaWxhYmxlLlxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5cdFx0XHR0Yl9jbGljay5jYWxsKCB0aGlzICk7XG5cblx0XHRcdC8vIEdldCB0aGUgVGhpY2tib3ggbW9kYWwgZWxlbWVudHMuXG5cdFx0XHQkbW9kYWwgPSBqUXVlcnkoIFwiI1RCX3dpbmRvd1wiICk7XG5cdFx0XHQkbW9kYWxUaXRsZSA9IGpRdWVyeSggXCIjVEJfYWpheFdpbmRvd1RpdGxlXCIgKTtcblx0XHRcdCRjbG9zZUJ1dHRvblRvcCA9IGpRdWVyeSggXCIjVEJfY2xvc2VXaW5kb3dCdXR0b25cIiApO1xuXHRcdFx0JGNsb3NlQnV0dG9uQm90dG9tID0galF1ZXJ5KCBcIi53cHNlby1yZWRpcmVjdC1jbG9zZVwiLCAkbW9kYWwgKTtcblxuXHRcdFx0Ly8gU2V0IHRoZSBtb2RhbCB0aXRsZS5cblx0XHRcdCRtb2RhbFRpdGxlLnRleHQoIHRpdGxlICk7XG5cblx0XHRcdC8vIFNldCBBUklBIHJvbGUgYW5kIEFSSUEgYXR0cmlidXRlcy5cblx0XHRcdCRtb2RhbC5hdHRyKCB7XG5cdFx0XHRcdHJvbGU6IFwiZGlhbG9nXCIsXG5cdFx0XHRcdFwiYXJpYS1sYWJlbGxlZGJ5XCI6IFwiVEJfYWpheFdpbmRvd1RpdGxlXCIsXG5cdFx0XHRcdFwiYXJpYS1kZXNjcmliZWRieVwiOiBcIlRCX2FqYXhDb250ZW50XCIsXG5cdFx0XHR9IClcblx0XHRcdC5vbiggXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0dmFyIGlkO1xuXG5cdFx0XHRcdC8vIENvbnN0cmFpbiB0YWJiaW5nIHdpdGhpbiB0aGUgbW9kYWwuXG5cdFx0XHRcdGlmICggOSA9PT0gZXZlbnQud2hpY2ggKSB7XG5cdFx0XHRcdFx0aWQgPSBldmVudC50YXJnZXQuaWQ7XG5cblx0XHRcdFx0XHRpZiAoIGpRdWVyeSggZXZlbnQudGFyZ2V0ICkuaGFzQ2xhc3MoIFwid3BzZW8tcmVkaXJlY3QtY2xvc2VcIiApICYmICEgZXZlbnQuc2hpZnRLZXkgKSB7XG5cdFx0XHRcdFx0XHQkY2xvc2VCdXR0b25Ub3AuZm9jdXMoKTtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggaWQgPT09IFwiVEJfY2xvc2VXaW5kb3dCdXR0b25cIiAmJiBldmVudC5zaGlmdEtleSApIHtcblx0XHRcdFx0XHRcdCRjbG9zZUJ1dHRvbkJvdHRvbS5mb2N1cygpO1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cdCk7XG5cblx0alF1ZXJ5KCBkb2N1bWVudC5ib2R5ICkub24oIFwiY2xpY2tcIiwgXCIud3BzZW8tcmVkaXJlY3QtY2xvc2VcIiwgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gQ2xvc2UgdGhlIFRoaWNrYm94IG1vZGFsIHdoZW4gY2xpY2tpbmcgb24gdGhlIGJvdHRvbSBidXR0b24uXG5cdFx0alF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggXCIjVEJfd2luZG93XCIgKS5maW5kKCBcIiNUQl9jbG9zZVdpbmRvd0J1dHRvblwiICkudHJpZ2dlciggXCJjbGlja1wiICk7XG5cdH0gKS5vbiggXCJ0aGlja2JveDpyZW1vdmVkXCIsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIE1vdmUgZm9jdXMgYmFjayB0byB0aGUgZWxlbWVudCB0aGF0IG9wZW5lZCB0aGUgbW9kYWwuXG5cdFx0JGdzY01vZGFsRm9jdXNlZEJlZm9yZS5mb2N1cygpO1xuXHR9ICk7XG59ICk7XG5cblxuLyoqXG4gKiBEZWNyZW1lbnQgY3VycmVudCBjYXRlZ29yeSBjb3VudCBieSBvbmUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNhdGVnb3J5IFRoZSBjYXRlZ29yeSBjb3VudCB0byB1cGRhdGUuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIHdwc2VvVXBkYXRlQ2F0ZWdvcnlDb3VudCggY2F0ZWdvcnkgKSB7XG5cdHZhciBjb3VudEVsZW1lbnQgPSBqUXVlcnkoIFwiI2dzY19jb3VudF9cIiArIGNhdGVnb3J5ICsgXCJcIiApO1xuXHR2YXIgbmV3Q291bnQgICAgID0gcGFyc2VJbnQoIGNvdW50RWxlbWVudC50ZXh0KCksIDEwICkgLSAxO1xuXHRpZiggbmV3Q291bnQgPCAwICkge1xuXHRcdG5ld0NvdW50ID0gMDtcblx0fVxuXG5cdGNvdW50RWxlbWVudC50ZXh0KCBuZXdDb3VudCApO1xufVxuXG4vKipcbiAqIFNlbmRzIHRoZSByZXF1ZXN0IHRvIG1hcmsgdGhlIGdpdmVuIHVybCBhcyBmaXhlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbm9uY2UgICAgVGhlIG5vbmNlIGZvciB0aGUgcmVxdWVzdFxuICogQHBhcmFtIHtzdHJpbmd9IHBsYXRmb3JtIFRoZSBwbGF0Zm9ybSB0byBtYXJrIHRoZSBpc3N1ZSBmb3IuXG4gKiBAcGFyYW0ge3N0cmluZ30gY2F0ZWdvcnkgVGhlIGNhdGVnb3J5IHRvIG1hcmsgdGhlIGlzc3VlIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgICAgICBUaGUgdXJsIHRvIG1hcmsgYXMgZml4ZWQuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIHdwc2VvU2VuZE1hcmtBc0ZpeGVkKCBub25jZSwgcGxhdGZvcm0sIGNhdGVnb3J5LCB1cmwgKSB7XG5cdGpRdWVyeS5wb3N0KFxuXHRcdGFqYXh1cmwsXG5cdFx0e1xuXHRcdFx0YWN0aW9uOiBcIndwc2VvX21hcmtfZml4ZWRfY3Jhd2xfaXNzdWVcIixcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuXHRcdFx0YWpheF9ub25jZTogbm9uY2UsXG5cdFx0XHRwbGF0Zm9ybTogcGxhdGZvcm0sXG5cdFx0XHRjYXRlZ29yeTogY2F0ZWdvcnksXG5cdFx0XHR1cmw6IHVybCxcblx0XHR9LFxuXHRcdGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdGlmICggXCJ0cnVlXCIgPT09IHJlc3BvbnNlICkge1xuXHRcdFx0XHR3cHNlb1VwZGF0ZUNhdGVnb3J5Q291bnQoIGpRdWVyeSggXCIjZmllbGRfY2F0ZWdvcnlcIiApLnZhbCgpICk7XG5cdFx0XHRcdGpRdWVyeSggJ3NwYW46Y29udGFpbnMoXCInICsgdXJsICsgJ1wiKScgKS5jbG9zZXN0KCBcInRyXCIgKS5yZW1vdmUoKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG59XG5cbi8qKlxuICogTWFya3MgYSBzZWFyY2ggY29uc29sZSBjcmF3bCBpc3N1ZSBhcyBmaXhlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdGhhdCBoYXMgYmVlbiBmaXhlZC5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gd3BzZW9NYXJrQXNGaXhlZCggdXJsICkge1xuXHR3cHNlb1NlbmRNYXJrQXNGaXhlZChcblx0XHRqUXVlcnkoIFwiLndwc2VvLWdzYy1hamF4LXNlY3VyaXR5XCIgKS52YWwoKSxcblx0XHRqUXVlcnkoIFwiI2ZpZWxkX3BsYXRmb3JtXCIgKS52YWwoKSxcblx0XHRqUXVlcnkoIFwiI2ZpZWxkX2NhdGVnb3J5XCIgKS52YWwoKSxcblx0XHR1cmxcblx0KTtcbn1cblxud2luZG93Lndwc2VvVXBkYXRlQ2F0ZWdvcnlDb3VudCA9IHdwc2VvVXBkYXRlQ2F0ZWdvcnlDb3VudDtcbndpbmRvdy53cHNlb01hcmtBc0ZpeGVkID0gd3BzZW9NYXJrQXNGaXhlZDtcbndpbmRvdy53cHNlb1NlbmRNYXJrQXNGaXhlZCA9IHdwc2VvU2VuZE1hcmtBc0ZpeGVkO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UgKi9cbndpbmRvdy53cHNlb191cGRhdGVfY2F0ZWdvcnlfY291bnQgPSB3cHNlb1VwZGF0ZUNhdGVnb3J5Q291bnQ7XG53aW5kb3cud3BzZW9fbWFya19hc19maXhlZCA9IHdwc2VvTWFya0FzRml4ZWQ7XG53aW5kb3cud3BzZW9fc2VuZF9tYXJrX2FzX2ZpeGVkID0gd3BzZW9TZW5kTWFya0FzRml4ZWQ7XG4vKiBlc2xpbnQtZW5hYmxlIGNhbWVsY2FzZSAqL1xuIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtBO0FBTUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FBVUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5BO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./js/src/wp-seo-admin-gsc.js\n");

/***/ })

/******/ });