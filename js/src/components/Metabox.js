/* global wp */

import React from "react";
import PropTypes from "prop-types";
import { Provider as StoreProvider } from "react-redux";
import { ThemeProvider } from "styled-components";

import SidebarItem from "./SidebarItem";
import SnippetEditor from "../containers/SnippetEditor";
import ReadabilityAnalysis from "./contentAnalysis/ReadabilityAnalysis";

/**
 * Creates the Metabox component.
 *
 * @param {bool}   isContentAnalysisActive Whether or not the readability analysis is active.
 * @param {bool}   isKeywordAnalysisActive Whether or not the SEO analysis is active.
 * @param {Object} store                   The Redux store.
 * @param {Object} theme                   The theme to use.
 *
 * @returns {ReactElement} The Metabox component.
 */
export default function Metabox( { isContentAnalysisActive, isKeywordAnalysisActive, store, theme } ) {
	const { Fill } = wp.components;

	return (
		<Fill name="YoastMetabox">
			<StoreProvider store={ store }>
				<SidebarItem renderPriority={ 9 }>
					<ThemeProvider theme={ theme }>
						<SnippetEditor />
					</ThemeProvider>
				</SidebarItem>
			</StoreProvider>
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
	theme: PropTypes.object,
	store: PropTypes.object,
};
