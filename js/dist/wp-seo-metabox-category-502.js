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
/******/ 	return __webpack_require__(__webpack_require__.s = 1594);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1594:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global wp, _, wpseoPrimaryCategoryL10n */
(function ($) {
	"use strict";

	var primaryTermInputTemplate, primaryTermUITemplate, primaryTermScreenReaderTemplate;
	var taxonomies = wpseoPrimaryCategoryL10n.taxonomies;

	/**
  * Checks if the elements to make a term the primary term and the display for a primary term exist.
  *
  * @param {Object} checkbox
  *
  * @returns {boolean}
  */
	function hasPrimaryTermElements(checkbox) {
		return 1 === $(checkbox).closest("li").children(".wpseo-make-primary-term").length;
	}

	/**
  * Retrieves the primary term for a taxonomy.
  *
  * @param {string} taxonomyName
  * @returns {string}
  */
	function getPrimaryTerm(taxonomyName) {
		var primaryTermInput;

		primaryTermInput = $("#yoast-wpseo-primary-" + taxonomyName);
		return primaryTermInput.val();
	}

	/**
  * Sets the primary term for a taxonomy.
  *
  * @param {string} taxonomyName
  * @param {string} termId
  *
  * @returns {void}
  */
	function setPrimaryTerm(taxonomyName, termId) {
		var primaryTermInput;

		primaryTermInput = $("#yoast-wpseo-primary-" + taxonomyName);
		primaryTermInput.val(termId).trigger("change");
	}

	/**
  * Creates the elements necessary to show something is a primary term or to make it the primary term.
  *
  * @param {string} taxonomyName
  * @param {Object} checkbox
  *
  * @returns {void}
  */
	function createPrimaryTermElements(taxonomyName, checkbox) {
		var label, html;

		label = $(checkbox).closest("label");

		html = primaryTermUITemplate({
			taxonomy: taxonomies[taxonomyName],
			term: label.text()
		});

		label.after(html);
	}

	/**
  * Updates the primary term selectors/indicators for a certain taxonomy.
  *
  * @param {string} taxonomyName
  *
  * @returns {void}
  */
	function updatePrimaryTermSelectors(taxonomyName) {
		var checkedTerms;
		var listItem, label;

		checkedTerms = $("#" + taxonomyName + 'checklist input[type="checkbox"]:checked');

		var taxonomyListItem = $("#" + taxonomyName + "checklist li");
		taxonomyListItem.removeClass("wpseo-term-unchecked wpseo-primary-term wpseo-non-primary-term");

		$(".wpseo-primary-category-label").remove();
		taxonomyListItem.addClass("wpseo-term-unchecked");

		// If there is only one term selected we don't want to show our interface.
		if (checkedTerms.length <= 1) {
			return;
		}

		checkedTerms.each(function (i, term) {
			term = $(term);
			listItem = term.closest("li");
			listItem.removeClass("wpseo-term-unchecked");

			// Create our interface elements if they don't exist.
			if (!hasPrimaryTermElements(term)) {
				createPrimaryTermElements(taxonomyName, term);
			}

			if (term.val() === getPrimaryTerm(taxonomyName)) {
				listItem.addClass("wpseo-primary-term");

				label = term.closest("label");
				label.find(".wpseo-primary-category-label").remove();
				label.append(primaryTermScreenReaderTemplate({
					taxonomy: taxonomies[taxonomyName]
				}));
			} else {
				listItem.addClass("wpseo-non-primary-term");
			}
		});
	}

	/**
  * Makes the first term primary for a certain taxonomy.
  *
  * @param {string} taxonomyName
  *
  * @returns {void}
  */
	function makeFirstTermPrimary(taxonomyName) {
		var firstTerm = $("#" + taxonomyName + 'checklist input[type="checkbox"]:checked:first');

		setPrimaryTerm(taxonomyName, firstTerm.val());
		updatePrimaryTermSelectors(taxonomyName);
	}

	/**
  * If we check a term while there is no primary term we make that one the primary term.
  *
  * @param {string} taxonomyName
  *
  * @returns {void}
  */
	function ensurePrimaryTerm(taxonomyName) {
		if ("" === getPrimaryTerm(taxonomyName)) {
			makeFirstTermPrimary(taxonomyName);
		}
	}

	/**
  * Returns the term checkbox handler for a certain taxonomy name.
  *
  * @param {string} taxonomyName
  * @returns {Function}
  */
	function termCheckboxHandler(taxonomyName) {
		return function () {
			// If the user unchecks the primary category we have to select any new primary term
			if (false === $(this).prop("checked") && $(this).val() === getPrimaryTerm(taxonomyName)) {
				makeFirstTermPrimary(taxonomyName);
			}

			ensurePrimaryTerm(taxonomyName);

			updatePrimaryTermSelectors(taxonomyName);
		};
	}

	/**
  * Returns the term list add handler for a certain taxonomy name.
  *
  * @param {string} taxonomyName
  * @returns {Function}
  */
	function termListAddHandler(taxonomyName) {
		return function () {
			ensurePrimaryTerm(taxonomyName);
			updatePrimaryTermSelectors(taxonomyName);
		};
	}

	/**
  * Returns the make primary event handler for a certain taxonomy name.
  *
  * @param {string} taxonomyName
  * @returns {Function}
  */
	function makePrimaryHandler(taxonomyName) {
		return function (e) {
			var term, checkbox;

			term = $(e.currentTarget);
			checkbox = term.siblings("label").find("input");

			setPrimaryTerm(taxonomyName, checkbox.val());

			updatePrimaryTermSelectors(taxonomyName);

			// The clicked link will be hidden so we need to focus something different.
			checkbox.focus();
		};
	}

	$.fn.initYstSEOPrimaryCategory = function () {
		return this.each(function (i, taxonomy) {
			var metaboxTaxonomy, html;

			metaboxTaxonomy = $("#" + taxonomy.name + "div");

			html = primaryTermInputTemplate({
				taxonomy: taxonomy
			});

			metaboxTaxonomy.append(html);

			updatePrimaryTermSelectors(taxonomy.name);

			metaboxTaxonomy.on("click", 'input[type="checkbox"]', termCheckboxHandler(taxonomy.name));

			// When the AJAX Request is done, this event will be fired.
			metaboxTaxonomy.on("wpListAddEnd", "#" + taxonomy.name + "checklist", termListAddHandler(taxonomy.name));

			metaboxTaxonomy.on("click", ".wpseo-make-primary-term", makePrimaryHandler(taxonomy.name));
		});
	};

	$(function () {
		// Initialize our templates
		primaryTermInputTemplate = wp.template("primary-term-input");
		primaryTermUITemplate = wp.template("primary-term-ui");
		primaryTermScreenReaderTemplate = wp.template("primary-term-screen-reader");

		$(_.values(taxonomies)).initYstSEOPrimaryCategory();
	});
})(jQuery);

/***/ })

/******/ });