/* global window process wp */
/* External dependencies */
import React from "react";
import { Provider } from "react-redux";
import styled from "styled-components";
import { Fragment } from "@wordpress/element";
import { Slot } from "@wordpress/components";
import { combineReducers, registerStore } from "@wordpress/data";
import get from "lodash/get";

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
import UsedKeywords from "./analysis/usedKeywords";

const PinnedPluginIcon = styled( PluginIcon )`
	width: 20px;
	height: 20px;
`;

class Edit {
	/**
	 * @param {Object}   args                                 Edit initialize arguments.
	 * @param {Function} args.onRefreshRequest                The function to refresh the analysis.
	 * @param {Object}   args.replaceVars                     The replaceVars object.
	 * @param {string}   args.snippetEditorBaseUrl            Base URL of the site the user is editing.
	 * @param {string}   args.snippetEditorDate               The date for the snippet editor.
	 * @param {array}    args.recommendedReplacementVariables The recommended replacement variables for this context.
	 */
	constructor( args ) {
		this._localizedData = this.getLocalizedData();
		this._args =          args;

		this._init();
	}

	/**
	 * Get the localized data from the global namespace.
	 *
	 * @returns {Object} Localized data.
	 */
	getLocalizedData() {
		return (
			window.wpseoPostScraperL10n ||
			window.wpseoTermScraperL10n ||
			{ intl: {}, isRtl: false }
		);
	}

	_init() {
		this._store = this._registerStoreInGutenberg();

		this._registerPlugin();

		this._data = this._initializeData();

		this._store.dispatch( setSettings( {
			snippetEditor: {
				baseUrl: this._args.snippetEditorBaseUrl,
				date: this._args.snippetEditorDate,
				recommendedReplacementVariables: this._args.recommendedReplaceVars,
			},
		} ) );
	}

	/**
	 * Registers a redux store in Gutenberg.
	 *
	 * @returns {Object} The store.
	 */
	_registerStoreInGutenberg() {
		return registerStore( "yoast-seo/editor", {
			reducer: combineReducers( reducers ),
			selectors,
		} );
	}

	/**
	 * Registers the plugin into the gutenberg editor, creates a sidebar entry for the plugin,
	 * and creates that sidebar's content.
	 *
	 * @returns {void}
	 **/
	_registerPlugin() {
		if ( ! isGutenbergDataAvailable() )  {
			return;
		}

		const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
		const { registerPlugin } = wp.plugins;
		const store = this._store;

		const theme = {
			isRtl: this._localizedData.isRtl,
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
						<Sidebar store={ store } theme={ theme } />
						<MetaboxPortal target="wpseo-metabox-root" store={ store } theme={ theme } />
					</Fragment>
				</Provider>
			</Fragment>
		);

		registerPlugin( "yoast-seo", {
			render: YoastSidebar,
			icon: <PinnedPluginIcon />,
		} );
	}

	/**
	 * Initialize the appropriate data class.
	 *
	 * @returns {Object} The instantiated data class.
	 */
	_initializeData() {
		const store =   this._store;
		const args =    this._args;
		const wpData =  get( window, "wp.data" );

		// Only use Gutenberg's data if Gutenberg is available.
		if ( isGutenbergDataAvailable() ) {
			const gutenbergData = new Data( wpData, args.onRefreshRequest, store );
			gutenbergData.initialize( args.replaceVars );
			return gutenbergData;
		}

		const classicEditorData = new ClassicEditorData( args.onRefreshRequest, store );
		classicEditorData.initialize( args.replaceVars );
		return classicEditorData;
	}

	/**
	 * Initialize used keyword analysis.
	 *
	 * @param {App}    app        YoastSEO.js app.
	 * @param {string} ajaxAction The ajax action to use when retrieving the used keywords data.
	 *
	 * @returns {void}
	 */
	initializeUsedKeywords( app, ajaxAction ) {
		const store         = this._store;
		const localizedData = this._localizedData;
		const scriptUrl     = get( global, [ "wpseoAnalysisWorkerL10n", "keywords_assessment_url" ], "wp-seo-used-keywords-assessment.js" );

		const usedKeywords = new UsedKeywords(
			ajaxAction,
			localizedData,
			app,
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

export default Edit;
