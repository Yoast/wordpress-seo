import * as replaceFunctions from "../replaceVars/general";
import {
	forEach,
} from "lodash-es";
import {
	refreshSnippetEditor,
} from "../../redux/actions";

/**
 * Variable replacement plugin for WordPress.
 *
 * @param {app}    app   The app object.
 * @param {Object} store The redux store.
 *
 * @returns {void}
 */
var YoastReplaceVarPlugin = function( app, store ) {
	this._app = app;
	this._app.registerPlugin( "replaceVariablePlugin", { status: "ready" } );

	this._store = store;

	this.registerModifications();
	this.registerEvents();
};

/**
 * Registers the modifications for the plugin on initial load.
 *
 * @returns {void}
 */
YoastReplaceVarPlugin.prototype.registerModifications = function() {
	const currentScope = window.wpseoScriptData.analysis.plugins.replaceVars.scope;
	let replacements = [];
	if ( currentScope === "post" ) {
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
			"replacePrimaryCategory",
			"replaceSearchPhrase",
			"replaceSeparator",
			"replaceSiteDesc",
			"replaceSiteName",
			"replaceTitle",
			"replaceUserId",
		];
	} else if ( currentScope === "page" ) {
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
			"replacePrimaryCategory",
			"replaceSearchPhrase",
			"replaceSeparator",
			"replaceSiteDesc",
			"replaceSiteName",
			"replaceTitle",
			"replaceUserId",
		];
	}

	forEach(
		[
			"content",
			"title",
			"snippet_title",
			"snippet_meta",
			"primary_category",
			"data_page_title",
			"data_meta_desc",
			"excerpt",
		],
		function( field ) {
			forEach(
				replacements,
				function( functionName ) {
					this._app.registerModification( field, replaceFunctions[ functionName ], functionName, 10 );
				}.bind( this )
			);
		}.bind( this )
	);
};

/**
 * Declares reloaded with YoastSEO.
 *
 * @returns {void}
 */
YoastReplaceVarPlugin.prototype.declareReloaded = function() {
	this._app.pluginReloaded( "replaceVariablePlugin" );
	this._store.dispatch( refreshSnippetEditor() );
};

/*
 * STATIC VARIABLES
 */

// Exposes the ReplaceVar class for functionality of plugins integrating.
YoastReplaceVarPlugin.ReplaceVar = ReplaceVar;

export default YoastReplaceVarPlugin;
