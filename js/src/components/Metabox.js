/* global wp */

import React from "react";
import PropTypes from "prop-types";
import { Provider as StoreProvider } from "react-redux";

import SidebarItem from "./SidebarItem";
import ReadabilityAnalysis from "./contentAnalysis/ReadabilityAnalysis";

/**
 * Creates the Metabox component.
 *
 * @param {bool}   isContentAnalysisActive Whether or not the readability analysis is active.
 * @param {bool}   isKeywordAnalysisActive Whether or not the SEO analysis is active.
 * @param {Object} store                   The Redux store.
 *
 * @returns {ReactElement} The Metabox component.
 */
export default function Metabox( { isContentAnalysisActive, isKeywordAnalysisActive, store } ) {
	const { Fill } = wp.components;

	return (
		<Fill name="YoastMetabox">
			{ isContentAnalysisActive && <SidebarItem renderPriority={ 10 }>
				<StoreProvider store={ store } >
					<ReadabilityAnalysis />
				</StoreProvider>
			</SidebarItem> }
			{ isKeywordAnalysisActive && <SidebarItem renderPriority={ 20 }>SEO analysis</SidebarItem> }
		</Fill>
	);
}

Metabox.propTypes = {
	isContentAnalysisActive: PropTypes.bool,
	isKeywordAnalysisActive: PropTypes.bool,
	store: PropTypes.object,
};
