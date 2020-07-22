/* External dependencies */
import styled from "styled-components";
import {
	PluginPrePublishPanel,
	PluginPostPublishPanel,
	PluginDocumentSettingPanel,
	PluginSidebar,
	PluginSidebarMoreMenuItem,
} from "@wordpress/edit-post";
import { registerPlugin } from "@wordpress/plugins";
import { Fragment } from "@wordpress/element";
import { select, dispatch } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { registerFormatType } from "@wordpress/rich-text";
import { get } from "lodash-es";

/* Internal dependencies */
import PluginIcon from "../containers/PluginIcon";
import SidebarFill from "../containers/SidebarFill";
import MetaboxPortal from "../components/portals/MetaboxPortal";
import { setMarkerStatus } from "../redux/actions";
import { isAnnotationAvailable } from "../decorator/gutenberg";
import SidebarSlot from "../components/slots/SidebarSlot";
import { link } from "../inline-links/edit-link";
import PrePublish from "../containers/PrePublish";
import DocumentSidebar from "../containers/DocumentSidebar";
import PostPublish from "../containers/PostPublish";
import getL10nObject from "../analysis/getL10nObject";

const PinnedPluginIcon = styled( PluginIcon )`
	width: 20px;
	height: 20px;
`;

/**
 * Registers the Yoast inline link format.
 *
 * @private
 *
 * @returns {void}
 */
function registerFormats() {
	if ( typeof get( window, "wp.blockEditor.__experimentalLinkControl" ) === "function" ) {
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
 * Makes sure the Yoast SEO document panel is toggled open on the first time users see it.
 *
 * @returns {void}
 */
function initiallyOpenDocumentSettings() {
	const firstLoad = ! select( "core/edit-post" ).getPreferences().panels[ "yoast-seo/document-panel" ];
	if ( firstLoad ) {
		dispatch( "core/edit-post" ).toggleEditorPanelOpened( "yoast-seo/document-panel" );
	}
}

/**
 * Registers the plugin into the gutenberg editor, creates a sidebar entry for the plugin,
 * and creates that sidebar's content.
 *
 * @param {object} store The Yoast editor store.
 *
 * @returns {void}
 */
function registerFills( store ) {
	const localizedData = getL10nObject();
	const pluginTitle = localizedData.isPremium ? "Yoast SEO Premium" : "Yoast SEO";

	const theme = {
		isRtl: localizedData.isRtl,
	};
	const preferences = store.getState().preferences;
	const analysesEnabled = preferences.isKeywordAnalysisActive || preferences.isContentAnalysisActive;
	initiallyOpenDocumentSettings();

	/**
	 * Renders the yoast editor fills.
	 *
	 * @returns {Component} The editor fills component.
	 */
	const EditorFills = () => (
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

	registerPlugin( "yoast-seo", {
		render: EditorFills,
		icon: <PinnedPluginIcon />,
	} );
}

/**
 * Enables marker button if WordPress annotation is available.
 *
 * @param {object} store The Yoast editor store.
 *
 * @returns {void}
 */
function initializeAnnotations( store ) {
	if ( isAnnotationAvailable() ) {
		store.dispatch( setMarkerStatus( "enabled" ) );
	}
}

/**
 * Initializes the Yoast block editor integration.
 *
 * @param {object} store The Yoast editor store.
 *
 * @returns {void}
 */
export default function initBlockEditorIntegration( store ) {
	registerFills( store );
	registerFormats();
	initializeAnnotations( store );
}
