/* External dependencies */
import { useSelect } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import { Fill } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/* Internal dependencies */
import WincherSEOPerformanceModal from "../../containers/WincherSEOPerformanceModal";
import CollapsibleCornerstone from "../../containers/CollapsibleCornerstone";
import SnippetEditor from "../../containers/SnippetEditor";
import Warning from "../../containers/Warning";
import { KeywordInput, ReadabilityAnalysis, SeoAnalysis, InclusiveLanguageAnalysis } from "@yoast/externals/components";
import InsightsCollapsible from "../../insights/components/insights-collapsible";
import MetaboxCollapsible from "../MetaboxCollapsible";
import { InternalLinkingSuggestionsUpsell } from "../modals/InternalLinkingSuggestionsUpsell";
import SidebarItem from "../SidebarItem";
import AdvancedSettings from "../../containers/AdvancedSettings";
import SocialMetadataPortal from "../portals/SocialMetadataPortal";
import SchemaTabContainer from "../../containers/SchemaTab";
import SEMrushRelatedKeyphrases from "../../containers/SEMrushRelatedKeyphrases";
import PremiumSEOAnalysisModal from "../modals/PremiumSEOAnalysisModal";
import KeywordUpsell from "../modals/KeywordUpsell";
import { BlackFridayProductEditorChecklistPromotion } from "../BlackFridayProductEditorChecklistPromotion";
import { BlackFridayPromotion } from "../BlackFridayPromotion";
import { withMetaboxWarningsCheck } from "../higherorder/withMetaboxWarningsCheck";
import isBlockEditor from "../../helpers/isBlockEditor";
import useToggleMarkerStatus from "./hooks/useToggleMarkerStatus";

const BlackFridayProductEditorChecklistPromotionWithMetaboxWarningsCheck = withMetaboxWarningsCheck( BlackFridayProductEditorChecklistPromotion );
const BlackFridayPromotionWithMetaboxWarningsCheck = withMetaboxWarningsCheck( BlackFridayPromotion );

/* eslint-disable complexity */
/**
 * Creates the Metabox component.
 *
 * @param {Object} settings The feature toggles.
 *
 * @returns {wp.Element} The Metabox component.
 */
export default function MetaboxFill( { settings } ) {
	const { isTerm, isProduct, isWooCommerceActive } = useSelect( ( select ) => ( {
		isTerm: select( "yoast-seo/editor" ).getIsTerm(),
		isProduct: select( "yoast-seo/editor" ).getIsProduct(),
		isWooCommerceActive: select( "yoast-seo/editor" ).getIsWooCommerceActive(),
	} ), [] );

	const shouldShowWooCommerceChecklistPromo = isProduct && isWooCommerceActive;

	if ( isBlockEditor() ) {
		useToggleMarkerStatus();
	}

	return (
		<>
			<Fill name="YoastMetabox">
				<SidebarItem
					key="warning"
					renderPriority={ 1 }
				>
					<Warning />
				</SidebarItem>
				<SidebarItem
					key="time-constrained-notification"
					renderPriority={ 2 }
				>
					{ shouldShowWooCommerceChecklistPromo && <BlackFridayProductEditorChecklistPromotionWithMetaboxWarningsCheck /> }
					<BlackFridayPromotionWithMetaboxWarningsCheck image={ null } hasIcon={ false } location={ "metabox" } />
				</SidebarItem>
				{ settings.isKeywordAnalysisActive && <SidebarItem key="keyword-input" renderPriority={ 8 }>
					<KeywordInput
						isSEMrushIntegrationActive={ settings.isSEMrushIntegrationActive }
					/>
					{ ! window.wpseoScriptData.metabox.isPremium && <Fill name="YoastRelatedKeyphrases">
						<SEMrushRelatedKeyphrases />
					</Fill> }
				</SidebarItem> }
				<SidebarItem key="search-appearance" renderPriority={ 9 }>
					<MetaboxCollapsible
						id={ "yoast-snippet-editor-metabox" }
						title={ __( "Search appearance", "wordpress-seo" ) } initialIsOpen={ true }
					>
						<SnippetEditor hasPaperStyle={ false } />
					</MetaboxCollapsible>
				</SidebarItem>
				{ settings.isContentAnalysisActive && <SidebarItem key="readability-analysis" renderPriority={ 10 }>
					<ReadabilityAnalysis
						shouldUpsell={ settings.shouldUpsell }
					/>
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && <SidebarItem key="seo-analysis" renderPriority={ 20 }>
					<Fragment>
						<SeoAnalysis
							shouldUpsell={ settings.shouldUpsell }
							shouldUpsellWordFormRecognition={ settings.isWordFormRecognitionActive }
						/>
						{ settings.shouldUpsell && <PremiumSEOAnalysisModal location="metabox" /> }
					</Fragment>
				</SidebarItem> }
				{ settings.isInclusiveLanguageAnalysisActive && <SidebarItem key="inclusive-language-analysis" renderPriority={ 21 }>
					<InclusiveLanguageAnalysis />
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && <SidebarItem key="additional-keywords-upsell" renderPriority={ 22 }>
					{ settings.shouldUpsell && <KeywordUpsell /> }
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && settings.isWincherIntegrationActive &&
					<SidebarItem key="wincher-seo-performance" renderPriority={ 23 }>
						<WincherSEOPerformanceModal location="metabox" />
					</SidebarItem>
				}
				{ settings.shouldUpsell && ! isTerm && <SidebarItem key="internal-linking-suggestions-upsell" renderPriority={ 25 }>
					<InternalLinkingSuggestionsUpsell />
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
				{ settings.isInsightsEnabled && <SidebarItem key="insights" renderPriority={ 52 }>
					<InsightsCollapsible location="metabox" />
				</SidebarItem> }
			</Fill>
		</>
	);
}

MetaboxFill.propTypes = {
	settings: PropTypes.object.isRequired,
};

/* eslint-enable complexity */
