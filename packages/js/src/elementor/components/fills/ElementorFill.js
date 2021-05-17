// External dependencies.
import { Fill } from "@wordpress/components";
import { useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

// Internal dependencies.
import CollapsibleCornerstone from "../../../containers/CollapsibleCornerstone";
import Alert from "../../containers/Alert";
import KeywordInput from "../../../components/contentAnalysis/KeywordInput";
import ReadabilityAnalysis from "../../../components/contentAnalysis/ReadabilityAnalysis";
import SeoAnalysis from "../../../components/contentAnalysis/SeoAnalysis";
import SidebarItem from "../../../components/SidebarItem";
import GooglePreviewModal from "../modals/editorModals/GooglePreviewModal";
import TwitterPreviewModal from "../modals/editorModals/TwitterPreviewModal";
import FacebookPreviewModal from "../modals/editorModals/FacebookPreviewModal";
import SidebarCollapsible from "../../../components/SidebarCollapsible";
import SchemaTabContainer from "../../../containers/SchemaTab";
import AdvancedSettings from "../../../containers/AdvancedSettings";
import SEMrushRelatedKeyphrases from "../../../containers/SEMrushRelatedKeyphrases";

/* eslint-disable complexity */
/**
 * Creates the ElementorFill component.
 *
 * @param {Object} props The props.
 *
 * @returns {wp.Element} The Sidebar component.
 *
 * @constructor
 */
export default function ElementorFill( { isLoading, onLoad, settings } ) {
	useEffect( () => {
		setTimeout( () => {
			if ( isLoading ) {
				onLoad();
			}
		} );
	} );

	if ( isLoading ) {
		return null;
	}

	return (
		<Fill name="YoastElementor">
			<SidebarItem renderPriority={ 1 }>
				<Alert />
			</SidebarItem>
			{ settings.isKeywordAnalysisActive && <SidebarItem renderPriority={ 8 }>
				<KeywordInput
					isSEMrushIntegrationActive={ settings.isSEMrushIntegrationActive }
				/>
				{ ! window.wpseoScriptData.metabox.isPremium && <Fill name="YoastRelatedKeyphrases">
					<SEMrushRelatedKeyphrases />
				</Fill> }
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
					<AdvancedSettings location="sidebar" />
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
	);
}

ElementorFill.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	onLoad: PropTypes.func.isRequired,
	settings: PropTypes.object.isRequired,
};
/* eslint-enable complexity */
