/* External dependencies */
import { Fill } from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { get } from "lodash";

/* Internal dependencies */
import CollapsibleCornerstone from "../../containers/CollapsibleCornerstone";
import Warning from "../../containers/Warning";
import { KeywordInput, ReadabilityAnalysis, SeoAnalysis } from "@yoast/externals/components";
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
				<SidebarItem key="google-preview" renderPriority={ 23 }>
					<GooglePreviewModal />
				</SidebarItem>
				{ settings.displayFacebook && <SidebarItem key="facebook-preview" renderPriority={ 24 }>
					<FacebookPreviewModal />
				</SidebarItem> }
				{ settings.displayTwitter && <SidebarItem key="twitter-preview" renderPriority={ 25 }>
					<TwitterPreviewModal />
				</SidebarItem> }
				{ settings.displaySchemaSettings && <SidebarItem key="schema" renderPriority={ 26 }>
					<SidebarCollapsible
						title={ __( "Schema", "wordpress-seo" ) }
					>
						<SchemaTabContainer />
					</SidebarCollapsible>
				</SidebarItem> }
				{ settings.displayAdvancedTab && <SidebarItem key="advanced" renderPriority={ 27 }>
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
						{ settings.shouldUpsell && <PremiumSEOAnalysisModal /> }
					</Fragment>
				</SidebarItem> }
				{ settings.isContentAnalysisActive && <SidebarItem key="readability" renderPriority={ 20 }>
					<ReadabilityAnalysis />
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && <SidebarItem key="additional-keywords-upsell" renderPriority={ 21 }>
					{ settings.shouldUpsell && <KeywordUpsell /> }
				</SidebarItem> }
				{ settings.isCornerstoneActive && <SidebarItem key="cornerstone" renderPriority={ 30 }>
					<CollapsibleCornerstone />
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && settings.isWincherIntegrationActive && <SidebarItem renderPriority={ 22 }>
					<WincherSEOPerformanceModal
						location="sidebar"
					/>
				</SidebarItem> }
			</Fill>
		</Fragment>
	);
}

SidebarFill.propTypes = {
	settings: PropTypes.object.isRequired,
};
/* eslint-enable complexity */
