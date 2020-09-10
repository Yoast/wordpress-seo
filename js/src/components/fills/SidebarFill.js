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
export default function SidebarFill( { settings, store, theme } ) {
	return (
		<Fragment>
			<Fill name="YoastSidebar">
				<SidebarItem renderPriority={ 1 }>
					<TopLevelProviders
						store={ store }
						theme={ theme }
						location={ "sidebar" }
					>
						<Warning />
					</TopLevelProviders>
				</SidebarItem>
				{ settings.isKeywordAnalysisActive && <SidebarItem renderPriority={ 8 }>
					<TopLevelProviders
						store={ store }
						theme={ theme }
						location={ "sidebar" }
					>
						<KeywordInput isSEMrushIntegrationActive={ settings.isSEMrushIntegrationActive } />
					</TopLevelProviders>
				</SidebarItem> }
				<SidebarItem renderPriority={ 23 }>
					<TopLevelProviders
						store={ store }
						theme={ theme }
						location={ "sidebar" }
					>
						<GooglePreviewModal />
					</TopLevelProviders>
				</SidebarItem>
				{ settings.displayFacebook && <SidebarItem renderPriority={ 24 }>
					<TopLevelProviders
						store={ store }
						theme={ theme }
						location={ "sidebar" }
					>
						<FacebookPreviewModal />
					</TopLevelProviders>
				</SidebarItem> }
				{ settings.displayTwitter && <SidebarItem renderPriority={ 25 }>
					<TopLevelProviders
						store={ store }
						theme={ theme }
						location={ "sidebar" }
					>
						<TwitterPreviewModal />
					</TopLevelProviders>
				</SidebarItem> }
				{ settings.displaySchemaSettings && <SidebarItem renderPriority={ 26 }>
					<TopLevelProviders
						store={ store }
						theme={ theme }
						location={ "sidebar" }
					>
						<SidebarCollapsible
							title={ __( "Schema", "wordpress-seo" ) }
						>
							<SchemaTabContainer />
						</SidebarCollapsible>
					</TopLevelProviders>
				</SidebarItem> }
				{ settings.displayAdvancedTab && <SidebarItem renderPriority={ 27 }>
					<TopLevelProviders
						store={ store }
						theme={ theme }
						location={ "sidebar" }
					>
						<SidebarCollapsible
							title={ __( "Advanced", "wordpress-seo" ) }
						>
							<AdvancedSettings location="sidebar" />
						</SidebarCollapsible>
					</TopLevelProviders>
				</SidebarItem> }
				{ settings.isContentAnalysisActive && <SidebarItem renderPriority={ 10 }>
					<TopLevelProviders
						store={ store }
						theme={ theme }
						location={ "sidebar" }
					>
						<ReadabilityAnalysis />
					</TopLevelProviders>
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && <SidebarItem renderPriority={ 20 }>
					<TopLevelProviders
						store={ store }
						theme={ theme }
						location={ "sidebar" }
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
						location={ "sidebar" }
					>
						<CollapsibleCornerstone />
					</TopLevelProviders>
				</SidebarItem> }
			</Fill>
		</Fragment>
	);
}

SidebarFill.propTypes = {
	settings: PropTypes.object.isRequired,
	store: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};
