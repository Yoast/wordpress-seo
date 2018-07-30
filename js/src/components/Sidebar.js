/* global wp */

import React from "react";
import PropTypes from "prop-types";
import { Provider as StoreProvider } from "react-redux";

import SidebarItem from "./SidebarItem";
import ReadabilityAnalysis from "./contentAnalysis/ReadabilityAnalysis";
import CollapsibleCornerstone from "../containers/CollapsibleCornerstone";
import keywordUpsellProps from "../values/keywordUpsellProps";
import SeoAnalysis from "./contentAnalysis/SeoAnalysis";

/**
 * Creates the Sidebar component.
 *
 * @param {Object} settings The feature toggles.
 * @param {Object} store The Redux store.
 *
 * @returns {ReactElement} The Sidebar component.
 *
 * @constructor
 */
export default function Sidebar( { settings, store } ) {
	const { Fill } = wp.components;

	return (
		<Fill name="YoastSidebar">
			{ settings.isContentAnalysisActive && <SidebarItem renderPriority={ 10 }>
				<StoreProvider store={ store } >
					<ReadabilityAnalysis />
				</StoreProvider>
			</SidebarItem> }
			{ settings.isKeywordAnalysisActive && <SidebarItem renderPriority={ 20 }>
				<StoreProvider store={ store } >
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
		</Fill>
	);
}

Sidebar.propTypes = {
	settings: PropTypes.object,
	store: PropTypes.object,
};
