/* global window wpseoPostScraperL10n wpseoTermScraperL10n process wp yoast */

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import IntlProvider from "./components/IntlProvider";
import AnalysisSection from "./components/contentAnalysis/AnalysisSection";
import Data from "./analysis/data.js";
import { isGutenbergDataAvailable } from "./helpers/isGutenbergAvailable";
import SnippetPreviewSection from "./components/SnippetPreviewSection";
import reducers from "./redux/reducers";
import PluginIcon from "../../images/Yoast_icon_kader.svg";

// This should be the entry point for all the edit screens. Because of backwards compatibility we can't change this at once.
let localizedData = { intl: {} };
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
					<p> Contents of the sidebar </p>
				</PluginSidebar>
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
	return (
		<IntlProvider
			messages={ localizedData.intl } >
			<Provider store={ store } >
				<Component { ...props } />
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
 * @param {Object} store Redux store.
 *
 * @returns {void}
 */
function renderSnippetPreview( store ) {
	const targetElement = document.getElementById( "wpseosnippet" );

	if ( ! targetElement ) {
		return;
	}

	const container = document.createElement( "div" );
	targetElement.parentNode.insertBefore( container, targetElement );

	ReactDOM.render(
		wrapInTopLevelComponents( SnippetPreviewSection, store ),
		container,
	);
}

/**
 * Renders the react apps.
 *
 * @param {Object} store Redux store.
 * @param {Object} args Arguments.
 *
 * @returns {void}
 */
function renderReactApps( store, args ) {
	renderReactApp( args.analysisSection, AnalysisSection, store );
}

/**
 * Initializes all functionality on the edit screen.
 *
 * This can be a post or a term edit screen.
 *
 * @param {Object} args Edit initialize arguments.
 * @param {boolean} args.shouldRenderSnippetPreview Whether the new reactified
 *                                                  snippet preview should be
 *                                                  rendered.
 * @param {string} args.seoTarget Target to render the seo analysis.
 * @param {string} args.readabilityTarget Target to render the readability analysis.
 * @param {Function} args.onRefreshRequest The function to refresh the analysis.
 *
 * @returns {Object} The store and the data.
 */
export function initialize( args ) {
	const store = registerStoreInGutenberg();
	let data = {};
	registerPlugin();

	// Only use Gutenberg's data if Gutenberg is available.
	if ( isGutenbergDataAvailable() ) {
		const gutenbergData = new Data( wp.data, args.onRefreshRequest );
		gutenbergData.subscribeToGutenberg();
		data = gutenbergData;
	}

	renderReactApps( store, args );

	if ( args.shouldRenderSnippetPreview ) {
		renderSnippetPreview( store );
	}

	return {
		store,
		data,
	};
}

export default initialize;
