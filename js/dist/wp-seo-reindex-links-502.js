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
/******/ 	return __webpack_require__(__webpack_require__.s = 1208);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1208:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _a11ySpeak = __webpack_require__(273);

var _a11ySpeak2 = _interopRequireDefault(_a11ySpeak);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global yoastReindexLinksData, jQuery, tb_remove */

var settings = yoastReindexLinksData.data;
var linkIndexingCompleted = false;

/**
 * Represents the progressbar for the reindexing for the links.
 */
var IndexProgressBar = function () {

	/**
  * The constructor.
  *
  * @param {int} total The total amount of items.
  */
	function IndexProgressBar(total) {
		_classCallCheck(this, IndexProgressBar);

		this.element = jQuery("#wpseo_count_index_links");
		this.progressbarTarget = jQuery("#wpseo_index_links_progressbar").progressbar({ value: 0 });
		this.total = parseInt(total, 10);
		this.totalProcessed = 0;
	}

	/**
  * Updates the processbar.
  *
  * @param {int} countProcessed The amount of items that has been process.
  *
  * @returns {void}
  */


	_createClass(IndexProgressBar, [{
		key: "update",
		value: function update(countProcessed) {
			this.totalProcessed += countProcessed;
			var newWidth = this.totalProcessed * (100 / this.total);

			this.progressbarTarget.progressbar("value", Math.round(newWidth));
			this.element.html(this.totalProcessed);
		}

		/**
   * Completes the processbar.
   *
   * @returns {void}
   */

	}, {
		key: "complete",
		value: function complete() {
			this.progressbarTarget.progressbar("value", 100);
		}
	}]);

	return IndexProgressBar;
}();

/**
 * Does the reindex request for the current post and updates the processbar.
 *
 * @param {IndexProgressBar} progressbar The progressbar.
 * @param {Promise.resolve}  resolve     The method to complete index process.
 *
 * @returns {void}
 */


function doReindexRequest(progressbar, resolve) {
	// Do
	jQuery.ajax({
		type: "GET",
		url: settings.restApi.root + settings.restApi.endpoint,
		beforeSend: function beforeSend(xhr) {
			xhr.setRequestHeader("X-WP-Nonce", settings.restApi.nonce);
		},
		success: function success(response) {
			var totalIndexed = parseInt(response, 10);
			if (totalIndexed !== 0) {
				progressbar.update(totalIndexed);

				doReindexRequest(progressbar, resolve);

				return;
			}

			progressbar.complete();
			resolve();
		}
	});
}

/**
 * Starts the reindexing of the links.
 *
 * @returns {Promise} Promise.
 */
function reindexLinks() {
	// Do request to get post ids
	return new Promise(function (resolve) {
		var progressbar = new IndexProgressBar(settings.amount);
		doReindexRequest(progressbar, resolve);
	});
}

/**
 * Sets the finish message, when indexing has been completed.
 *
 * @returns {void}
 */
function completeReindexing() {
	linkIndexingCompleted = true;
	(0, _a11ySpeak2.default)(settings.l10n.calculationCompleted);
	jQuery("#reindexLinks").html(settings.message.indexingCompleted);

	tb_remove();
}

/**
 * Starts the reindexing of the links.
 *
 * @returns {void}
 */
function startReindexing() {
	(0, _a11ySpeak2.default)(settings.l10n.calculationInProgress);

	var promises = [];
	promises.push(reindexLinks());
	Promise.all(promises).then(completeReindexing);
}

/**
 * Opens the link indexing modal.
 *
 * @returns {void}
 */
function openLinkIndexing() {
	jQuery("#general-tab").click();

	if (linkIndexingCompleted === false) {
		jQuery("#openLinkIndexing").click();
	}
}

/**
 * Initializes the indexation of links.
 *
 * @returns {void}
 */
function init() {
	var recalculating = false;
	jQuery(".yoast-js-calculate-index-links--all ").on("click", function () {
		if (recalculating === false) {
			startReindexing();

			recalculating = true;
		}
	});

	jQuery("#noticeRunLinkIndex").click(openLinkIndexing);
}

jQuery(init);

/***/ }),

/***/ 273:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var containerPolite,
    containerAssertive,
    previousMessage = "";

/**
 * Build the live regions markup.
 *
 * @param {String} ariaLive Optional. Value for the "aria-live" attribute, default "polite".
 *
 * @returns {Object} $container The ARIA live region jQuery object.
 */
var addContainer = function addContainer(ariaLive) {
	ariaLive = ariaLive || "polite";

	var container = document.createElement("div");
	container.id = "a11y-speak-" + ariaLive;
	container.className = "a11y-speak-region";

	var screenReaderTextStyle = "clip: rect(1px, 1px, 1px, 1px); position: absolute; height: 1px; width: 1px; overflow: hidden; word-wrap: normal;";
	container.setAttribute("style", screenReaderTextStyle);

	container.setAttribute("aria-live", ariaLive);
	container.setAttribute("aria-relevant", "additions text");
	container.setAttribute("aria-atomic", "true");

	document.querySelector("body").appendChild(container);
	return container;
};

/**
 * Specify a function to execute when the DOM is fully loaded.
 *
 * @param {Function} callback A function to execute after the DOM is ready.
 *
 * @returns {void}
 */
var domReady = function domReady(callback) {
	if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) {
		return callback();
	}

	document.addEventListener("DOMContentLoaded", callback);
};

/**
 * Create the live regions when the DOM is fully loaded.
 */
domReady(function () {
	containerPolite = document.getElementById("a11y-speak-polite");
	containerAssertive = document.getElementById("a11y-speak-assertive");

	if (containerPolite === null) {
		containerPolite = addContainer("polite");
	}
	if (containerAssertive === null) {
		containerAssertive = addContainer("assertive");
	}
});

/**
 * Clear the live regions.
 */
var clear = function clear() {
	var regions = document.querySelectorAll(".a11y-speak-region");
	for (var i = 0; i < regions.length; i++) {
		regions[i].textContent = "";
	}
};

/**
 * Update the ARIA live notification area text node.
 *
 * @param {String} message  The message to be announced by Assistive Technologies.
 * @param {String} ariaLive Optional. The politeness level for aria-live. Possible values:
 *                          polite or assertive. Default polite.
 */
var A11ySpeak = function A11ySpeak(message, ariaLive) {
	// Clear previous messages to allow repeated strings being read out.
	clear();

	/*
  * Strip HTML tags (if any) from the message string. Ideally, messages should
  * be simple strings, carefully crafted for specific use with A11ySpeak.
  * When re-using already existing strings this will ensure simple HTML to be
  * stripped out and replaced with a space. Browsers will collapse multiple
  * spaces natively.
  */
	message = message.replace(/<[^<>]+>/g, " ");

	if (previousMessage === message) {
		message = message + "\xA0";
	}

	previousMessage = message;

	if (containerAssertive && "assertive" === ariaLive) {
		containerAssertive.textContent = message;
	} else if (containerPolite) {
		containerPolite.textContent = message;
	}
};

module.exports = A11ySpeak;

/***/ })

/******/ });