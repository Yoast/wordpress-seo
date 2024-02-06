import { WooHeaderItem } from "@woocommerce/admin-layout";
import { Button, Fill, ToolbarItem } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { InclusiveLanguageAnalysis, KeywordInput, ReadabilityAnalysis, SeoAnalysis } from "@yoast/externals/components";
import { BlackFridayPromotion } from "../../components/BlackFridayPromotion";
import { BlackFridaySidebarChecklistPromotion } from "../../components/BlackFridaySidebarChecklistPromotion";
import MetaboxCollapsible from "../../components/MetaboxCollapsible";
import { InternalLinkingSuggestionsUpsell } from "../../components/modals/InternalLinkingSuggestionsUpsell";
import KeywordUpsell from "../../components/modals/KeywordUpsell";
import PremiumSEOAnalysisModal from "../../components/modals/PremiumSEOAnalysisModal";
import SocialMetadataPortal from "../../components/portals/SocialMetadataPortal";
import SidebarItem from "../../components/SidebarItem";
import WebinarPromoNotification from "../../components/WebinarPromoNotification";
import AdvancedSettings from "../../containers/AdvancedSettings";
import CollapsibleCornerstone from "../../containers/CollapsibleCornerstone";
import PluginIcon from "../../containers/PluginIcon";
import SchemaTabContainer from "../../containers/SchemaTab";
import SEMrushRelatedKeyphrases from "../../containers/SEMrushRelatedKeyphrases";
import SnippetEditor from "../../containers/SnippetEditor";
import SocialMetadata from "../../containers/SocialMetadata";
import Warning from "../../containers/Warning";
import WincherSEOPerformanceModal from "../../containers/WincherSEOPerformanceModal";
import { shouldShowWebinarPromotionNotificationInSidebar } from "../../helpers/shouldShowWebinarPromotionNotification";
import InsightsCollapsible from "../../insights/components/insights-collapsible";
import { SLOTS, STORES } from "../constants";

/**
 * @returns {JSX.Element} The element.
 */
export const YoastSeoApp = () => {
	// TODO: Introduce product shortlink?
	const webinarIntroUrl = useSelect( select => select( STORES.editor )?.selectLink( "https://yoa.st/webinar-intro-block-editor" ), [] );
	const {
		isKeywordAnalysisActive,
		isContentAnalysisActive,
		isCornerstoneActive,
		isInclusiveLanguageAnalysisActive,
		isWordFormRecognitionActive,
		isInsightsEnabled,
		isSEMrushIntegrationActive,
		isWincherIntegrationActive,
		isAdvancedSettingsActive,
		isPremium,
		isPost,
		isTerm,
		shouldUpsell,
		isWooCommerceActive,
	} = useSelect( select => select( STORES.editor )?.getPreferences(), [] );

	return (
		<>
			<WooHeaderItem name="product" order={ 10 }>
				<ToolbarItem
					as={ Button }
					variant="tertiary"
					icon={ <PluginIcon size={ 28 } /> }
				>
					{ __( "Analyze", "wordpress-seo" ) }
				</ToolbarItem>
			</WooHeaderItem>
			<Fill name={ SLOTS.seo }>
				<SidebarItem renderPriority={ 1 }>
					<>
						<Warning />
						{ shouldShowWebinarPromotionNotificationInSidebar() && (
							<WebinarPromoNotification hasIcon={ false } image={ null } url={ webinarIntroUrl } />
						) }
						{ isWooCommerceActive && <BlackFridaySidebarChecklistPromotion hasIcon={ false } /> }
						<BlackFridayPromotion image={ null } hasIcon={ false } />
					</>
				</SidebarItem>
				{ isKeywordAnalysisActive && <SidebarItem key="keyword-input" renderPriority={ 8 }>
					<>
						<KeywordInput isSEMrushIntegrationActive={ isSEMrushIntegrationActive } />
						{ ! isPremium && <Fill name="YoastRelatedKeyphrases">
							<SEMrushRelatedKeyphrases />
						</Fill> }
					</>
				</SidebarItem> }
				<SidebarItem key="search-appearance" renderPriority={ 9 }>
					<MetaboxCollapsible
						id="yoast-snippet-editor-metabox"
						title={ __( "Search appearance", "wordpress-seo" ) }
						initialIsOpen={ true }
					>
						<SnippetEditor hasPaperStyle={ false } />
					</MetaboxCollapsible>
				</SidebarItem>
				{ isContentAnalysisActive && <SidebarItem key="readability-analysis" renderPriority={ 10 }>
					<ReadabilityAnalysis shouldUpsell={ shouldUpsell } />
				</SidebarItem> }
				{ isKeywordAnalysisActive && <SidebarItem key="seo-analysis" renderPriority={ 20 }>
					<>
						<SeoAnalysis
							shouldUpsell={ shouldUpsell }
							shouldUpsellWordFormRecognition={ isWordFormRecognitionActive }
						/>
						{ shouldUpsell && <PremiumSEOAnalysisModal location="metabox" /> }
					</>
				</SidebarItem> }
				{ isInclusiveLanguageAnalysisActive && <SidebarItem key="inclusive-language-analysis" renderPriority={ 21 }>
					<InclusiveLanguageAnalysis />
				</SidebarItem> }
				{ isKeywordAnalysisActive && <SidebarItem key="additional-keywords-upsell" renderPriority={ 22 }>
					<>
						{ shouldUpsell && <KeywordUpsell /> }
					</>
				</SidebarItem> }
				{ ( isKeywordAnalysisActive && isWincherIntegrationActive ) && <SidebarItem key="wincher-seo-performance" renderPriority={ 23 }>
					<WincherSEOPerformanceModal location="metabox" />
				</SidebarItem> }
				{ ( shouldUpsell && ! isTerm ) && <SidebarItem key="internal-linking-suggestions-upsell" renderPriority={ 25 }>
					<InternalLinkingSuggestionsUpsell />
				</SidebarItem> }
				<SidebarItem key="social" renderPriority={ 27 }>
					<>
						{ /* TODO: needs disconnection from hidden inputs. */ }
						{ /* <SocialMetadata />*/ }
					</>
				</SidebarItem>
				{ isCornerstoneActive && <SidebarItem key="cornerstone" renderPriority={ 30 }>
					<CollapsibleCornerstone />
				</SidebarItem> }
				{ isAdvancedSettingsActive && <SidebarItem key="advanced" renderPriority={ 40 }>
					<MetaboxCollapsible id="collapsible-advanced-settings" title={ __( "Advanced", "wordpress-seo" ) }>
						{ /* TODO: needs disconnection from hidden inputs. */ }
						<AdvancedSettings />
					</MetaboxCollapsible>
				</SidebarItem> }
				{ ( isAdvancedSettingsActive && isPost ) && <SidebarItem key="schema" renderPriority={ 50 }>
					<>
						{ /* TODO: needs disconnection from hidden inputs & metabox behavior. */ }
						{ /* <SchemaTabContainer />*/ }
					</>
				</SidebarItem> }
				{ isInsightsEnabled && <SidebarItem key="insights" renderPriority={ 52 }>
					<InsightsCollapsible location="metabox" />
				</SidebarItem> }
			</Fill>
		</>
	);
};
