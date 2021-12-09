/* global wpseoScriptData wpseoAdminL10n */

import { Fill } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SnippetEditor } from "@yoast/search-metadata-previews";
import { GooglePreviewContainer } from "@yoast/seo-integration";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import SeoAnalysis from "../seo-analysis";
import ReadabilityAnalysis from "../readability-analysis";
import MetaboxCollapsible from "../../../components/MetaboxCollapsible";
import SocialMetadataPortal from "../../../components/portals/SocialMetadataPortal";
import SidebarItem from "../../../components/SidebarItem";
import AdvancedSettings from "../../../containers/AdvancedSettings";
import CollapsibleCornerstone from "../../../containers/CollapsibleCornerstone";
import SchemaTabContainer from "../../../containers/SchemaTab";
import SEMrushRelatedKeyphrases from "../../../containers/SEMrushRelatedKeyphrases";
import Warning from "../../../containers/Warning";
import { EDITOR_STORE_NAME } from "../../editor-store";
import FocusKeyphraseInput from "../focus-keyphrase-input";

/**
 * Creates the Metabox component.
 *
 * @returns {JSX.Element} The Metabox.
 */
const Metabox = () => {
	const settings = useSelect( select => select( EDITOR_STORE_NAME ).getPreferences() );
	const isSeoAnalysisActive = useSelect( select => select( SEO_STORE_NAME ).selectIsSeoAnalysisActive() );
	const isReadabilityAnalysisActive = useSelect( select => select( SEO_STORE_NAME ).selectIsReadabilityAnalysisActive() );
	const shoppingData = useSelect( select => select( EDITOR_STORE_NAME ).getShoppingData() );
	const siteIconUrl = useSelect( select => select( EDITOR_STORE_NAME ).getSiteIconUrlFromSettings() );
	const previewImageUrl = useSelect( select => select( EDITOR_STORE_NAME ).getSnippetEditorPreviewImageUrl() );
	const analysisType = useSelect( select => select( SEO_STORE_NAME ).selectAnalysisType() );

	return (
		<Fragment>
			<SidebarItem
				key="warning"
				renderPriority={ 1 }
			>
				<Warning />
			</SidebarItem>
			{ isSeoAnalysisActive && <SidebarItem key="keyword-input" renderPriority={ 8 }>
				<FocusKeyphraseInput focusKeyphraseInfoLink={ wpseoAdminL10n[ "shortlinks.focus_keyword_info" ] } />
				{ ! wpseoScriptData.metabox.isPremium && <Fill name="YoastRelatedKeyphrases">
					<SEMrushRelatedKeyphrases />
				</Fill> }
			</SidebarItem> }
			<SidebarItem key="google-preview" renderPriority={ 9 }>
				<MetaboxCollapsible
					id={ "yoast-snippet-editor-metabox" }
					title={ __( "Google preview", "wordpress-seo" ) } initialIsOpen={ true }
				>
					<GooglePreviewContainer
						as={ SnippetEditor }
						shoppingData={ shoppingData }
						faviconSrc={ siteIconUrl }
						mobileImageSrc={ previewImageUrl }
						isTaxonomy={ analysisType === "term" }
					/>
				</MetaboxCollapsible>
			</SidebarItem>
			{ isReadabilityAnalysisActive && <SidebarItem key="readability-analysis" renderPriority={ 10 }>
				<ReadabilityAnalysis />
			</SidebarItem> }
			{ isSeoAnalysisActive && <SidebarItem key="seo-analysis" renderPriority={ 20 }>
				<SeoAnalysis
					shouldUpsell={ settings.shouldUpsell }
					shouldUpsellWordFormRecognition={ settings.isWordFormRecognitionActive }
				/>
			</SidebarItem> }
			{ settings.isCornerstoneActive && <SidebarItem key="cornerstone" renderPriority={ 30 }>
				<CollapsibleCornerstone />
			</SidebarItem> }
			{ settings.displayAdvancedTab && <SidebarItem key="advanced" renderPriority={ 40 }>
				<MetaboxCollapsible id={ "collapsible-advanced-settings" } title={ __( "Advanced", "wordpress-seo" ) }>
					<AdvancedSettings />
				</MetaboxCollapsible>
			</SidebarItem> }
			{ settings.displaySchemaSettings && <SidebarItem key="schema" renderPriority={ 50 }>
				<SchemaTabContainer />
			</SidebarItem> }
			<SidebarItem
				key="social"
				renderPriority={ -1 }
			>
				<SocialMetadataPortal target="wpseo-section-social" />
			</SidebarItem>
		</Fragment>
	);
};

export default Metabox;
