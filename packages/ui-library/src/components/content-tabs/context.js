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
	keepMounted: true,
	registerPanelSlot: () => {},
} );

/**
 * The element below the active accordion tab's button that its panel renders into, as `{ tabId, element }`, or null.
 * In its own context so a change only re-renders the panels.
 */
export const PanelSlotContext = createContext( null );

/**
 * @returns {{activeTab: ?string, onTabSelect: Function, isAccordion: boolean, isExpanded: boolean, keepMounted: boolean,
 *   registerPanelSlot: Function}} The active tab's id, the callback to activate another one, whether the tabs are an
 *   accordion and its active tab is open, whether a collapsed panel stays mounted, and the callback that registers
 *   the element an accordion panel renders into.
 */
export const useContentTabsContext = () => useContext( ContentTabsContext );
