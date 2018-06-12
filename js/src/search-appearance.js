/* External dependencies */
import ReactDOM from "react-dom";
import React from "react";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";

/* Internal dependencies */
import SettingsReplacementVariableEditors from "./components/SettingsReplacementVariableEditors";
import snippetEditorReducer from "./redux/reducers/snippetEditor";
import configureEnhancers from "./redux/utils/configureEnhancers";

/**
 * Create a shared store for all snippet editors in the search appearance pages.
 *
 * @returns {Object} Redux store.
 */
function configureStore() {
	return createStore(
		combineReducers( {
			snippetEditor: snippetEditorReducer,
		} ),
		{
			snippetEditor: {
				replacementVariables: window.wpseoReplaceVarsL10n,
			},
		},
		configureEnhancers()
	);
}

const editorElements = document.querySelectorAll( "[data-react-replacevar-editor]" );
const singleFieldElements = document.querySelectorAll( "[data-react-replacevar-field]" );

if( editorElements.length ) {
	const element = document.createElement( "div" );
	document.body.append( element );

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
