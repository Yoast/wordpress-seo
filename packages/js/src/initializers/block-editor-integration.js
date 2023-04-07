import { updateCategory } from "@wordpress/blocks";
import { Slot } from "@wordpress/components";
import { dispatch, select } from "@wordpress/data";
import {
	PluginDocumentSettingPanel,
	PluginPostPublishPanel,
	PluginPrePublishPanel,
	PluginSidebar,
	PluginSidebarMoreMenuItem,
} from "@wordpress/edit-post";
import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { registerPlugin } from "@wordpress/plugins";
import { registerFormatType } from "@wordpress/rich-text";
import { Root } from "@yoast/externals/contexts";
import { actions } from "@yoast/externals/redux";
import { get } from "lodash";
import initializeWordProofForBlockEditor from "../../../../vendor_prefixed/wordproof/wordpress-sdk/resources/js/initializers/blockEditor";
import getL10nObject from "../analysis/getL10nObject";
import YoastIcon from "../components/PluginIcon";
import MetaboxPortal from "../components/portals/MetaboxPortal";
import SidebarSlot from "../components/slots/SidebarSlot";
import DocumentSidebar from "../containers/DocumentSidebar";
import PluginIcon from "../containers/PluginIcon";
import PostPublish from "../containers/PostPublish";
import PrePublish from "../containers/PrePublish";
import SidebarFill from "../containers/SidebarFill";
import WincherPostPublish from "../containers/WincherPostPublish";
import { isAnnotationAvailable } from "../decorator/gutenberg";
import { isWordProofIntegrationActive } from "../helpers/wordproof";
import { link } from "../inline-links/edit-link";

/**
 * Registers the Yoast inline link format.
 *
 * @private
 *
 * @returns {void}
 */
function registerFormats() {
	if ( typeof get( window, "wp.blockEditor.__experimentalLinkControl" ) === "function" ) {
		const unknownSettings = select( "core/rich-text" )
			.getFormatType( "core/unknown" );

		if ( typeof( unknownSettings ) !== "undefined" ) {
			dispatch( "core/rich-text" ).removeFormatTypes( "core/unknown" );
		}

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

		if ( typeof( unknownSettings ) !== "undefined" ) {
			registerFormatType( "core/unknown", unknownSettings );
		}
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
	const openedPanels = select( "core/preferences" ).get( "core/edit-post", "openPanels" );
	const firstLoad = ! openedPanels.includes( "yoast-seo/document-panel" );
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
	const isPremium = localizedData.isPremium;
	const pluginTitle = isPremium ? "Yoast SEO Premium" : "Yoast SEO";

	const icon = <YoastIcon />;
	updateCategory( "yoast-structured-data-blocks", { icon } );
	updateCategory( "yoast-internal-linking-blocks", { icon } );

	const theme = {
		isRtl: localizedData.isRtl,
	};
	const preferences = store.getState().preferences;
	const analysesEnabled = preferences.isKeywordAnalysisActive || preferences.isContentAnalysisActive;
	const showWincherPanel = preferences.isKeywordAnalysisActive && preferences.isWincherIntegrationActive;
	initiallyOpenDocumentSettings();

	const blockSidebarContext = { locationContext: "block-sidebar" };
	const blockMetaboxContext = { locationContext: "block-metabox" };

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
				<Root context={ blockSidebarContext }>
					<SidebarSlot store={ store } theme={ theme } />
				</Root>
			</PluginSidebar>
			<Fragment>
				<SidebarFill store={ store } theme={ theme } />
				<Root context={ blockMetaboxContext }>
					<MetaboxPortal target="wpseo-metabox-root" store={ store } theme={ theme } />
				</Root>
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
				{ showWincherPanel && <WincherPostPublish /> }
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
		icon: <PluginIcon />,
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
		store.dispatch( actions.setMarkerStatus( "enabled" ) );
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

	if ( isWordProofIntegrationActive() ) {
		initializeWordProofForBlockEditor();
	}
}
