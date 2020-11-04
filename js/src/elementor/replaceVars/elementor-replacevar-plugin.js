import ReplaceVar from "../../values/replaceVar";
import * as replaceFunctions from "../replaceVars/general";
import { dispatch } from "@wordpress/data";

const PLUGIN_NAME = "replaceVariablePlugin";

/**
 * Variable replacement plugin for WordPress.
 */
class YoastReplaceVarPlugin {
	/**
	 * Creates an instance of YoastReplaceVarPlugin.
	 *
	 * @param {function} registerPlugin Registers a plugin.
	 * @param {function} registerModification Registers a modification.
	 * @param {function} pluginReloaded Notifies the plugin data has changed.
	 *
	 * @returns {void}
	 */
	constructor( registerPlugin, registerModification, pluginReloaded ) {
		this._registerPlugin = registerPlugin;
		this._registerModification = registerModification;
		this._pluginReloaded = pluginReloaded;
	}

	/**
	 * Initializes the replaceVarPlugin.
	 *
	 * @returns {void}
	 */
	initialize() {
		this._registerPlugin( PLUGIN_NAME, { status: "ready" } );
		this.registerModifications();
	}

	/**
	 * Registers a replaceVar.
	 *
	 * @param {ReplaceVar} replaceVar The replaceVar.
	 *
	 * @returns {void}
	 */
	addReplacement( replaceVar ) {
		this._registerReplaceVar( text => {
			return text.replace(
				new RegExp( replaceVar.placeholder, "g" ),
				replaceVar.replacement
			);
		} );
	}

	declareReloaded() {
		this._pluginReloaded( PLUGIN_NAME );
		dispatch( "yoast-seo/editor" ).refreshSnippetEditor();
	}

	/**
	 * Registers modifications with the given replacevar callback.
	 *
	 * @private
	 *
	 * @param {function} callback The function that replaces.
	 *
	 * @returns {void}
	 */
	_registerReplaceVar( callback ) {
		[
			"content",
			"title",
			"snippet_title",
			"snippet_meta",
			"primary_category",
			"data_page_title",
			"data_meta_desc",
			"excerpt",
		].forEach( field => {
			this._registerModification( field, callback, PLUGIN_NAME, 10 );
		} );
	}

	/**
	 * Registers the modifications for the plugin on initial load.
	 *
	 * @returns {void}
	 */
	registerModifications() {
		const currentScope = window.wpseoScriptData.analysis.plugins.replaceVars.scope;
		let replacements = [];

		switch ( currentScope ) {
			case "post":
				replacements = [
					"replaceCategory",
					"replaceCurrentDay",
					"replaceCurrentDate",
					"replaceCurrentMonth",
					"replaceCurrentTime",
					"replaceCurrentYear",
					"replaceDate",
					"replaceExcerpt",
					"replaceId",
					"replaceKeyword",
					"replacePage",
					"replaceSearchPhrase",
					"replaceSeparator",
					"replaceSiteDesc",
					"replaceSiteName",
					"replaceTitle",
					"replaceUserId",
				];
				break;
			case "page":
				replacements = [
					"replaceCategory",
					"replaceCurrentDay",
					"replaceCurrentDate",
					"replaceCurrentMonth",
					"replaceCurrentTime",
					"replaceCurrentYear",
					"replaceDate",
					"replaceExcerpt",
					"replaceId",
					"replaceKeyword",
					"replacePage",
					"replaceSearchPhrase",
					"replaceSeparator",
					"replaceSiteDesc",
					"replaceSiteName",
					"replaceTitle",
					"replaceUserId",
				];
				break;
		}

		replacements.forEach( functionName => this._registerReplaceVar( replaceFunctions[ functionName ] ) );
	}
}

// Exposes the ReplaceVar class for functionality of plugins integrating.
YoastReplaceVarPlugin.ReplaceVar = ReplaceVar;

export default YoastReplaceVarPlugin;
