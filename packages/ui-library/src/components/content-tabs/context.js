import { createContext, useContext } from "react";

/**
 * The default context value: no tab selected, selecting one is a no-op. Applies when a `TabButton`
 * or `Panel` is used standalone, outside a `ContentTabs` wrapper — `isSelected`/`onClick` passed
 * directly to `TabButton` still take priority over this.
 */
export const ContentTabsContext = createContext( {
	activeTab: null,
	onTabSelect: () => {},
} );

/**
 * @returns {{activeTab: ?string, onTabSelect: Function}} The active tab's id, and the callback to activate another one.
 */
export const useContentTabsContext = () => useContext( ContentTabsContext );
