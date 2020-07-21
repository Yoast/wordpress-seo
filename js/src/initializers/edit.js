/* global window wp */
/* External dependencies */
import styled from "styled-components";
import { Fragment } from "@wordpress/element";
import { combineReducers, registerStore, select, dispatch } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { registerFormatType } from "@wordpress/rich-text";
import {
	get,
	pickBy,
} from "lodash-es";

/* Internal dependencies */
import Data from "../analysis/data.js";
import reducers from "../redux/reducers";
import PluginIcon from "../containers/PluginIcon";
import ClassicEditorData from "../analysis/classicEditorData.js";
import isGutenbergDataAvailable from "../helpers/isGutenbergDataAvailable";
import SidebarFill from "../containers/SidebarFill";
import MetaboxPortal from "../components/portals/MetaboxPortal";
import * as selectors from "../redux/selectors";
import * as actions from "../redux/actions";
import { setSettings } from "../redux/actions/settings";
import UsedKeywords from "../analysis/usedKeywords";
import { setMarkerStatus } from "../redux/actions";
import { isAnnotationAvailable } from "../decorator/gutenberg";
import SidebarSlot from "../components/slots/SidebarSlot";
import { link } from "../inline-links/edit-link";
import PrePublish from "../containers/PrePublish";
import DocumentSidebar from "../containers/DocumentSidebar";
import PostPublish from "../containers/PostPublish";

const PLUGIN_NAMESPACE = "yoast-seo";

const PinnedPluginIcon = styled( PluginIcon )`
	width: 20px;
	height: 20px;
`;

/**
 * Contains the Yoast SEO block editor integration.
 */
class Edit {
	/**
	 * @param {Object}   args                                 Edit initialize arguments.
	 * @param {Function} args.onRefreshRequest                The function to refresh the analysis.
	 * @param {Object}   args.replaceVars                     The replaceVars object.
	 * @param {string}   args.snippetEditorBaseUrl            Base URL of the site the user is editing.
	 * @param {string}   args.snippetEditorDate               The date for the snippet editor.
	 * @param {array}    args.recommendedReplacementVariables The recommended replacement variables for this context.
	 * @param {Object}   args.classicEditorDataSettings       Settings for the ClassicEditorData object.
	 */
	constructor( args ) {
		this._localizedData = this.getLocalizedData();
		this._args = args;
		this._init();
	}

	/**
	 * Get the localized data from the global namespace.
	 *
	 * @returns {Object} Localized data.
	 */
	getLocalizedData() {
		return (
			window.wpseoScriptData.metabox ||
			{ intl: {}, isRtl: false }
		);
	}

	/**
	 * Initializes the settings store.
	 *
	 * @returns {void} .
	 */
	_init() {
		this._store = this._registerStoreInGutenberg();

		this._registerPlugin();

		if ( typeof get( window, "wp.blockEditor.__experimentalLinkControl" ) === "function" ) {
			this._registerFormats();
		} else {
			console.warn(
				__( "Marking links with nofollow/sponsored has been disabled for WordPress installs < 5.4.", "wordpress-seo" ) +
				" " +
				sprintf(
					__( "Please upgrade your WordPress version or install the Gutenberg plugin to get this %1$s feature.", "wordpress-seo" ),
					"Yoast SEO"
				)
			);
		}

		this._data = this._initializeData();

		this._store.dispatch( setSettings( {
			socialPreviews: {
				sitewideImage: this._localizedData.sitewide_social_image,
				authorName: this._localizedData.author_name,
				siteName: this._localizedData.site_name,
				contentImage: this._localizedData.first_content_image,
			},
			snippetEditor: {
				baseUrl: this._args.snippetEditorBaseUrl,
				date: this._args.snippetEditorDate,
				recommendedReplacementVariables: this._args.recommendedReplaceVars,
				siteIconUrl: this._localizedData.siteIconUrl,
			},
		} ) );
	}

