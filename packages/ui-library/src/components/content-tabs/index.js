import classNames from "classnames";
import React, { useCallback, useMemo, useState } from "react";
import { ContentTabsContext } from "./context";
import TabButton from "./tab-button";
import Panel from "./panel";

/**
 * A group of tabs whose active one drives a content area (`ContentTabs.Panel`), shown wherever the
 * consumer puts it in the tree — not necessarily right next to the tabs. `ContentTabs` only owns
 * the active-tab state; content stays fully agnostic: `ContentTabs.TabButton` and `ContentTabs.Panel`
 * render whatever `children` you give them, and both also work standalone (outside this wrapper)
 * by passing `isSelected`/`onClick` directly.
 *
 * Controlled: pass `activeTab` and update it yourself via `onTabChange`.
 * Uncontrolled: pass `defaultActiveTab` (or nothing) and let `ContentTabs` manage its own state.
 *
 * @param {React.ReactNode} children The tab buttons and the content area — `ContentTabs.TabButton`/`ContentTabs.Panel`, or any other markup.
 * @param {string|null} [activeTab] The id of the active tab (controlled mode).
 * @param {string} [defaultActiveTab=null] The id of the initially active tab (uncontrolled mode).
 * @param {Function} [onTabChange] Called with the tab id when a tab is activated.
 * @param {string|Function} [as="div"] The wrapping element.
 * @param {string} [className=""] Extra class name for the wrapping element.
 * @param {...any} [props] Extra props, spread onto the wrapping element.
 *
 * @returns {JSX.Element} The tabs group.
 */
const ContentTabs = ( {
	children,
	activeTab,
	defaultActiveTab = null,
	onTabChange,
	as: Component = "div",
	className = "",
	...props
} ) => {
	const [ internalActiveTab, setInternalActiveTab ] = useState( defaultActiveTab );
	const isControlled = typeof activeTab !== "undefined";
	const resolvedActiveTab = isControlled ? activeTab : internalActiveTab;

	const handleTabSelect = useCallback( ( tabId ) => {
		if ( ! isControlled ) {
			setInternalActiveTab( tabId );
		}
		onTabChange?.( tabId );
	}, [ isControlled, onTabChange ] );

	const contextValue = useMemo(
		() => ( { activeTab: resolvedActiveTab, onTabSelect: handleTabSelect } ),
		[ resolvedActiveTab, handleTabSelect ],
	);

	return (
		<ContentTabsContext.Provider value={ contextValue }>
			<Component className={ classNames( "yst-content-tabs", className ) } { ...props }>
				{ children }
			</Component>
		</ContentTabsContext.Provider>
	);
};

ContentTabs.displayName = "ContentTabs";
ContentTabs.TabButton = TabButton;
ContentTabs.Panel = Panel;

export { useContentTabsContext } from "./context";
export default ContentTabs;
