/* global wpseoScriptData wpseoAdminL10n */

import { Fill } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import { SEO_STORE_NAME, useAnalyze } from "@yoast/seo-integration";

import SocialMetadataPortal from "../../../components/portals/SocialMetadataPortal";
import SidebarItem from "../../../components/SidebarItem";
import SchemaTabContainer from "../../../containers/SchemaTab";
import SEMrushRelatedKeyphrases from "../../../containers/SEMrushRelatedKeyphrases";
import Warning from "../../../containers/Warning";
import marksDecorator from "../../decorators/marks";
import { EDITOR_STORE_NAME } from "../../editor-store";
import AdvancedSettings from "../advanced-settings";
import CornerstoneContent from "../cornerstone-content";
import FocusKeyphraseInput from "../focus-keyphrase-input";
import GooglePreview from "../google-preview";
import ReadabilityAnalysis from "../readability-analysis";
import SeoAnalysis from "../seo-analysis";

/**
 * Creates the Metabox component.
 *
 * @returns {JSX.Element} The Metabox.
 */
const Metabox = () => {
	marksDecorator();

	const settings = useSelect( select => select( EDITOR_STORE_NAME ).getPreferences() );
	const isSeoAnalysisActive = useSelect( select => select( SEO_STORE_NAME ).selectIsSeoAnalysisActive() );
	const isReadabilityAnalysisActive = useSelect( select => select( SEO_STORE_NAME ).selectIsReadabilityAnalysisActive() );

	useAnalyze();

	return (
		<Fragment>
			<SidebarItem key="warning" renderPriority={ 1 }>
				<Warning />
			</SidebarItem>
			{ isSeoAnalysisActive &&
				<SidebarItem key="keyword-input" renderPriority={ 8 }>
					<FocusKeyphraseInput focusKeyphraseInfoLink={ wpseoAdminL10n[ "shortlinks.focus_keyword_info" ] } />
					{ ! wpseoScriptData.metabox.isPremium &&
						<Fill name="YoastRelatedKeyphrases">
							<SEMrushRelatedKeyphrases />
						</Fill>
					}
				</SidebarItem>
			}
			<SidebarItem key="google-preview" renderPriority={ 9 }>
				<GooglePreview />
			</SidebarItem>
			{ isReadabilityAnalysisActive &&
				<SidebarItem key="readability-analysis" renderPriority={ 10 }>
					<ReadabilityAnalysis />
				</SidebarItem>
			}
			{ isSeoAnalysisActive &&
				<SidebarItem key="seo-analysis" renderPriority={ 20 }>
					<SeoAnalysis
						shouldUpsell={ settings.shouldUpsell }
						shouldUpsellWordFormRecognition={ settings.isWordFormRecognitionActive }
					/>
				</SidebarItem>
			}
			{ settings.isCornerstoneActive &&
				<SidebarItem key="cornerstone" renderPriority={ 30 }>
					<CornerstoneContent cornerstoneContentInfoLink={ wpseoAdminL10n[ "shortlinks.cornerstone_content_info" ] } />
				</SidebarItem>
			}
			{ settings.displayAdvancedTab &&
				<SidebarItem key="advanced" renderPriority={ 40 }>
					<AdvancedSettings />
				</SidebarItem>
			}
			{ settings.displaySchemaSettings &&
				<SidebarItem key="schema" renderPriority={ 50 }>
					<SchemaTabContainer />
				</SidebarItem>
			}
			<SidebarItem key="social" renderPriority={ -1 }>
				<SocialMetadataPortal target="wpseo-section-social" />
			</SidebarItem>
		</Fragment>
	);
};

export default Metabox;
