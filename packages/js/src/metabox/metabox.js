/* global wpseoScriptData wpseoAdminL10n */

import { Fill } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { Fragment, useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import { PropTypes } from "prop-types";
import { KeywordInput } from "../components/contentAnalysis/KeywordInput";
import ReadabilityAnalysis from "../components/contentAnalysis/ReadabilityAnalysis";
import SeoAnalysis from "../components/contentAnalysis/SeoAnalysis";
import MetaboxCollapsible from "../components/MetaboxCollapsible";
import SocialMetadataPortal from "../components/portals/SocialMetadataPortal";
import SidebarItem from "../components/SidebarItem";
import AdvancedSettings from "../containers/AdvancedSettings";
import CollapsibleCornerstone from "../containers/CollapsibleCornerstone";
import SchemaTabContainer from "../containers/SchemaTab";
import SEMrushRelatedKeyphrases from "../containers/SEMrushRelatedKeyphrases";
import SnippetEditor from "../containers/SnippetEditor";
import Warning from "../containers/Warning";
import { EDITOR_STORE_NAME } from "./editor-store";

/**
 * Creates the focus keyphrase input component.
 *
 * @param {string} focusKeyphraseInfoLink The URL for the help link.
 *
 * @returns {JSX.Element} The focus keyphrase input.
 */
const FocusKeyphraseInput = ( { focusKeyphraseInfoLink } ) => {
	const focusKeyphrase = useSelect( select => select( SEO_STORE_NAME ).selectKeyphrase() );
	const displayNoKeyphraseMessage = useSelect( select => select( EDITOR_STORE_NAME ).getSEMrushNoKeyphraseMessage() );
	const isSEMrushIntegrationActive = useSelect( select => select( EDITOR_STORE_NAME ).getIsSEMrushIntegrationActive() );
	const { updateKeyphrase } = useDispatch( SEO_STORE_NAME );
	const { setMarkerPauseStatus } = useDispatch( EDITOR_STORE_NAME );

	const pauseMarker = useCallback( () => setMarkerPauseStatus( true ), [ setMarkerPauseStatus ] );
	const startMarker = useCallback( () => setMarkerPauseStatus( false ), [ setMarkerPauseStatus ] );

	return (
		<KeywordInput
			keyword={ focusKeyphrase }
			displayNoKeyphraseMessage={ displayNoKeyphraseMessage }
			isSEMrushIntegrationActive={ isSEMrushIntegrationActive }
			helpLink={ focusKeyphraseInfoLink }
			onFocusKeywordChange={ updateKeyphrase }
			onFocusKeyword={ pauseMarker }
			onBlurKeyword={ startMarker }
		/>
	);
};

FocusKeyphraseInput.propTypes = {
	focusKeyphraseInfoLink: PropTypes.string.isRequired,
};

/**
 * Creates the Metabox component.
 *
 * @returns {JSX.Element} The Metabox.
 */
const Metabox = () => {
	const settings = useSelect( select => select( EDITOR_STORE_NAME ).getPreferences() );
	const isKeywordAnalysisActive = useSelect( select => select( EDITOR_STORE_NAME ).getIsKeywordAnalysisActive() );

	return (
		<Fragment>
			<SidebarItem
				key="warning"
				renderPriority={ 1 }
			>
				<Warning />
			</SidebarItem>
			{ isKeywordAnalysisActive && <SidebarItem key="keyword-input" renderPriority={ 8 }>
				<FocusKeyphraseInput focusKeyphraseInfoLink={ wpseoAdminL10n[ "shortlinks.focus_keyword_info" ] } />
				{ ! wpseoScriptData.metabox.isPremium && <Fill name="YoastRelatedKeyphrases">
					<SEMrushRelatedKeyphrases />
				</Fill> }
			</SidebarItem> }
			<SidebarItem key="google-preview" renderPriority={ 9 }>
				<MetaboxCollapsible
					id={ "yoast-snippet-editor-metabox" }
					title={ __( "Google preview", "wordpress-seo" ) } initialIsOpen={ true }
				>
					<SnippetEditor hasPaperStyle={ false } />
				</MetaboxCollapsible>
			</SidebarItem>
			{ settings.isContentAnalysisActive && <SidebarItem key="readability-analysis" renderPriority={ 10 }>
				<ReadabilityAnalysis />
			</SidebarItem> }
			{ settings.isKeywordAnalysisActive && <SidebarItem key="seo-analysis" renderPriority={ 20 }>
				<SeoAnalysis
					shouldUpsell={ settings.shouldUpsell }
					shouldUpsellWordFormRecognition={ settings.isWordFormRecognitionActive }
				/>
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
		</Fragment>
	);
};

export default Metabox;
