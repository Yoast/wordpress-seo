/* External dependencies */
import { Fill } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { Fragment, useEffect } from "@wordpress/element";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { get } from "lodash";

/* Internal dependencies */
import CollapsibleCornerstone from "../../containers/CollapsibleCornerstone";
import Warning from "../../containers/Warning";
import { KeywordInput, ReadabilityAnalysis, SeoAnalysis, InclusiveLanguageAnalysis } from "@yoast/externals/components";
import { useFirstEligibleNotification } from "../../hooks/use-first-eligible-notification";
import InsightsModal from "../../insights/components/insights-modal";
import { InternalLinkingSuggestionsUpsell } from "../modals/InternalLinkingSuggestionsUpsell";
import SidebarItem from "../SidebarItem";
import SearchAppearanceModal from "../modals/editorModals/SearchAppearanceModal";
import PremiumSEOAnalysisModal from "../modals/PremiumSEOAnalysisModal";
import SocialAppearanceModal from "../modals/editorModals/SocialAppearanceModal";
import SchemaTabContainer from "../../containers/SchemaTab";
import SidebarCollapsible from "../SidebarCollapsible";
import AdvancedSettings from "../../containers/AdvancedSettings";
import WincherSEOPerformanceModal from "../../containers/WincherSEOPerformanceModal";
import KeywordUpsell from "../modals/KeywordUpsell";
import isBlockEditor from "../../helpers/isBlockEditor";

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
	const webinarIntroUrl = get( window, "wpseoScriptData.webinarIntroBlockEditorUrl", "https://yoa.st/webinar-intro-block-editor" );
	const FirstEligibleNotification = useFirstEligibleNotification( { webinarIntroUrl } );
	const { editorMode, activeAIButtonId } = useSelect( ( select ) => ( {
		editorMode: select( "core/edit-post" ).getEditorMode(),
		activeAIButtonId: select( "yoast-seo/editor" ).getActiveAIFixesButton(),
	} ), [] );
	const { setMarkerStatus } = useDispatch( "yoast-seo/editor" );

	/**
	 * Toggles the markers status, based on the editor mode and the AI assessment fixes button status.
	 *
	 * @param {string} editorMode The editor mode.
	 * @param {boolean} activeAIButtonId The active AI button ID.
	 *
	 * @returns {void}
	 */
	useEffect( () => {
		if ( isBlockEditor() ) {
			// Toggle markers based on editor mode.
			if ( ( editorMode === "visual" && activeAIButtonId ) || editorMode === "text" ) {
				setMarkerStatus( "disabled" );
			} else {
				setMarkerStatus( "enabled" );
			}

			// Cleanup function to reset the marker status when the component unmounts or editor mode changes
			return () => {
				setMarkerStatus( "disabled" );
			};
		}
	}, [ editorMode, activeAIButtonId, setMarkerStatus ] );

	return (
		<Fragment>
			<Fill name="YoastSidebar">
				<SidebarItem key="warning" renderPriority={ 1 }>
					<Warning />
					<div style={ { margin: "0 16px" } }>
						{ FirstEligibleNotification && <FirstEligibleNotification /> }
					</div>
				</SidebarItem>
				{ settings.isKeywordAnalysisActive && <SidebarItem key="keyword-input" renderPriority={ 8 }>
					<KeywordInput
						isSEMrushIntegrationActive={ settings.isSEMrushIntegrationActive }
					/>
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
				{ settings.isKeywordAnalysisActive && settings.isWincherIntegrationActive && <SidebarItem renderPriority={ 23 }>
					<WincherSEOPerformanceModal
						location="sidebar"
					/>
				</SidebarItem> }
				{ settings.shouldUpsell && <SidebarItem key="internal-linking-suggestions-upsell" renderPriority={ 25 }>
					<InternalLinkingSuggestionsUpsell />
				</SidebarItem> }
				<SidebarItem key="search-appearance" renderPriority={ 26 }>
					<SearchAppearanceModal />
				</SidebarItem>
				{ ( settings.useOpenGraphData || settings.useTwitterData ) && <SidebarItem key="social-appearance" renderPriority={ 27 }>
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
				{ settings.isCornerstoneActive && <SidebarItem key="cornerstone" renderPriority={ 30 }>
					<CollapsibleCornerstone />
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
