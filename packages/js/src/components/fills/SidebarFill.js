/* External dependencies */
import { Fill } from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import PersistentDismissableAlert from "../../containers/PersistentDismissableAlert";
import CollapsibleCornerstone from "../../containers/CollapsibleCornerstone";
import Warning from "../../containers/Warning";
import { KeywordInput, ReadabilityAnalysis, SeoAnalysis } from "@yoast/externals/components";
import SidebarItem from "../SidebarItem";
import GooglePreviewModal from "../modals/editorModals/GooglePreviewModal";
import TwitterPreviewModal from "../modals/editorModals/TwitterPreviewModal";
import FacebookPreviewModal from "../modals/editorModals/FacebookPreviewModal";
import SchemaTabContainer from "../../containers/SchemaTab";
import SidebarCollapsible from "../SidebarCollapsible";
import AdvancedSettings from "../../containers/AdvancedSettings";
import WincherSEOPerformanceModal from "../../containers/WincherSEOPerformanceModal";

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
	return (
		<Fragment>
			<Fill name="YoastSidebar">
				<PersistentDismissableAlert alertKey="webinar-promo-alert" type="info">
					This works
					{ /* <button onClick={ () => console }></button> */ }
				</PersistentDismissableAlert>
				<SidebarItem key="warning" renderPriority={ 1 }>
					<Warning />
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
				{ settings.isContentAnalysisActive && <SidebarItem key="readability" renderPriority={ 10 }>
					<ReadabilityAnalysis />
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && <SidebarItem key="seo" renderPriority={ 20 }>
					<SeoAnalysis
						shouldUpsell={ settings.shouldUpsell }
						shouldUpsellWordFormRecognition={ settings.isWordFormRecognitionActive }
					/>
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
