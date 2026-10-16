import { createContext, useContext } from "react";

/**
 * Gets the id of the element an accordion tab's panel renders into, which its button controls.
 *
 * @param {string} tabId The tab id.
 *
 * @returns {string} The id.
 */
export const getAccordionPanelId = ( tabId ) => `${ tabId }-accordion-panel`;

/**
 * The default context value: no tab selected, selecting one is a no-op. Applies when a `TabButton`
 * or `Panel` is used standalone, outside a `ContentTabs` wrapper — `isSelected`/`onClick` passed
 * directly to `TabButton` still take priority over this.
 */
export const ContentTabsContext = createContext( {
	activeTab: null,
	onTabSelect: () => {},
	isAccordion: false,
	isExpanded: true,
	keepMounted: false,
	panelSlots: {},
	registerPanelSlot: () => {},
} );

/**
 * @returns {{activeTab: ?string, onTabSelect: Function, isAccordion: boolean, isExpanded: boolean, keepMounted: boolean,
 *   panelSlots: Object<string, HTMLElement>, registerPanelSlot: Function}} The active tab's id, the callback to activate
 *   another one, whether the tabs are an accordion and its active tab is open, whether a collapsed panel stays mounted,
 *   and the elements the accordion panels render into.
 */
export const useContentTabsContext = () => useContext( ContentTabsContext );
