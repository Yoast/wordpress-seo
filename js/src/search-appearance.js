/* global wpseoReplaceVarsL10n */

/* External dependencies */
import ReactDOM from "react-dom";
import React from "react";
import forEach from "lodash/forEach";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";

/* Internal dependencies */
import SettingsReplacementVariableEditors from "./components/SettingsReplacementVariableEditors";
import snippetEditorReducer from "./redux/reducers/snippetEditor";
import configureEnhancers from "./redux/utils/configureEnhancers";
import getDefaultReplacementVariables from "./values/defaultReplaceVariables";
import { updateReplacementVariable } from "./redux/actions/snippetEditor";
import { setWordPressSeoL10n, setYoastComponentsL10n } from "./helpers/i18n";

setYoastComponentsL10n();
setWordPressSeoL10n();

/**
 * Create a shared store for all snippet editors in the search appearance pages.
 *
 * @returns {Object} Redux store.
 */
function configureStore() {
	const store = createStore(
		combineReducers( {
			snippetEditor: snippetEditorReducer,
		} ),
		{
			snippetEditor: {
				replacementVariables: getDefaultReplacementVariables(),
				recommendedReplacementVariables: wpseoReplaceVarsL10n.recommended_replace_vars,
			},
		},
		configureEnhancers()
	);
	forEach( window.wpseoReplaceVarsL10n.replace_vars, replacementVariable => {
		const name = replacementVariable.name.replace( / /g, "_" );

		store.dispatch( updateReplacementVariable(
			name,
			replacementVariable.value,
			replacementVariable.label,
		) );
	} );
	return store;
}

const editorElements = document.querySelectorAll( "[data-react-replacevar-editor]" );
const singleFieldElements = document.querySelectorAll( "[data-react-replacevar-field]" );

if( editorElements.length ) {
	const element = document.createElement( "div" );
	document.body.appendChild( element );

	const store = configureStore();

	ReactDOM.render(
		<Provider store={ store }>
			<SettingsReplacementVariableEditors
				singleFieldElements={ singleFieldElements }
				editorElements={ editorElements }
			/>
		</Provider>,
		element
	);
}