	/**
	 * Registers the Yoast inline link format.
	 *
	 * @private
	 *
	 * @returns {void}
	 */
	_registerFormats() {
		[
			link,
		].forEach( ( { name, replaces, ...settings } ) => {
			if ( replaces ) {
				dispatch( "core/rich-text" ).removeFormatTypes( replaces );
			}
			if ( name ) {
				registerFormatType( name, settings );
			}
		} );
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
			actions: pickBy( actions, x => typeof x === "function" ),
		} );
	}

	/**
	 * Registers the plugin into the gutenberg editor, creates a sidebar entry for the plugin,
	 * and creates that sidebar's content.
	 *
	 * @returns {void}
	 */
	_registerPlugin() {
		if ( ! isGutenbergDataAvailable() ) {
			return;
		}

		const {
			PluginPrePublishPanel,
			PluginPostPublishPanel,
			PluginDocumentSettingPanel,
			PluginSidebar,
			PluginSidebarMoreMenuItem,
		} = wp.editPost;
		const { registerPlugin } = wp.plugins;
		const store = this._store;
		const pluginTitle = this._localizedData.isPremium ? "Yoast SEO Premium" : "Yoast SEO";

		const theme = {
			isRtl: this._localizedData.isRtl,
		};
		const preferences = store.getState().preferences;
		const analysesEnabled = preferences.isKeywordAnalysisActive || preferences.isContentAnalysisActive;
		this.initiallyOpenDocumentSettings();

		/**
		 * Renders the yoast sidebar
		 *
	 	 * @returns {Component} The yoast sidebar component.
	 	 */
		const YoastSidebar = () => (
			<Fragment>
				<PluginSidebarMoreMenuItem
					target="seo-sidebar"
					icon={ <PluginIcon /> }
				>
					{ pluginTitle }
				</PluginSidebarMoreMenuItem>
				<PluginSidebar
					name="seo-sidebar"
					title={ pluginTitle }
				>
					<SidebarSlot />
				</PluginSidebar>
				<Fragment>
					<SidebarFill store={ store } theme={ theme } />
					<MetaboxPortal target="wpseo-metabox-root" store={ store } theme={ theme } />
				</Fragment>
				{ analysesEnabled && <PluginPrePublishPanel
					className="yoast-seo-sidebar-panel"
					title={ __( "Yoast SEO", "wordpress-seo" ) }
					initialOpen={ true }
					icon={ <Fragment /> }
				>
					<PrePublish />
				</PluginPrePublishPanel> }
				<PluginPostPublishPanel
					className="yoast-seo-sidebar-panel"
					title={ __( "Yoast SEO", "wordpress-seo" ) }
					initialOpen={ true }
					icon={ <Fragment /> }
				>
					<PostPublish />
				</PluginPostPublishPanel>
				{ analysesEnabled && <PluginDocumentSettingPanel
					name="document-panel"
					className="yoast-seo-sidebar-panel"
					title={ __( "Yoast SEO", "wordpress-seo" ) }
					icon={ <Fragment /> }
				>
					<DocumentSidebar />
				</PluginDocumentSettingPanel> }
			</Fragment>
		);

		registerPlugin( PLUGIN_NAMESPACE, {
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
		const store  = this._store;
		const args   = this._args;
		const wpData = get( window, "wp.data" );

		// Only use Gutenberg's data if Gutenberg is available.
		if ( isGutenbergDataAvailable() ) {
			const gutenbergData = new Data( wpData, args.onRefreshRequest, store );
			gutenbergData.initialize( args.replaceVars );
			return gutenbergData;
		}

		const classicEditorData = new ClassicEditorData( args.onRefreshRequest, store, args.classicEditorDataSettings );
		classicEditorData.initialize( args.replaceVars );
		return classicEditorData;
	}

	/**
	 * Initialize used keyword analysis.
	 *
	 * @param {Function} refreshAnalysis Function that triggers a refresh of the analysis.
	 * @param {string}   ajaxAction      The ajax action to use when retrieving the used keywords data.
	 *
	 * @returns {void}
	 */
	initializeUsedKeywords( refreshAnalysis, ajaxAction ) {
		const store         = this._store;
		const localizedData = this._localizedData;
		const scriptUrl     = get(
			window,
			[ "wpseoScriptData", "analysis", "worker", "keywords_assessment_url" ],
			"used-keywords-assessment.js"
		);

		const usedKeywords = new UsedKeywords(
			ajaxAction,
			localizedData,
			refreshAnalysis,
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
	 * Enables marker button if WordPress annotation is available.
	 *
	 * @returns {void}
	 */
	initializeAnnotations() {
		if ( isAnnotationAvailable() ) {
			this._store.dispatch( setMarkerStatus( "enabled" ) );
		}
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

	/**
	 * Makes sure the Yoast SEO document panel is toggled open on the first time users see it.
	 *
	 * @returns {void}
	 */
	initiallyOpenDocumentSettings() {
		const firstLoad = ! select( "core/edit-post" ).getPreferences().panels[ "yoast-seo/document-panel" ];
		if ( firstLoad ) {
			dispatch( "core/edit-post" ).toggleEditorPanelOpened( "yoast-seo/document-panel" );
		}
	}
}

export default Edit;
