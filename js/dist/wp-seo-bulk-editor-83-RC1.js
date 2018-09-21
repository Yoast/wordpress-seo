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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/src/wp-seo-bulk-editor.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/src/wp-seo-bulk-editor.js":
/*!**************************************!*\
  !*** ./js/src/wp-seo-bulk-editor.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/* global ajaxurl */\n/* global JSON */\n/* global wpseoBulkEditorNonce */\n/* jshint -W097 */\n\n(function () {\n\t\"use strict\";\n\n\tvar bulkEditor = function bulkEditor(currentTable) {\n\t\tvar newClass = currentTable.find(\"[class^=wpseo-new]\").first().attr(\"class\");\n\t\tvar newId = \"#\" + newClass + \"-\";\n\t\tvar existingId = newId.replace(\"new\", \"existing\");\n\t\tvar columnValue = currentTable.find(\"th[id^=col_existing_yoast]\").first().text().replace(\"Existing \", \"\");\n\n\t\tvar saveMethod = newClass.replace(\"-new-\", \"_save_\");\n\t\tvar saveAllMethod = \"wpseo_save_all_\" + currentTable.attr(\"class\").split(\"wpseo_bulk_\")[1];\n\n\t\tvar bulkType = saveMethod.replace(\"wpseo_save_\", \"\");\n\n\t\tvar options = {\n\t\t\tnewClass: \".\" + newClass,\n\t\t\tnewId: newId,\n\t\t\texistingId: existingId\n\t\t};\n\n\t\tvar instance = {\n\n\t\t\tsubmit_new: function submit_new(id) {\n\t\t\t\tinstance.submitNew(id);\n\t\t\t},\n\t\t\tsubmitNew: function submitNew(id) {\n\t\t\t\tvar newTarget = options.newId + id;\n\t\t\t\tvar existingTarget = options.existingId + id;\n\n\t\t\t\tvar newValue;\n\t\t\t\tif (jQuery(options.newId + id).prop(\"type\") === \"select-one\") {\n\t\t\t\t\tnewValue = jQuery(newTarget).find(\":selected\").text();\n\t\t\t\t} else {\n\t\t\t\t\tnewValue = jQuery(newTarget).val();\n\t\t\t\t}\n\n\t\t\t\tvar currentValue = jQuery(existingTarget).html();\n\n\t\t\t\tif (newValue === currentValue) {\n\t\t\t\t\tjQuery(newTarget).val(\"\");\n\t\t\t\t} else {\n\t\t\t\t\t/* eslint-disable no-alert */\n\t\t\t\t\tif (newValue === \"\" && !window.confirm(\"Are you sure you want to remove the existing \" + columnValue + \"?\")) {\n\t\t\t\t\t\t/* eslint-enable no-alert */\n\t\t\t\t\t\tjQuery(newTarget).val(\"\");\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\n\t\t\t\t\t/* eslint-disable camelcase */\n\t\t\t\t\tvar data = {\n\t\t\t\t\t\taction: saveMethod,\n\t\t\t\t\t\t_ajax_nonce: wpseoBulkEditorNonce,\n\t\t\t\t\t\twpseo_post_id: id,\n\t\t\t\t\t\tnew_value: newValue,\n\t\t\t\t\t\texisting_value: currentValue\n\t\t\t\t\t};\n\t\t\t\t\t/* eslint-enable camelcase */\n\n\t\t\t\t\tjQuery.post(ajaxurl, data, instance.handleResponse);\n\t\t\t\t}\n\t\t\t},\n\n\t\t\tsubmit_all: function submit_all(ev) {\n\t\t\t\tinstance.submitAll(ev);\n\t\t\t},\n\t\t\tsubmitAll: function submitAll(ev) {\n\t\t\t\tev.preventDefault();\n\n\t\t\t\tvar data = {\n\t\t\t\t\taction: saveAllMethod,\n\t\t\t\t\t// eslint-disable-next-line\n\t\t\t\t\t_ajax_nonce: wpseoBulkEditorNonce\n\t\t\t\t};\n\n\t\t\t\tdata.send = false;\n\t\t\t\tdata.items = {};\n\t\t\t\tdata.existingItems = {};\n\n\t\t\t\tjQuery(options.newClass).each(function () {\n\t\t\t\t\tvar id = jQuery(this).data(\"id\");\n\t\t\t\t\tvar value = jQuery(this).val();\n\t\t\t\t\tvar existingValue = jQuery(options.existingId + id).html();\n\n\t\t\t\t\tif (value !== \"\") {\n\t\t\t\t\t\tif (value === existingValue) {\n\t\t\t\t\t\t\tjQuery(options.newId + id).val(\"\");\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tdata.send = true;\n\t\t\t\t\t\t\tdata.items[id] = value;\n\t\t\t\t\t\t\tdata.existingItems[id] = existingValue;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t});\n\n\t\t\t\tif (data.send) {\n\t\t\t\t\tjQuery.post(ajaxurl, data, instance.handleResponses);\n\t\t\t\t}\n\t\t\t},\n\n\t\t\thandle_response: function handle_response(response, status) {\n\t\t\t\tinstance.handleResponse(response, status);\n\t\t\t},\n\t\t\thandleResponse: function handleResponse(response, status) {\n\t\t\t\tif (status !== \"success\") {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tvar resp = response;\n\t\t\t\tif (typeof resp === \"string\") {\n\t\t\t\t\tresp = JSON.parse(resp);\n\t\t\t\t}\n\n\t\t\t\tif (resp instanceof Array) {\n\t\t\t\t\tjQuery.each(resp, function () {\n\t\t\t\t\t\tinstance.handleResponse(this, status);\n\t\t\t\t\t});\n\t\t\t\t} else {\n\t\t\t\t\tif (resp.status === \"success\") {\n\t\t\t\t\t\tvar newValue = resp[\"new_\" + bulkType];\n\n\t\t\t\t\t\tjQuery(options.existingId + resp.post_id).html(newValue.replace(/\\\\(?!\\\\)/g, \"\"));\n\t\t\t\t\t\tjQuery(options.newId + resp.post_id).val(\"\");\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t},\n\n\t\t\thandle_responses: function handle_responses(responses, status) {\n\t\t\t\tinstance.handleResponses(responses, status);\n\t\t\t},\n\t\t\thandleResponses: function handleResponses(responses, status) {\n\t\t\t\tvar resps = jQuery.parseJSON(responses);\n\t\t\t\tjQuery.each(resps, function () {\n\t\t\t\t\tinstance.handleResponse(this, status);\n\t\t\t\t});\n\t\t\t},\n\n\t\t\tset_events: function set_events() {\n\t\t\t\tinstance.setEvents();\n\t\t\t},\n\t\t\tsetEvents: function setEvents() {\n\t\t\t\t// Save link.\n\t\t\t\tcurrentTable.find(\".wpseo-save\").click(function (event) {\n\t\t\t\t\tvar id = jQuery(this).data(\"id\");\n\n\t\t\t\t\tevent.preventDefault();\n\t\t\t\t\tinstance.submitNew(id, this);\n\t\t\t\t});\n\n\t\t\t\t// Save all link.\n\t\t\t\tcurrentTable.find(\".wpseo-save-all\").click(instance.submitAll);\n\n\t\t\t\t// Save title and meta description when pressing Enter on respective field and textarea.\n\t\t\t\tcurrentTable.find(options.newClass).keydown(function (ev) {\n\t\t\t\t\tif (ev.which === 13) {\n\t\t\t\t\t\tev.preventDefault();\n\t\t\t\t\t\tvar id = jQuery(this).data(\"id\");\n\t\t\t\t\t\tinstance.submitNew(id, this);\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t}\n\t\t};\n\n\t\treturn instance;\n\t};\n\t// eslint-disable-next-line\n\twindow.bulk_editor = bulkEditor;\n\twindow.bulkEditor = bulkEditor;\n\n\tjQuery(document).ready(function () {\n\t\tvar parentTables = jQuery('table[class*=\"wpseo_bulk\"]');\n\t\tparentTables.each(function (number, parentTable) {\n\t\t\tvar currentTable = jQuery(parentTable);\n\t\t\tvar bulkEdit = bulkEditor(currentTable);\n\n\t\t\tbulkEdit.setEvents();\n\t\t});\n\t});\n})();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9qcy9zcmMvd3Atc2VvLWJ1bGstZWRpdG9yLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL2pzL3NyYy93cC1zZW8tYnVsay1lZGl0b3IuanM/MjFhMCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgYWpheHVybCAqL1xuLyogZ2xvYmFsIEpTT04gKi9cbi8qIGdsb2JhbCB3cHNlb0J1bGtFZGl0b3JOb25jZSAqL1xuLyoganNoaW50IC1XMDk3ICovXG5cbiggZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXHR2YXIgYnVsa0VkaXRvciA9IGZ1bmN0aW9uKCBjdXJyZW50VGFibGUgKSB7XG5cdFx0dmFyIG5ld0NsYXNzID0gY3VycmVudFRhYmxlLmZpbmQoIFwiW2NsYXNzXj13cHNlby1uZXddXCIgKS5maXJzdCgpLmF0dHIoIFwiY2xhc3NcIiApO1xuXHRcdHZhciBuZXdJZCA9IFwiI1wiICsgbmV3Q2xhc3MgKyBcIi1cIjtcblx0XHR2YXIgZXhpc3RpbmdJZCA9IG5ld0lkLnJlcGxhY2UoIFwibmV3XCIsIFwiZXhpc3RpbmdcIiApO1xuXHRcdHZhciBjb2x1bW5WYWx1ZSA9IGN1cnJlbnRUYWJsZS5maW5kKCBcInRoW2lkXj1jb2xfZXhpc3RpbmdfeW9hc3RdXCIgKS5maXJzdCgpLnRleHQoKS5yZXBsYWNlKCBcIkV4aXN0aW5nIFwiLCBcIlwiICk7XG5cblx0XHR2YXIgc2F2ZU1ldGhvZCA9IG5ld0NsYXNzLnJlcGxhY2UoIFwiLW5ldy1cIiwgXCJfc2F2ZV9cIiApO1xuXHRcdHZhciBzYXZlQWxsTWV0aG9kID0gXCJ3cHNlb19zYXZlX2FsbF9cIiArIGN1cnJlbnRUYWJsZS5hdHRyKCBcImNsYXNzXCIgKS5zcGxpdCggXCJ3cHNlb19idWxrX1wiIClbIDEgXTtcblxuXHRcdHZhciBidWxrVHlwZSA9IHNhdmVNZXRob2QucmVwbGFjZSggXCJ3cHNlb19zYXZlX1wiLCBcIlwiICk7XG5cblx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdG5ld0NsYXNzOiBcIi5cIiArIG5ld0NsYXNzLFxuXHRcdFx0bmV3SWQ6IG5ld0lkLFxuXHRcdFx0ZXhpc3RpbmdJZDogZXhpc3RpbmdJZCxcblx0XHR9O1xuXG5cdFx0dmFyIGluc3RhbmNlID0ge1xuXG5cdFx0XHRzdWJtaXRfbmV3OiBmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHRcdGluc3RhbmNlLnN1Ym1pdE5ldyggaWQgKTtcblx0XHRcdH0sXG5cdFx0XHRzdWJtaXROZXc6IGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdFx0dmFyIG5ld1RhcmdldCA9IG9wdGlvbnMubmV3SWQgKyBpZDtcblx0XHRcdFx0dmFyIGV4aXN0aW5nVGFyZ2V0ID0gb3B0aW9ucy5leGlzdGluZ0lkICsgaWQ7XG5cblx0XHRcdFx0dmFyIG5ld1ZhbHVlO1xuXHRcdFx0XHRpZiAoIGpRdWVyeSggb3B0aW9ucy5uZXdJZCArIGlkICkucHJvcCggXCJ0eXBlXCIgKSA9PT0gXCJzZWxlY3Qtb25lXCIgKSB7XG5cdFx0XHRcdFx0bmV3VmFsdWUgPSBqUXVlcnkoIG5ld1RhcmdldCApLmZpbmQoIFwiOnNlbGVjdGVkXCIgKS50ZXh0KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmV3VmFsdWUgPSBqUXVlcnkoIG5ld1RhcmdldCApLnZhbCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIGN1cnJlbnRWYWx1ZSA9IGpRdWVyeSggZXhpc3RpbmdUYXJnZXQgKS5odG1sKCk7XG5cblx0XHRcdFx0aWYgKCBuZXdWYWx1ZSA9PT0gY3VycmVudFZhbHVlICkge1xuXHRcdFx0XHRcdGpRdWVyeSggbmV3VGFyZ2V0ICkudmFsKCBcIlwiICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0LyogZXNsaW50LWRpc2FibGUgbm8tYWxlcnQgKi9cblx0XHRcdFx0XHRpZiAoICggbmV3VmFsdWUgPT09IFwiXCIgKSAmJiAhIHdpbmRvdy5jb25maXJtKCBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZW1vdmUgdGhlIGV4aXN0aW5nIFwiICsgY29sdW1uVmFsdWUgKyBcIj9cIiApICkge1xuXHRcdFx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBuby1hbGVydCAqL1xuXHRcdFx0XHRcdFx0alF1ZXJ5KCBuZXdUYXJnZXQgKS52YWwoIFwiXCIgKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UgKi9cblx0XHRcdFx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdFx0XHRcdGFjdGlvbjogc2F2ZU1ldGhvZCxcblx0XHRcdFx0XHRcdF9hamF4X25vbmNlOiB3cHNlb0J1bGtFZGl0b3JOb25jZSxcblx0XHRcdFx0XHRcdHdwc2VvX3Bvc3RfaWQ6IGlkLFxuXHRcdFx0XHRcdFx0bmV3X3ZhbHVlOiBuZXdWYWx1ZSxcblx0XHRcdFx0XHRcdGV4aXN0aW5nX3ZhbHVlOiBjdXJyZW50VmFsdWUsXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHQvKiBlc2xpbnQtZW5hYmxlIGNhbWVsY2FzZSAqL1xuXG5cdFx0XHRcdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIGRhdGEsIGluc3RhbmNlLmhhbmRsZVJlc3BvbnNlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHN1Ym1pdF9hbGw6IGZ1bmN0aW9uKCBldiApIHtcblx0XHRcdFx0aW5zdGFuY2Uuc3VibWl0QWxsKCBldiApO1xuXHRcdFx0fSxcblx0XHRcdHN1Ym1pdEFsbDogZnVuY3Rpb24oIGV2ICkge1xuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRcdGFjdGlvbjogc2F2ZUFsbE1ldGhvZCxcblx0XHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcblx0XHRcdFx0XHRfYWpheF9ub25jZTogd3BzZW9CdWxrRWRpdG9yTm9uY2UsXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0ZGF0YS5zZW5kID0gZmFsc2U7XG5cdFx0XHRcdGRhdGEuaXRlbXMgPSB7fTtcblx0XHRcdFx0ZGF0YS5leGlzdGluZ0l0ZW1zID0ge307XG5cblx0XHRcdFx0alF1ZXJ5KCBvcHRpb25zLm5ld0NsYXNzICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIGlkID0galF1ZXJ5KCB0aGlzICkuZGF0YSggXCJpZFwiICk7XG5cdFx0XHRcdFx0dmFyIHZhbHVlID0galF1ZXJ5KCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdFx0dmFyIGV4aXN0aW5nVmFsdWUgPSBqUXVlcnkoIG9wdGlvbnMuZXhpc3RpbmdJZCArIGlkICkuaHRtbCgpO1xuXG5cdFx0XHRcdFx0aWYgKCB2YWx1ZSAhPT0gXCJcIiApIHtcblx0XHRcdFx0XHRcdGlmICggdmFsdWUgPT09IGV4aXN0aW5nVmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRcdGpRdWVyeSggb3B0aW9ucy5uZXdJZCArIGlkICkudmFsKCBcIlwiICk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRkYXRhLnNlbmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRkYXRhLml0ZW1zWyBpZCBdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdGRhdGEuZXhpc3RpbmdJdGVtc1sgaWQgXSA9IGV4aXN0aW5nVmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKCBkYXRhLnNlbmQgKSB7XG5cdFx0XHRcdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIGRhdGEsIGluc3RhbmNlLmhhbmRsZVJlc3BvbnNlcyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRoYW5kbGVfcmVzcG9uc2U6IGZ1bmN0aW9uKCByZXNwb25zZSwgc3RhdHVzICkge1xuXHRcdFx0XHRpbnN0YW5jZS5oYW5kbGVSZXNwb25zZSggcmVzcG9uc2UsIHN0YXR1cyApO1xuXHRcdFx0fSxcblx0XHRcdGhhbmRsZVJlc3BvbnNlOiBmdW5jdGlvbiggcmVzcG9uc2UsIHN0YXR1cyApIHtcblx0XHRcdFx0aWYgKCBzdGF0dXMgIT09IFwic3VjY2Vzc1wiICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciByZXNwID0gcmVzcG9uc2U7XG5cdFx0XHRcdGlmICggdHlwZW9mIHJlc3AgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRcdFx0cmVzcCA9IEpTT04ucGFyc2UoIHJlc3AgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggcmVzcCBpbnN0YW5jZW9mIEFycmF5ICkge1xuXHRcdFx0XHRcdGpRdWVyeS5lYWNoKCByZXNwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGluc3RhbmNlLmhhbmRsZVJlc3BvbnNlKCB0aGlzLCBzdGF0dXMgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoIHJlc3Auc3RhdHVzID09PSBcInN1Y2Nlc3NcIiApIHtcblx0XHRcdFx0XHRcdHZhciBuZXdWYWx1ZSA9IHJlc3BbIFwibmV3X1wiICsgYnVsa1R5cGUgXTtcblxuXHRcdFx0XHRcdFx0alF1ZXJ5KCBvcHRpb25zLmV4aXN0aW5nSWQgKyByZXNwLnBvc3RfaWQgKS5odG1sKCBuZXdWYWx1ZS5yZXBsYWNlKCAvXFxcXCg/IVxcXFwpL2csIFwiXCIgKSApO1xuXHRcdFx0XHRcdFx0alF1ZXJ5KCBvcHRpb25zLm5ld0lkICsgcmVzcC5wb3N0X2lkICkudmFsKCBcIlwiICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRoYW5kbGVfcmVzcG9uc2VzOiBmdW5jdGlvbiggcmVzcG9uc2VzLCBzdGF0dXMgKSB7XG5cdFx0XHRcdGluc3RhbmNlLmhhbmRsZVJlc3BvbnNlcyggcmVzcG9uc2VzLCBzdGF0dXMgKTtcblx0XHRcdH0sXG5cdFx0XHRoYW5kbGVSZXNwb25zZXM6IGZ1bmN0aW9uKCByZXNwb25zZXMsIHN0YXR1cyApIHtcblx0XHRcdFx0dmFyIHJlc3BzID0galF1ZXJ5LnBhcnNlSlNPTiggcmVzcG9uc2VzICk7XG5cdFx0XHRcdGpRdWVyeS5lYWNoKCByZXNwcywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aW5zdGFuY2UuaGFuZGxlUmVzcG9uc2UoIHRoaXMsIHN0YXR1cyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRzZXRfZXZlbnRzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aW5zdGFuY2Uuc2V0RXZlbnRzKCk7XG5cdFx0XHR9LFxuXHRcdFx0c2V0RXZlbnRzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gU2F2ZSBsaW5rLlxuXHRcdFx0XHRjdXJyZW50VGFibGUuZmluZCggXCIud3BzZW8tc2F2ZVwiICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHR2YXIgaWQgPSBqUXVlcnkoIHRoaXMgKS5kYXRhKCBcImlkXCIgKTtcblxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0aW5zdGFuY2Uuc3VibWl0TmV3KCBpZCwgdGhpcyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Ly8gU2F2ZSBhbGwgbGluay5cblx0XHRcdFx0Y3VycmVudFRhYmxlLmZpbmQoIFwiLndwc2VvLXNhdmUtYWxsXCIgKS5jbGljayggaW5zdGFuY2Uuc3VibWl0QWxsICk7XG5cblx0XHRcdFx0Ly8gU2F2ZSB0aXRsZSBhbmQgbWV0YSBkZXNjcmlwdGlvbiB3aGVuIHByZXNzaW5nIEVudGVyIG9uIHJlc3BlY3RpdmUgZmllbGQgYW5kIHRleHRhcmVhLlxuXHRcdFx0XHRjdXJyZW50VGFibGUuZmluZCggb3B0aW9ucy5uZXdDbGFzcyApLmtleWRvd24oXG5cdFx0XHRcdFx0ZnVuY3Rpb24oIGV2ICkge1xuXHRcdFx0XHRcdFx0aWYgKCBldi53aGljaCA9PT0gMTMgKSB7XG5cdFx0XHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdHZhciBpZCA9IGpRdWVyeSggdGhpcyApLmRhdGEoIFwiaWRcIiApO1xuXHRcdFx0XHRcdFx0XHRpbnN0YW5jZS5zdWJtaXROZXcoIGlkLCB0aGlzICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHR9O1xuXG5cdFx0cmV0dXJuIGluc3RhbmNlO1xuXHR9O1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcblx0d2luZG93LmJ1bGtfZWRpdG9yID0gYnVsa0VkaXRvcjtcblx0d2luZG93LmJ1bGtFZGl0b3IgPSBidWxrRWRpdG9yO1xuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHBhcmVudFRhYmxlcyA9IGpRdWVyeSggJ3RhYmxlW2NsYXNzKj1cIndwc2VvX2J1bGtcIl0nICk7XG5cdFx0cGFyZW50VGFibGVzLmVhY2goXG5cdFx0XHRcdGZ1bmN0aW9uKCBudW1iZXIsIHBhcmVudFRhYmxlICkge1xuXHRcdFx0XHRcdHZhciBjdXJyZW50VGFibGUgPSBqUXVlcnkoIHBhcmVudFRhYmxlICk7XG5cdFx0XHRcdFx0dmFyIGJ1bGtFZGl0ID0gYnVsa0VkaXRvciggY3VycmVudFRhYmxlICk7XG5cblx0XHRcdFx0XHRidWxrRWRpdC5zZXRFdmVudHMoKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0fVxuXHQpO1xufSgpICk7XG4iXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBakpBO0FBQ0E7QUFtSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./js/src/wp-seo-bulk-editor.js\n");

/***/ })

/******/ });