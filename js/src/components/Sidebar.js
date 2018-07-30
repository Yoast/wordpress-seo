/* global wp */

import React from "react";
import PropTypes from "prop-types";
import { Provider as StoreProvider } from "react-redux";

import SidebarItem from "./SidebarItem";
import CollapsibleCornerstone from "../containers/CollapsibleCornerstone";

/**
 * Creates the Sidebar component.
 *
 * @param {bool} isContentAnalysisActive Whether or not the readability analysis is active or not.
 * @param {bool} isKeywordAnalysisActive Whether or not the readability analysis is active or not.
 * @param {bool} isCornerstoneActive     Whether or not the cornerstone content feature is active or not.
 * @param {bool} isCornerstone           Whether or not the cornerstone content checkbox is checked or not.
 * @param {Object} store                 The store.
 *
 * @returns {ReactElement} The Sidebar component.
 *
 * @constructor
 */
export default function Sidebar( { isContentAnalysisActive, isKeywordAnalysisActive, isCornerstoneActive, isCornerstone, store  } ) {
	const { Fill } = wp.components;

	return (
		<Fill name="YoastSidebar">
			{ isContentAnalysisActive && <SidebarItem renderPriority={ 10 }>Readability analysis</SidebarItem> }
			{ isKeywordAnalysisActive && <SidebarItem renderPriority={ 20 }>SEO analysis</SidebarItem> }
			{ isCornerstoneActive && <SidebarItem renderPriority={30}>
				<StoreProvider store={store}>
					<CollapsibleCornerstone isCornerstone={isCornerstone}/>
				</StoreProvider>
			</SidebarItem>
			}
		</Fill>
	);
}

Sidebar.propTypes = {
	isContentAnalysisActive: PropTypes.bool,
	isKeywordAnalysisActive: PropTypes.bool,
};
