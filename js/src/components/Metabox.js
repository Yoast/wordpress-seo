import React from "react";
import PropTypes from "prop-types";
import { Provider as StoreProvider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { Fragment } from "@wordpress/element";
import { Fill } from "@wordpress/components";
import { __ } from "@wordpress/i18n";


import SidebarItem from "./SidebarItem";
import SnippetEditor from "../containers/SnippetEditor";
import SeoAnalysis from "./contentAnalysis/SeoAnalysis";
import ReadabilityAnalysis from "./contentAnalysis/ReadabilityAnalysis";
import CollapsibleCornerstone from "../containers/CollapsibleCornerstone";
import Collapsible from "./SidebarCollapsible";
import { LocationProvider } from "../components/contexts/location";

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
				<LocationProvider value="metabox">
					<SidebarItem renderPriority={ 9 }>
						<ThemeProvider theme={ theme }>
							<StoreProvider store={ store }>
								<Collapsible
									id={ "yoast-snippet-editor-metabox" }
									title={ __( "Snippet Preview", "wordpress-seo" ) } initialIsOpen={ true }
								>
									<SnippetEditor hasPaperStyle={ false } />
								</Collapsible>
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
									location="metabox"
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
				</LocationProvider>
			</Fill>
		</Fragment>
	);
}

Metabox.propTypes = {
	settings: PropTypes.object,
	store: PropTypes.object,
	theme: PropTypes.object,
};
