/* External dependencies */
import { Fill } from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import CollapsibleCornerstone from "../../containers/CollapsibleCornerstone";
import Warning from "../../containers/Warning";
import KeywordInput from "../contentAnalysis/KeywordInput";
import ReadabilityAnalysis from "../contentAnalysis/ReadabilityAnalysis";
import SeoAnalysis from "../contentAnalysis/SeoAnalysis";
import SidebarItem from "../SidebarItem";
import GooglePreviewModal from "../modals/editorModals/GooglePreviewModal";
import TwitterPreviewModal from "../modals/editorModals/TwitterPreviewModal";
import FacebookPreviewModal from "../modals/editorModals/FacebookPreviewModal";
import TopLevelProviders from "../TopLevelProviders";
import SchemaTabContainer from "../../containers/SchemaTab";
import SidebarCollapsible from "../SidebarCollapsible";
import AdvancedSettings from "../../containers/AdvancedSettings";

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
				<SidebarItem renderPriority={ 1 }>
					<Warning />
				</SidebarItem>
				{ settings.isKeywordAnalysisActive && <SidebarItem renderPriority={ 8 }>
					<KeywordInput />
				</SidebarItem> }
				<SidebarItem renderPriority={ 23 }>
					<GooglePreviewModal />
				</SidebarItem>
				{ settings.displayFacebook && <SidebarItem renderPriority={ 24 }>
					<FacebookPreviewModal />
				</SidebarItem> }
				{ settings.displayTwitter && <SidebarItem renderPriority={ 25 }>
					<TwitterPreviewModal />
				</SidebarItem> }
				{ settings.displaySchemaSettings && <SidebarItem renderPriority={ 26 }>
					<SidebarCollapsible
						title={ __( "Schema", "wordpress-seo" ) }
					>
						<SchemaTabContainer />
					</SidebarCollapsible>
				</SidebarItem> }
				{ settings.displayAdvancedTab && <SidebarItem renderPriority={ 27 }>
					<SidebarCollapsible
						title={ __( "Advanced", "wordpress-seo" ) }
					>
						<AdvancedSettings />
					</SidebarCollapsible>
				</SidebarItem> }
				{ settings.isContentAnalysisActive && <SidebarItem renderPriority={ 10 }>
					<ReadabilityAnalysis />
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && <SidebarItem renderPriority={ 20 }>
					<SeoAnalysis
						shouldUpsell={ settings.shouldUpsell }
						shouldUpsellWordFormRecognition={ settings.isWordFormRecognitionActive }
					/>
				</SidebarItem> }
				{ settings.isCornerstoneActive && <SidebarItem renderPriority={ 30 }>
					<CollapsibleCornerstone />
				</SidebarItem> }
			</Fill>
		</Fragment>
	);
}

SidebarFill.propTypes = {
	settings: PropTypes.object.isRequired,
};
