import React from "react";
import PropTypes from "prop-types";

import SidebarItem from "./SidebarItem";

/**
 * Creates the Sidebar component.
 *
 * @param {bool} isContentAnalysisActive Whether or not the readability analysis is active or not.
 * @param {bool} isKeywordAnalysisActive Whether or not the readability analysis is active or not.
 *
 * @return {ReactElement} The Sidebar component.
 *
 * @constructor
 */
export default function Sidebar( { isContentAnalysisActive, isKeywordAnalysisActive } ) {
	const { Fill } = wp.components;

	return (
		<Fill name="YoastSidebar">
			{ isContentAnalysisActive && <SidebarItem renderPriority={ 10 }>Readability analysis</SidebarItem> }
			{ isKeywordAnalysisActive && <SidebarItem renderPriority={ 20 }>SEO analysis</SidebarItem> }
		</Fill>
	)
};

Sidebar.propTypes = {
	isContentAnalysisActive: PropTypes.bool,
	isKeywordAnalysisActive: PropTypes.bool,
};
