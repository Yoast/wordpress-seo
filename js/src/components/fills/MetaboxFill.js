/* External dependencies */
import { Fill } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/* Internal dependencies */
import CollapsibleCornerstone from "../../containers/CollapsibleCornerstone";
import SnippetEditor from "../../containers/SnippetEditor";
import Warning from "../../containers/Warning";
import KeywordInput from "../contentAnalysis/KeywordInput";
import ReadabilityAnalysis from "../contentAnalysis/ReadabilityAnalysis";
import SeoAnalysis from "../contentAnalysis/SeoAnalysis";
import MetaboxCollapsible from "../MetaboxCollapsible";
import SidebarItem from "../SidebarItem";
import TopLevelProviders from "../TopLevelProviders";
import AdvancedSettings from "../AdvancedSettings";
import SocialMetadataPortal from "../portals/SocialMetadataPortal";

/**
 * Creates the Metabox component.
 *
 * @param {Object} settings The feature toggles.
 * @param {Object} store    The Redux store.
 * @param {Object} theme    The theme to use.
 *
 * @returns {wp.Element} The Metabox component.
 */
export default function MetaboxFill( { settings, store, theme } ) {
	return (
		<Fill name="YoastMetabox">
			<SidebarItem renderPriority={ 1 }>
				<TopLevelProviders
					store={ store }
					theme={ theme }
					location={ "metabox" }
				>
					<Warning />
				</TopLevelProviders>
			</SidebarItem>
			{ settings.isKeywordAnalysisActive && <SidebarItem renderPriority={ 8 }>
				<TopLevelProviders
					store={ store }
					theme={ theme }
					location={ "metabox" }
				>
					<KeywordInput />
				</TopLevelProviders>
			</SidebarItem> }
			<SidebarItem renderPriority={ 9 }>
				<TopLevelProviders
					store={ store }
					theme={ theme }
					location={ "metabox" }
				>
					<MetaboxCollapsible
						id={ "yoast-snippet-editor-metabox" }
						title={ __( "Google preview", "wordpress-seo" ) } initialIsOpen={ true }
					>
						<SnippetEditor hasPaperStyle={ false } />
					</MetaboxCollapsible>
				</TopLevelProviders>
			</SidebarItem>
			{ settings.isContentAnalysisActive && <SidebarItem renderPriority={ 10 }>
				<TopLevelProviders
					store={ store }
					theme={ theme }
					location={ "metabox" }
				>
					<ReadabilityAnalysis />
				</TopLevelProviders>
			</SidebarItem> }
			{ settings.isKeywordAnalysisActive && <SidebarItem renderPriority={ 20 }>
				<TopLevelProviders
					store={ store }
					theme={ theme }
					location={ "metabox" }
				>
					<SeoAnalysis
						shouldUpsell={ settings.shouldUpsell }
						shouldUpsellWordFormRecognition={ settings.isWordFormRecognitionActive }
					/>
				</TopLevelProviders>
			</SidebarItem> }
			{ settings.isCornerstoneActive && <SidebarItem renderPriority={ 30 }>
				<TopLevelProviders
					store={ store }
					theme={ theme }
					location={ "metabox" }
				>
					<CollapsibleCornerstone />
				</TopLevelProviders>
			</SidebarItem> }
			{ settings.displayAdvancedTab && <SidebarItem renderPriority={ 40 }>
				<TopLevelProviders
					store={ store }
					theme={ theme }
					location={ "metabox" }
				>
					<AdvancedSettings />
				</TopLevelProviders>
			</SidebarItem> }
			<TopLevelProviders
				renderPriority={ -1 }
				store={ store }
				theme={ theme }
				location={ "metabox" }
			>
				<SocialMetadataPortal target="wpseo-section-social" />
			</TopLevelProviders>
		</Fill>
	);
}

MetaboxFill.propTypes = {
	settings: PropTypes.object.isRequired,
	store: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};
