/* External dependencies */
import { Fill } from "@wordpress/components";
import { select } from "@wordpress/data";
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
import SearchAppearanceModal from "../modals/editorModals/SearchAppearanceModal";
import PremiumSEOAnalysisModal from "../modals/PremiumSEOAnalysisModal";
import SocialAppearanceModal from "../modals/editorModals/SocialAppearanceModal";
import SchemaTabContainer from "../../containers/SchemaTab";
import SidebarCollapsible from "../SidebarCollapsible";
import AdvancedSettings from "../../containers/AdvancedSettings";
import WincherSEOPerformanceModal from "../../containers/WincherSEOPerformanceModal";
import WebinarPromoNotification from "../WebinarPromoNotification";
import { BlackFridaySaleNotification } from "../BlackFridaySaleNotification";
import { BlackFridaySidebarChecklistPromo } from "../BlackFridaySidebarChecklistPromo";

import KeywordUpsell from "../KeywordUpsell";

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
	/**
	 * Checks if the Webinar promotion should be shown.
	 * @returns {boolean} Whether the Webinar promotion should be shown.
	 */
	const shouldShowWebinarPromoNotification = () => {
		const isBlackFridaySalePromoActive = select( "yoast-seo/editor" ).isPromotionActive( "black_friday_2023_sale" );
		const isBlackFridaySaleAlertDismissed = select( "yoast-seo/editor" ).isAlertDismissed( "black-friday-2023-sale" );
		const isBlackFridayChecklistPromoActive = select( "yoast-seo/editor" ).isPromotionActive( "black_friday_2023_checklist" );
		const isBlackFridayChecklistAlertDismissed = select( "yoast-seo/editor" ).isAlertDismissed( "black-friday-2023-sidebar-checklist" );

		if ( ( isBlackFridaySalePromoActive && ! isBlackFridaySaleAlertDismissed ) ||
			( isBlackFridayChecklistPromoActive && ! isBlackFridayChecklistAlertDismissed ) ) {
			return false;
		}

		return true;
	};

	const webinarIntroBlockEditorUrl = get( window, "wpseoScriptData.webinarIntroBlockEditorUrl", "https://yoa.st/webinar-intro-block-editor" );
	const isWooCommerce = get( window, "wpseoScriptData.isWooCommerceActive", "" );

	return (
		<Fragment>
			<Fill name="YoastSidebar">
				<SidebarItem key="warning" renderPriority={ 1 }>
					<Warning />
					<div style={ { margin: "0 16px" } }>
						{ /* eslint-disable max-len */ }
						{ shouldShowWebinarPromoNotification() &&
							<WebinarPromoNotification hasIcon={ false } image={ null } url={ webinarIntroBlockEditorUrl } />
						}
						{ isWooCommerce && <BlackFridaySidebarChecklistPromo hasIcon={ false } /> }
						<BlackFridaySaleNotification image={ null } hasIcon={ false } />
					</div>
				</SidebarItem>
				{ settings.isKeywordAnalysisActive && <SidebarItem key="keyword-input" renderPriority={ 8 }>
					<KeywordInput
						isSEMrushIntegrationActive={ settings.isSEMrushIntegrationActive }
					/>
				</SidebarItem> }
				<SidebarItem key="search-appearance" renderPriority={ 25 }>
					<SearchAppearanceModal />
				</SidebarItem>
				{ ( settings.useOpenGraphData || settings.useTwitterData ) && <SidebarItem key="social-appearance" renderPriority={ 26 }>
					<SocialAppearanceModal
						useOpenGraphData={ settings.useOpenGraphData }
						useTwitterData={ settings.useTwitterData }
					/>
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
						/>
						{ settings.shouldUpsell && <PremiumSEOAnalysisModal location="sidebar" /> }
					</Fragment>
				</SidebarItem> }
				{ settings.isContentAnalysisActive && <SidebarItem key="readability" renderPriority={ 20 }>
					<ReadabilityAnalysis
						shouldUpsell={ settings.shouldUpsell }
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
