/* global window wp */
/* External dependencies */
import styled from "styled-components";
import { Fragment } from "@wordpress/element";
import { select, dispatch } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { registerFormatType } from "@wordpress/rich-text";
import { get } from "lodash-es";

/* Internal dependencies */
import Data from "../analysis/data.js";
import PluginIcon from "../containers/PluginIcon";
import SidebarFill from "../containers/SidebarFill";
import MetaboxPortal from "../components/portals/MetaboxPortal";
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
class BlockEditor {
	/**
	 * @param {Object}   args                                 Edit initialize arguments.
	 * @param {Object}   args.store                           The Yoast editor store.
	 * @param {Function} args.onRefreshRequest                The function to refresh the analysis.
	 * @param {Object}   args.replaceVars                     The replaceVars object.
	 * @param {Object}   args.classicEditorDataSettings       Settings for the ClassicEditorData object.
	 */
	constructor( args ) {
		this._localizedData = this.getLocalizedData();
		this._args = args;
		this._store = args.store;
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
		this._registerPlugin();
		this._registerFormats();
		this._initializeAnnotations();
		this._data = new Data( this._args.onRefreshRequest, this._store );
		this._data.initialize( this._args.replaceVars );
	}

	/**
	 * Registers the Yoast inline link format.
	 *
	 * @private
	 *
	 * @returns {void}
	 */
	_registerFormats() {
		if ( typeof get( window, "wp.blockEditor.__experimentalLinkControl" ) === "function" ) {
			[
				link,
			].forEach( ( { name, replaces, ...settings } ) => {
				if (replaces) {
					dispatch( "core/rich-text" ).removeFormatTypes( replaces );
				}
				if (name) {
					registerFormatType( name, settings );
				}
			} );
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
	}

	/**
	 * Registers the plugin into the gutenberg editor, creates a sidebar entry for the plugin,
	 * and creates that sidebar's content.
	 *
	 * @returns {void}
	 */
	_registerPlugin() {
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
	_initializeAnnotations() {
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

export default BlockEditor;
