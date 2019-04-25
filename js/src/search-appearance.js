/* global wpseoReplaceVarsL10n, wpseoSearchAppearance */

/* External dependencies */
import { render, createPortal, Fragment } from "@wordpress/element";
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
import { ThemeProvider } from "styled-components";
import WordPressUserSelectorSearchAppearance from "./components/WordPressUserSelectorSearchAppearance";
import LocalSEOUpsell from "./components/LocalSEOUpsell";

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
const wpUserSelector = document.getElementById( "wpseo-person-selector" );
const localSEOElement = document.getElementById( "wpseo-local-seo-upsell" );

const element = document.createElement( "div" );
document.body.appendChild( element );

const store = configureStore();

const theme = {
	isRtl: wpseoSearchAppearance.isRtl,
};

const {
	showLocalSEOUpsell,
	localSEOUpsellURL,
	brushstrokeBackgroundURL,
} = wpseoSearchAppearance;

render(
	<Provider store={ store }>
		<ThemeProvider theme={ theme }>
			<Fragment>
				<SettingsReplacementVariableEditors
					singleFieldElements={ singleFieldElements }
					editorElements={ editorElements }
				/>
				{ createPortal( <WordPressUserSelectorSearchAppearance />, wpUserSelector ) }
				{ showLocalSEOUpsell && createPortal(
					<LocalSEOUpsell
						url={ localSEOUpsellURL }
						backgroundUrl={ brushstrokeBackgroundURL }
					/>,
					localSEOElement
				) }
			</Fragment>
		</ThemeProvider>
	</Provider>,
	element
);
