/* global window wp */
/* External dependencies */
import { get } from "lodash-es";

/* Internal dependencies */
import ClassicEditorData from "../analysis/classicEditorData.js";
import UsedKeywords from "../analysis/usedKeywords";
import { renderClassicEditorMetabox } from "../helpers/classicEditor";

/**
 * Contains the Yoast SEO block editor integration.
 */
class ClassicEditor {
	/**
	 * @param {Object}   args                                 Edit initialize arguments.
	 * @param {Object}   args.store                           The Yoast editor store.
	 * @param {Function} args.onRefreshRequest                The function to refresh the analysis.
	 * @param {Object}   args.replaceVars                     The replaceVars object.
	 * @param {Object}   args.classicEditorDataSettings       Settings for the ClassicEditorData object.
	 */
	constructor( args ) {
		this._localizedData = this.getLocalizedData();
		this._store = args.store;
		this._args = args;
		this._init();
	}

	/**
	 * Get the localized data from the global namespace.
	 *
	 * @returns {Object} Localized data.
	 */
	getLocalizedData() {
		return (
			window.wpseoScriptData.metabox ||
			{ intl: {}, isRtl: false }
		);
	}

	/**
	 * Initializes the settings store.
	 *
	 * @returns {void} .
	 */
	_init() {
		renderClassicEditorMetabox( this._store );

		this._data = new ClassicEditorData( this._args.onRefreshRequest, this._store, this._args.classicEditorDataSettings );
		this._data.initialize( this._args.replaceVars );
	}

	/**
	 * Initialize used keyword analysis.
	 *
	 * @param {Function} refreshAnalysis Function that triggers a refresh of the analysis.
	 * @param {string}   ajaxAction      The ajax action to use when retrieving the used keywords data.
	 *
	 * @returns {void}
	 */
	initializeUsedKeywords( refreshAnalysis, ajaxAction ) {
		const store         = this._store;
		const localizedData = this._localizedData;
		const scriptUrl     = get(
			window,
			[ "wpseoScriptData", "analysis", "worker", "keywords_assessment_url" ],
			"used-keywords-assessment.js"
		);

		const usedKeywords = new UsedKeywords(
			ajaxAction,
			localizedData,
			refreshAnalysis,
			scriptUrl
		);
		usedKeywords.init();

		let lastData = {};
		store.subscribe( () => {
			const state = store.getState() || {};
			if ( state.focusKeyword === lastData.focusKeyword ) {
				return;
			}
			lastData = state;
			usedKeywords.setKeyword( state.focusKeyword );
		} );
	}

	/**
	 * Returns the store.
	 *
	 * @returns {Object} The redux store.
	 */
	getStore() {
		return this._store;
	}

	/**
	 * Returns the data object.
	 *
	 * @returns {Object} The data object.
	 */
	getData() {
		return this._data;
	}
}

export default ClassicEditor;
