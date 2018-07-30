/* global wp */

import React from "react";
import PropTypes from "prop-types";

import SidebarItem from "./SidebarItem";

/**
 * Creates the Sidebar component.
 *
 * @param {bool} isContentAnalysisActive Whether or not the readability analysis is active.
 * @param {bool} isKeywordAnalysisActive Whether or not the SEO analysis is active.
 *
 * @returns {ReactElement} The Sidebar component.
 */
export default function Sidebar( { isContentAnalysisActive, isKeywordAnalysisActive } ) {
	const { Fill } = wp.components;

	return (
		<Fill name="YoastSidebar">
			{ isContentAnalysisActive && <SidebarItem renderPriority={ 10 }>Readability analysis</SidebarItem> }
			{ isKeywordAnalysisActive && <SidebarItem renderPriority={ 20 }>SEO analysis</SidebarItem> }
		</Fill>
	);
}

Sidebar.propTypes = {
	isContentAnalysisActive: PropTypes.bool,
	isKeywordAnalysisActive: PropTypes.bool,
};
