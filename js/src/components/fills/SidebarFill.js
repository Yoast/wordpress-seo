/* External dependencies */
import { Fill } from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import PropTypes from "prop-types";

/* Internal dependencies */
import CollapsibleCornerstone from "../../containers/CollapsibleCornerstone";
import Warning from "../../containers/Warning";
import KeywordInput from "../contentAnalysis/KeywordInput";
import ReadabilityAnalysis from "../contentAnalysis/ReadabilityAnalysis";
import SeoAnalysis from "../contentAnalysis/SeoAnalysis";
import SidebarItem from "../SidebarItem";
import SnippetPreviewModal from "../SnippetPreviewModal";
import TopLevelProviders from "../TopLevelProviders";

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
						<KeywordInput />
					</TopLevelProviders>
				</SidebarItem> }
				{ <SidebarItem renderPriority={ 9 }>
					<TopLevelProviders
						store={ store }
						theme={ theme }
						location={ "sidebar" }
					>
						<SnippetPreviewModal />
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
				</SidebarItem>
				}
			</Fill>
		</Fragment>
	);
}

SidebarFill.propTypes = {
	settings: PropTypes.object.isRequired,
	store: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};
