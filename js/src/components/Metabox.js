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
		<Fragment>
			<Fill name="YoastMetabox">
				<SidebarItem renderPriority={ 9 }>
					<ThemeProvider theme={ theme }>
						<StoreProvider store={ store }>
							<SnippetEditor hasPaperStyle={ false }/>
						</StoreProvider>
					</ThemeProvider>
				</SidebarItem>
				{ settings.isContentAnalysisActive && <SidebarItem renderPriority={ 10 }>
					<ThemeProvider theme={ theme }>
						<StoreProvider store={ store }>
							<ReadabilityAnalysis />
						</StoreProvider>
					</ThemeProvider>
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && <SidebarItem renderPriority={ 20 }>
					<ThemeProvider theme={ theme }>
						<StoreProvider store={ store }>
							<SeoAnalysis
								shouldUpsell={ settings.shouldUpsell }
								keywordUpsell={ keywordUpsellProps }
							/>
						</StoreProvider>
					</ThemeProvider>
				</SidebarItem> }
				{ settings.isCornerstoneActive && <SidebarItem renderPriority={ 30 }>
					<ThemeProvider theme={ theme }>
						<StoreProvider store={ store }>
							<CollapsibleCornerstone />
						</StoreProvider>
					</ThemeProvider>
				</SidebarItem>
				}
			</Fill>
		</Fragment>
	);
}

Metabox.propTypes = {
	settings: PropTypes.object,
	store: PropTypes.object,
	theme: PropTypes.object,
};
