import React from "react";
import PropTypes from "prop-types";
import { Provider as StoreProvider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { Fragment } from "@wordpress/element";
import { Fill } from "@wordpress/components";

import SidebarItem from "./SidebarItem";
import SnippetEditor from "../containers/SnippetEditor";
import keywordUpsellProps from "../values/keywordUpsellProps";
import SeoAnalysis from "./contentAnalysis/SeoAnalysis";
import ReadabilityAnalysis from "./contentAnalysis/ReadabilityAnalysis";
import CollapsibleCornerstone from "../containers/CollapsibleCornerstone";

/**
 * Creates the Metabox component.
 *
 * @param {Object} settings The feature toggles.
 * @param {Object} store    The Redux store.
 * @param {Object} theme    The theme to use.
 *
 * @returns {ReactElement} The Metabox component.
 */
export default function Metabox( { settings, store, theme } ) {
	return (
		<Fill name="YoastMetabox">
			<ThemeProvider theme={ theme }>
				<Fragment>
					<SidebarItem renderPriority={ 9 }>
						<StoreProvider store={ store }>
							<SnippetEditor hasPaperStyle={ false }/>
						</StoreProvider>
					</SidebarItem>
					{ settings.isContentAnalysisActive && <SidebarItem renderPriority={ 10 }>
						<StoreProvider store={ store }>
							<ReadabilityAnalysis />
						</StoreProvider>
					</SidebarItem> }
					{ settings.isKeywordAnalysisActive && <SidebarItem renderPriority={ 20 }>
						<StoreProvider store={ store }>
							<SeoAnalysis
								shouldUpsell={ settings.shouldUpsell }
								keywordUpsell={ keywordUpsellProps }
							/>
						</StoreProvider>
					</SidebarItem> }
					{ settings.isCornerstoneActive && <SidebarItem renderPriority={ 30 }>
						<StoreProvider store={ store }>
							<CollapsibleCornerstone />
						</StoreProvider>
					</SidebarItem>
					}
				</Fragment>
			</ThemeProvider>
		</Fill>
	);
}

Metabox.propTypes = {
	settings: PropTypes.object,
	store: PropTypes.object,
	theme: PropTypes.object,
};
