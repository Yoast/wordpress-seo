/* External dependencies */
import { createInterpolateElement, Fragment, useCallback } from "@wordpress/element";
import { Fill } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import CollapsibleCornerstone from "../../containers/CollapsibleCornerstone";
import SnippetEditor from "../../containers/SnippetEditor";
import Warning from "../../containers/Warning";
import { KeywordInput, ReadabilityAnalysis, SeoAnalysis, InclusiveLanguageAnalysis } from "@yoast/externals/components";
import InsightsCollapsible from "../../insights/components/insights-collapsible";
import MetaboxCollapsible from "../MetaboxCollapsible";
import SidebarItem from "../SidebarItem";
import AdvancedSettings from "../../containers/AdvancedSettings";
import SocialMetadataPortal from "../portals/SocialMetadataPortal";
import SchemaTabContainer from "../../containers/SchemaTab";
import SEMrushRelatedKeyphrases from "../../containers/SEMrushRelatedKeyphrases";
import WincherSEOPerformance from "../../containers/WincherSEOPerformance";
import { isWordProofIntegrationActive } from "../../helpers/wordproof";
import WordProofAuthenticationModals from "../../components/modals/WordProofAuthenticationModals";
import PremiumSEOAnalysisModal from "../modals/PremiumSEOAnalysisModal";
import KeywordUpsell from "../KeywordUpsell";
import { TimeConstrainedNotification } from "../../components/TimeConstrainedNotification";
/* eslint-disable complexity */
/**
 * Creates the Metabox component.
 *
 * @param {Object} settings 				The feature toggles.
 * @param {Object} store    				The Redux store.
 * @param {Object} theme    				The theme to use.
 * @param {Array} wincherKeyphrases 		The Wincher trackable keyphrases.
 * @param {Function} setWincherNoKeyphrase	Sets wincher no keyphrases in the store.
 *
 * @returns {wp.Element} The Metabox component.
 */
export default function MetaboxFill( { settings, wincherKeyphrases, setWincherNoKeyphrase } ) {
	const onToggleWincher = useCallback( () => {
		if ( ! wincherKeyphrases.length ) {
			setWincherNoKeyphrase( true );
			// This is fragile, should replace with a real React ref.
			document.querySelector( "#focus-keyword-input-metabox" ).focus();
			return false;
		}
	}, [ wincherKeyphrases, setWincherNoKeyphrase ] );

	return (
		<>
			{ isWordProofIntegrationActive() && <WordProofAuthenticationModals /> }
			<Fill name="YoastMetabox">
				<SidebarItem
					key="warning"
					renderPriority={ 1 }
				>
					<Warning />
				</SidebarItem>
				<SidebarItem
					key="time-constrained-notification"
					renderPriority={ 2 }
				>
					<TimeConstrainedNotification
						title={ __( "Is your WooCommerce store ready for Black Friday?", "wordpress-seo" ) }
						promoId="black-friday-2023"
					>
						{ createInterpolateElement(
							sprintf(
								/* translators: %1$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
								__( "The Yoast %1$sultimate Black Friday checklist%2$s helps you prepare in time, so you can boost your results during this sale.", "wordpress-seo" ),
								"<strong>",
								"</strong>" ),
							{
								strong: <strong />,
							}
						) }
						&nbsp;<a href="https://www.yoast.com" target="_blank" rel="noreferrer">
							{ __( "Get the checklist and start optimizing now!", "wordpress-seo" ) }
						</a>
					</TimeConstrainedNotification>
				</SidebarItem>
				{ settings.isKeywordAnalysisActive && <SidebarItem key="keyword-input" renderPriority={ 8 }>
					<KeywordInput
						isSEMrushIntegrationActive={ settings.isSEMrushIntegrationActive }
					/>
					{ ! window.wpseoScriptData.metabox.isPremium && <Fill name="YoastRelatedKeyphrases">
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
					<ReadabilityAnalysis
						shouldUpsell={ settings.shouldUpsell }
					/>
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && <SidebarItem key="seo-analysis" renderPriority={ 20 }>
					<Fragment>
						<SeoAnalysis
							shouldUpsell={ settings.shouldUpsell }
							shouldUpsellWordFormRecognition={ settings.isWordFormRecognitionActive }
						/>
						{ settings.shouldUpsell && <PremiumSEOAnalysisModal location="metabox" /> }
					</Fragment>
				</SidebarItem> }
				{ settings.isInclusiveLanguageAnalysisActive && <SidebarItem key="inclusive-language-analysis" renderPriority={ 21 }>
					<InclusiveLanguageAnalysis />
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && <SidebarItem key="additional-keywords-upsell" renderPriority={ 22 }>
					{ settings.shouldUpsell && <KeywordUpsell /> }
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && settings.isWincherIntegrationActive &&
				<SidebarItem key="wincher-seo-performance" renderPriority={ 25 }>
					<MetaboxCollapsible
						id={ "yoast-wincher-seo-performance-metabox" }
						title={ __( "Track SEO performance", "wordpress-seo" ) }
						initialIsOpen={ false }
						prefixIcon={ { icon: "chart-square-bar", color: colors.$color_grey_medium_dark } }
						prefixIconCollapsed={ { icon: "chart-square-bar", color: colors.$color_grey_medium_dark } }
						onToggle={ onToggleWincher }
					>
						<WincherSEOPerformance />
					</MetaboxCollapsible>
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
				{ settings.isInsightsEnabled && <SidebarItem key="insights" renderPriority={ 52 }>
					<InsightsCollapsible location="metabox" />
				</SidebarItem> }
			</Fill>
		</>
	);
}

MetaboxFill.propTypes = {
	settings: PropTypes.object.isRequired,
	wincherKeyphrases: PropTypes.array.isRequired,
	setWincherNoKeyphrase: PropTypes.func.isRequired,
};

/* eslint-enable complexity */
