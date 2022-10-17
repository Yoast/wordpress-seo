/* External dependencies */
import { Fill } from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { get } from "lodash";

/* Internal dependencies */
import CollapsibleCornerstone from "../../containers/CollapsibleCornerstone";
import Warning from "../../containers/Warning";
import { KeywordInput, ReadabilityAnalysis, SeoAnalysis, InclusiveLanguageAnalysis } from "@yoast/externals/components";
import InsightsModal from "../../insights/components/insights-modal";
import SidebarItem from "../SidebarItem";
import GooglePreviewModal from "../modals/editorModals/GooglePreviewModal";
import PremiumSEOAnalysisModal from "../modals/PremiumSEOAnalysisModal";
import TwitterPreviewModal from "../modals/editorModals/TwitterPreviewModal";
import FacebookPreviewModal from "../modals/editorModals/FacebookPreviewModal";
import SchemaTabContainer from "../../containers/SchemaTab";
import SidebarCollapsible from "../SidebarCollapsible";
import AdvancedSettings from "../../containers/AdvancedSettings";
import WincherSEOPerformanceModal from "../../containers/WincherSEOPerformanceModal";
import WebinarPromoNotification from "../WebinarPromoNotification";
import KeywordUpsell from "../KeywordUpsell";
import LinkSuggestions from "../link-suggestions";
import getL10nObject from "../../analysis/getL10nObject";

/* eslint-disable complexity */
/**
 * Creates the SidebarFill component.
 *
 * @param {Object} settings The feature toggles.
 * @param {Object} store    The Redux store.
 * @param {Object} theme    The theme to use.
 *
 * @returns {wp.Element} The Sidebar component.
 *
 * @constructor
 */
export default function SidebarFill( { settings } ) {
	const webinarIntroBlockEditorUrl = get( window, "wpseoScriptData.webinarIntroBlockEditorUrl", "https://yoa.st/webinar-intro-block-editor" );
	const isPremium = getL10nObject().isPremium;

	return (
		<Fragment>
			<Fill name="YoastSidebar">
				<SidebarItem key="warning" renderPriority={ 1 }>
					<Warning />
					<div style={ { margin: "0 16px" } }>
						<WebinarPromoNotification hasIcon={ false } image={ null } url={ webinarIntroBlockEditorUrl } />
					</div>
				</SidebarItem>
				{ settings.isKeywordAnalysisActive && <SidebarItem key="keyword-input" renderPriority={ 8 }>
					<KeywordInput
						isSEMrushIntegrationActive={ settings.isSEMrushIntegrationActive }
					/>
				</SidebarItem> }
				{ ! isPremium &&
					<SidebarItem key="internal-linking-suggestions-upsell" renderPriority={ 24 }>
						<SidebarCollapsible
							title={ __( "Internal linking suggestions", "wordpress-seo" ) }
						>
							<LinkSuggestions location="sidebar" />
						</SidebarCollapsible>
					</SidebarItem>
				}
				<SidebarItem key="google-preview" renderPriority={ 25 }>
					<GooglePreviewModal />
				</SidebarItem>
				{ settings.displayFacebook && <SidebarItem key="facebook-preview" renderPriority={ 26 }>
					<FacebookPreviewModal />
				</SidebarItem> }
				{ settings.displayTwitter && <SidebarItem key="twitter-preview" renderPriority={ 27 }>
					<TwitterPreviewModal />
				</SidebarItem> }
				{ settings.displaySchemaSettings && <SidebarItem key="schema" renderPriority={ 28 }>
					<SidebarCollapsible
						title={ __( "Schema", "wordpress-seo" ) }
					>
						<SchemaTabContainer />
					</SidebarCollapsible>
				</SidebarItem> }
				{ settings.displayAdvancedTab && <SidebarItem key="advanced" renderPriority={ 29 }>
					<SidebarCollapsible
						title={ __( "Advanced", "wordpress-seo" ) }
					>
						<AdvancedSettings />
					</SidebarCollapsible>
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && <SidebarItem key="seo" renderPriority={ 10 }>
					<Fragment>
						<SeoAnalysis
							shouldUpsell={ settings.shouldUpsell }
							shouldUpsellWordFormRecognition={ settings.isWordFormRecognitionActive }
							isYoastSEOWooActive={ settings.isYoastSEOWooEnabled }
						/>
						{ settings.shouldUpsell && <PremiumSEOAnalysisModal location="sidebar" /> }
					</Fragment>
				</SidebarItem> }
				{ settings.isContentAnalysisActive && <SidebarItem key="readability" renderPriority={ 20 }>
					<ReadabilityAnalysis
						shouldUpsell={ settings.shouldUpsell }
						isYoastSEOWooActive={ settings.isYoastSEOWooEnabled }
					/>
				</SidebarItem> }
				{ settings.isInclusiveLanguageAnalysisActive && <SidebarItem key="inclusive-language-analysis" renderPriority={ 21 }>
					<InclusiveLanguageAnalysis />
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && <SidebarItem key="additional-keywords-upsell" renderPriority={ 22 }>
					{ settings.shouldUpsell && <KeywordUpsell /> }
				</SidebarItem> }
				{ settings.isCornerstoneActive && <SidebarItem key="cornerstone" renderPriority={ 30 }>
					<CollapsibleCornerstone />
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && settings.isWincherIntegrationActive && <SidebarItem renderPriority={ 23 }>
					<WincherSEOPerformanceModal
						location="sidebar"
					/>
				</SidebarItem> }
				{ settings.isInsightsEnabled && <SidebarItem renderPriority={ 32 }>
					<InsightsModal location="sidebar" />
				</SidebarItem> }
			</Fill>
		</Fragment>
	);
}

SidebarFill.propTypes = {
	settings: PropTypes.object.isRequired,
};
/* eslint-enable complexity */
