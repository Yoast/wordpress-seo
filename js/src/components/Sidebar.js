/* global wp */

import React from "react";
import PropTypes from "prop-types";
import { Provider as StoreProvider } from "react-redux";

import SidebarItem from "./SidebarItem";
import ReadabilityAnalysis from "./contentAnalysis/ReadabilityAnalysis";

/**
 * Creates the Sidebar component.
 *
 * @param {bool}   isContentAnalysisActive Whether or not the content analysis is active or not.
 * @param {bool}   isKeywordAnalysisActive Whether or not the keyword analysis is active or not.
 * @param {Object} store The Redux store.
 *
 * @returns {ReactElement} The Sidebar component.
 *
 * @constructor
 */
export default function Sidebar( { isContentAnalysisActive, isKeywordAnalysisActive, store } ) {
	const { Fill } = wp.components;

	return (
		<Fill name="YoastSidebar">
			{ isContentAnalysisActive && <SidebarItem renderPriority={ 10 }>
			<StoreProvider store={ store } >
				<ReadabilityAnalysis/>
			</StoreProvider>
			</SidebarItem> }
			{ isKeywordAnalysisActive && <SidebarItem renderPriority={ 20 }>SEO analysis</SidebarItem> }
		</Fill>
	);
}

Sidebar.propTypes = {
	isContentAnalysisActive: PropTypes.bool,
	isKeywordAnalysisActive: PropTypes.bool,
	store: PropTypes.object,
};
