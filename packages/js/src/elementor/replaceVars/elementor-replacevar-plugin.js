import { get } from "lodash";
import { registerPlugin, registerModification } from "../initializers/pluggable";
import * as replacementVariables from "../replaceVars/general";

const PLUGIN_NAME = "replaceVariablePlugin";

// Holds a singleton used in getCurrentReplacementVariables.
let currentReplaceVars = null;
// Holds a singleton used in getCurrentReplacementVariablesForEditor.
let currentReplaceVarsForEditor = null;

/**
 * Registers modifications for the given replace callback.
 *
 * @param {function} replace Callback function that replaces.
 *
 * @returns {void}
 */
const registerModifications = replace => {
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
		registerModification( field, replace, PLUGIN_NAME, 10 );
	} );
};

/**
 * Gets the replacement for a scope.
 *
 * @param {string} [scope] The scope, i.e. post, page, etc. Defaults to the current scope.
 *
 * @returns {string[]} The list of replacement variables for the given scope.
 */
const getReplacements = ( scope = "" ) => {
	if ( scope === "" ) {
		scope = get( window, "wpseoScriptData.analysis.plugins.replaceVars.scope", "" );
	}

	switch ( scope ) {
		case "post":
			return [
				"category",
				"currentYear",
				"date",
				"excerpt",
				"id",
				"focusKeyphrase",
				"modified",
				"name",
				"page",
				"primaryCategory",
				"pageNumber",
				"pageTotal",
				"postTypeNamePlural",
				"postTypeNameSingular",
				"searchPhrase",
				"separator",
				"siteDescription",
				"siteName",
				"tag",
				"title",
				"userDescription",
			];
		case "page":
			return [
				"category",
				"currentYear",
				"date",
				"excerpt",
				"id",
				"focusKeyphrase",
				"modified",
				"name",
				"page",
				"primaryCategory",
				"pageNumber",
				"pageTotal",
				"postTypeNamePlural",
				"postTypeNameSingular",
				"searchPhrase",
				"separator",
				"siteDescription",
				"siteName",
				"tag",
				"title",
				"userDescription",
			];
	}

	return [];
};

/**
 * Creates a replace function for the given replacement variable.
 *
 * @param {Object} replacementVariable The replacement variable.
 * @param {function} replacementVariable.getReplacement Should return the replacement text.
 * @param {RegExp} replacementVariable.regexp The regular expression to search with.
 *
 * @returns {function(string): void} The replace function.
 */
const createReplaceFunction = ( { getReplacement, regexp } ) => {
	return text => text.replace(
		regexp,
		getReplacement()
	);
};

/**
 * Registers the modifications for the given replacements.
 *
 * @param {string[]} replacements The replacement.
 *
 * @returns {void}
 */
const registerReplacementVariables = replacements => {
	replacements.forEach( name => {
		const replace = createReplaceFunction( replacementVariables[ name ] );

		registerModifications( replace );
	} );
};

/**
 * Registers a replaceVar.
 *
 * @param {ReplaceVar} replaceVar The replaceVar.
 *
 * @returns {void}
 */
export const addReplacement = replaceVar => registerModifications( text => {
	return text.replace(
		new RegExp( replaceVar.placeholder, "g" ),
		replaceVar.replacement
	);
} );

// Exposes the ReplaceVar class for functionality of plugins integrating.
export { default as ReplaceVar } from "../../values/replaceVar";

/**
 * Gets the replacement variables for the current scope.
 *
 * @returns {Object} The replacement variables.
 */
const getCurrentReplacementVariables = () => {
	if ( currentReplaceVars === null ) {
		currentReplaceVars = getReplacements().map( name => replacementVariables[ name ] );
	}

	return currentReplaceVars;
};

/**
 * Gets the replacementVariables from the replaceVarPlugin.
 *
 * For the insert variable of the SnippetEditor / ReplacementVariableEditor.
 *
 * @returns {Object[]} The replacementVariables's name, label and value.
 */
export const getCurrentReplacementVariablesForEditor = () => {
	if ( currentReplaceVarsForEditor === null ) {
		currentReplaceVarsForEditor = [];
		getCurrentReplacementVariables().forEach( replacementVariable => {
			// Add the main replacement variable.
			currentReplaceVarsForEditor.push( {
				name: replacementVariable.name,
				label: replacementVariable.label,
				value: replacementVariable.placeholder,
			} );

			// Add the aliases.
			replacementVariable.aliases.forEach( alias => {
				currentReplaceVarsForEditor.push( {
					name: alias.name,
					label: alias.label,
					value: alias.placeholder,
				} );
			} );
		} );
	}

	return currentReplaceVarsForEditor;
};

/**
 * Initializes the replaceVarPlugin.
 *
 * @returns {void}
 */
export default function initReplaceVarPlugin() {
	registerPlugin( PLUGIN_NAME, { status: "ready" } );
	registerReplacementVariables( getReplacements() );
}
