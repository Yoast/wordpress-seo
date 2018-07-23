/* global window wpseoPostScraperL10n wpseoTermScraperL10n process wp yoast */

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import _flatten from "lodash/flatten";

import IntlProvider from "./components/IntlProvider";
import AnalysisSection from "./components/contentAnalysis/AnalysisSection";
import Data from "./analysis/data.js";
import reducers from "./redux/reducers";
import PluginIcon from "../../images/Yoast_icon_kader.svg";
import ClassicEditorData from "./analysis/classicEditorData.js";
import isGutenbergDataAvailable from "./helpers/isGutenbergDataAvailable";
import SnippetEditor from "./containers/SnippetEditor";
import { ThemeProvider } from "styled-components";

// This should be the entry point for all the edit screens. Because of backwards compatibility we can't change this at once.
let localizedData = { intl: {}, isRtl: false };
if( window.wpseoPostScraperL10n ) {
	localizedData = wpseoPostScraperL10n;
} else if ( window.wpseoTermScraperL10n ) {
	localizedData = wpseoTermScraperL10n;
}

/**
 * Registers a redux store in Gutenberg.
 *
 * @returns {Object} The store.
 */
function registerStoreInGutenberg() {
	const { combineReducers, registerStore } = yoast._wp.data;

	return registerStore( "yoast-seo/editor", {
		reducer: combineReducers( reducers ),
	} );
}

/**
 * Sorts components by a prop `position`.
 *
 * The array is flattened before sorting to make sure that components inside of
 * a collection are also included. This is to allow sorting multiple fills of
 * which at least one includes an array of components.
 *
 * @param {Object|array} components The component(s) to be sorted.
 *
 * @returns {Object|array} The sorted component(s).
 */
const sortComponentsByPosition = function( components ) {
	if ( typeof components.length  !== "undefined" ) {
		return _flatten( components ).sort( ( a, b ) => {
			return a.props.position - b.props.position;
		} );
	}
	return components;
};

/**
 * Registers the plugin into the gutenberg editor, creates a sidebar entry for the plugin,
 * and creates that sidebar's content.
 *
 * @returns {void}
 **/
function registerPlugin() {
	if ( isGutenbergDataAvailable() ) {
		const { Fragment } = yoast._wp.element;
		const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
		const { registerPlugin } = wp.plugins;
		const { Slot, Fill } = wp.components;

		const YoastSidebar = () => (
			<Fragment>
				<PluginSidebarMoreMenuItem
					target="seo-sidebar"
					icon={ <PluginIcon/> }
				>
					Yoast SEO
				</PluginSidebarMoreMenuItem>
				<PluginSidebar
					name="seo-sidebar"
					title="Yoast SEO"
				>
					<Slot name="YoastSidebar">
						{ ( fills ) => {
							return sortComponentsByPosition( fills );
						} }
					</Slot>
				</PluginSidebar>
				<Fill name="YoastSidebar"> // Free fill
					<div position={10}>Readability analysis</div>
					<div position={20}>SEO analysis</div>
					<div position={30}>Cornerstone content</div>
					<div position={40}>Snippet editor</div>
					<div position={50}>Social</div>
					<div position={60}>Robots</div>
				</Fill>
			</Fragment>
		);

		registerPlugin( "yoast-seo", {
			render: YoastSidebar,
		} );
	}
}

/**
 * Wraps a component in the required top level components.
 *
 * @param {ReactElement} Component The component to be wrapped.
 * @param {Object} store Redux store.
 * @param {Object} props React props to pass to the Component.
 *
 * @returns {ReactElement} The wrapped component.
 */
function wrapInTopLevelComponents( Component, store, props ) {
	const theme = {
		isRtl: localizedData.isRtl,
	};

	return (
		<IntlProvider
			messages={ localizedData.intl } >
			<Provider store={ store } >
				<ThemeProvider theme={ theme }>
					<Component { ...props } />
				</ThemeProvider>
			</Provider>
		</IntlProvider>
	);
}

