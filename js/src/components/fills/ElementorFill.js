import { Fill } from "@wordpress/components";
import PropTypes from "prop-types";
import CollapsibleCornerstone from "../../containers/CollapsibleCornerstone";
import PostSettingsModal from "../../containers/PostSettingsModal";
import Warning from "../../containers/Warning";
import KeywordInput from "../contentAnalysis/KeywordInput";
import ReadabilityAnalysis from "../contentAnalysis/ReadabilityAnalysis";
import SeoAnalysis from "../contentAnalysis/SeoAnalysis";
import SidebarItem from "../SidebarItem";
import SnippetPreviewModal from "../SnippetPreviewModal";

/**
 * Creates the ElementorFill component.
 *
 * @param {Object} settings The feature toggles.
 *
 * @returns {wp.Element} The Sidebar component.
 *
 * @constructor
 */
export default function ElementorFill( { settings } ) {
	return (
		<Fill name="YoastElementor">
			<SidebarItem renderPriority={ 1 }>
				<Warning />
			</SidebarItem>
			<SidebarItem renderPriority={ 2 }>
				<PostSettingsModal />
			</SidebarItem>
			{ settings.isKeywordAnalysisActive && <SidebarItem renderPriority={ 8 }>
				<KeywordInput />
			</SidebarItem> }
			{ <SidebarItem renderPriority={ 9 }>
				<SnippetPreviewModal />
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
	settings: PropTypes.object.isRequired,
};
