/* global wp */

import React from "react";
import PropTypes from "prop-types";
import { Provider as StoreProvider } from "react-redux";

import SidebarItem from "./SidebarItem";
import ReadabilityAnalysis from "./contentAnalysis/ReadabilityAnalysis";
import CollapsibleCornerstone from "../containers/CollapsibleCornerstone";

/**
 * Creates the Metabox component.
 *
 * @param {bool}   isContentAnalysisActive Whether or not the readability analysis is active.
 * @param {bool}   isKeywordAnalysisActive Whether or not the SEO analysis is active.
 * @param {Object} store                   The Redux store.
 *
 * @returns {ReactElement} The Metabox component.
 */
export default function Metabox( { isContentAnalysisActive, isKeywordAnalysisActive, isCornerstoneActive, isCornerstone, store } ) {
	const { Fill } = wp.components;

	return (
		<Fill name="YoastMetabox">
			{ isContentAnalysisActive && <SidebarItem renderPriority={ 10 }>
				<StoreProvider store={ store } >
					<ReadabilityAnalysis />
				</StoreProvider>
			</SidebarItem> }
			{ isKeywordAnalysisActive && <SidebarItem renderPriority={ 20 }>SEO analysis</SidebarItem> }
			{ isCornerstoneActive && <SidebarItem renderPriority={ 30 }>
				<StoreProvider store={ store }>
					<CollapsibleCornerstone isCornerstone={ isCornerstone }/>
				</StoreProvider>
			</SidebarItem>
			}
		</Fill>
	);
}

Metabox.propTypes = {
	isContentAnalysisActive: PropTypes.bool,
	isKeywordAnalysisActive: PropTypes.bool,
	isCornerstoneActive: PropTypes.bool,
	isCornerstone: PropTypes.bool,
	store: PropTypes.object,
};