/**
 * Render a react app to a target element.
 *
 * @param {string} target Target element id.
 * @param {ReactElement} component The component to render.
 * @param {Object} store Redux store.
 *
 * @returns {void}
 */
function renderReactApp( target, component, store ) {
	const targetElement = document.getElementById( target );
	const props = {
		title: localizedData.analysisHeadingTitle,
		hideMarksButtons: localizedData.show_markers !== "1",
	};
	if( targetElement ) {
		ReactDOM.render(
			wrapInTopLevelComponents( component, store, props ),
			targetElement
		);
	}
}

/**
 * Renders the snippet preview for display.
 *
 * @param {Object} store                                 Redux store.
 * @param {Object} props                                 Props to be passed to
 *                                                       the snippet preview.
 * @param {string} props.baseUrl                         Base URL of the site
 *                                                       the user is editing.
 * @param {string} props.date                            The date.
 * @param {array}  props.recommendedReplacementVariables The recommended
 *                                                       replacement variables
 *                                                       for this context.
 *
 * @returns {void}
 */
function renderSnippetPreview( store, props ) {
	const targetElement = document.getElementById( "wpseosnippet" );

	if ( ! targetElement ) {
		return;
	}

	ReactDOM.render(
		wrapInTopLevelComponents( SnippetEditor, store, props ),
		targetElement,
	);
}

/**
 * Renders the react apps.
 *
 * @param {Object} store                Redux store.
 * @param {Object} args                 Arguments.
 * @param {string} args.analysisSection The target element id for the analysis
 *                                      section.
 *
 * @returns {void}
 */
function renderReactApps( store, args ) {
	renderReactApp( args.analysisSection, AnalysisSection, store );
}

/**
 * Initialize the appropriate data class.
 *
 * @param {Object}   data                   The data from the editor.
 * @param {Object}   args                   The args.
 * @param {Function} args.onRefreshRequest  The function to call on refresh request.
 * @param {Object}   args.replaceVars       The replaceVars object.
 * @param {Object}   store                  The redux store.
 *
 * @returns {Object} The instantiated data class.
 */
export function initializeData( data, args, store ) {
	// Only use Gutenberg's data if Gutenberg is available.
	if ( isGutenbergDataAvailable() ) {
		const gutenbergData = new Data( data, args.onRefreshRequest, store );
		gutenbergData.initialize( args.replaceVars );
		return gutenbergData;
	}
	const classicEditorData = new ClassicEditorData( args.onRefreshRequest, store );
	classicEditorData.initialize( args.replaceVars );
	return classicEditorData;
}

/**
 * Initializes all functionality on the edit screen.
 *
 * This can be a post or a term edit screen.
 *
 * @param {Object}   args                                 Edit initialize arguments.
 * @param {string}   args.analysisSection                 The target element id
 *                                                        for the analysis section.
 * @param {Function} args.onRefreshRequest                The function to refresh
 *                                                        the analysis.
 * @param {Object}   args.replaceVars                     The replaceVars object.
 * @param {string}   args.snippetEditorBaseUrl            Base URL of the site
 *                                                        the user is editing.
 * @param {string}   args.snippetEditorDate               The date for the
 *                                                        snippet editor.
 * @param {array}    args.recommendedReplacementVariables The recommended
 *                                                        replacement variables
 *                                                        for this context.
 *
 * @returns {Object} The store and the data.
 */
export function initialize( args ) {
	const store = registerStoreInGutenberg();
	if( args.shouldRenderGutenbergSidebar ) {
		registerPlugin();
	}

	const data = initializeData( wp.data, args, store );

	renderReactApps( store, args );

	renderSnippetPreview( store, {
		baseUrl: args.snippetEditorBaseUrl,
		date: args.snippetEditorDate,
		recommendedReplacementVariables: args.recommendedReplaceVars,
	} );

	return {
		store,
		data,
	};
}

export default initialize;
