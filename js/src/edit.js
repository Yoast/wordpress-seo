/* global window, wpseoPostScraperL10n, wpseoTermScraperL10n, process, wp */
/* External dependencies */
import React from "react";
import { Provider } from "react-redux";
import styled from "styled-components";
import { Fragment } from "@wordpress/element";
import { Slot } from "@wordpress/components";
import { combineReducers, registerStore } from "@wordpress/data";

/* Internal dependencies */
import Data from "./analysis/data.js";
import reducers from "./redux/reducers";
import PluginIcon from "../../images/Yoast_icon_kader.svg";
import ClassicEditorData from "./analysis/classicEditorData.js";
import isGutenbergDataAvailable from "./helpers/isGutenbergDataAvailable";
import Sidebar from "./containers/Sidebar";
import MetaboxPortal from "./components/MetaboxPortal";
import sortComponentsByRenderPriority from "./helpers/sortComponentsByRenderPriority";
import * as selectors from "./redux/selectors";
import { setSettings } from "./redux/actions/settings";

// This should be the entry point for all the edit screens. Because of backwards compatibility we can't change this at once.
let localizedData = { intl: {}, isRtl: false };
if ( window.wpseoPostScraperL10n ) {
	localizedData = wpseoPostScraperL10n;
} else if ( window.wpseoTermScraperL10n ) {
	localizedData = wpseoTermScraperL10n;
}

const PinnedPluginIcon = styled( PluginIcon )`
	width: 20px;
	height: 20px;
`;

/**
 * Registers a redux store in Gutenberg.
 *
 * @returns {Object} The store.
 */
function registerStoreInGutenberg() {
	return registerStore( "yoast-seo/editor", {
		reducer: combineReducers( reducers ),
		selectors,
	} );
}

/**
 * Registers the plugin into the gutenberg editor, creates a sidebar entry for the plugin,
 * and creates that sidebar's content.
 *
 * @param {Object} store The store to use.
 *
 * @returns {void}
 **/
function registerPlugin( store ) {
	if ( isGutenbergDataAvailable() ) {
		const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
		const { registerPlugin } = wp.plugins;
		const theme = {
			isRtl: localizedData.isRtl,
		};

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
							return sortComponentsByRenderPriority( fills );
						} }
					</Slot>
				</PluginSidebar>

				<Provider store={ store } >
					<Fragment>
						<Sidebar store={ store } />
						<MetaboxPortal target="wpseo-meta-section-react" store={ store } theme={ theme } />
					</Fragment>
				</Provider>
			</Fragment>
		);

		registerPlugin( "yoast-seo", {
			render: YoastSidebar,
			icon: <PinnedPluginIcon />,
		} );
	}
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
 * @param {Function} args.onRefreshRequest                The function to refresh the analysis.
 * @param {Object}   args.replaceVars                     The replaceVars object.
 * @param {string}   args.snippetEditorBaseUrl            Base URL of the site the user is editing.
 * @param {string}   args.snippetEditorDate               The date for the snippet editor.
 * @param {array}    args.recommendedReplacementVariables The recommended replacement variables for this context.
 *
 * @returns {Object} The store and the data.
 */
export function initialize( args ) {
	const store = registerStoreInGutenberg();

	if ( args.shouldRenderGutenbergSidebar ) {
		registerPlugin( store );
	}

	const data = initializeData( wp.data, args, store );

	store.dispatch( setSettings( {
		snippetEditor: {
			baseUrl: args.snippetEditorBaseUrl,
			date: args.snippetEditorDate,
			recommendedReplacementVariables: args.recommendedReplaceVars,
		},
	} ) );

	return {
		store,
		data,
	};
}

export default initialize;
