import classNames from "classnames";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useIsNarrowerThan } from "../../hooks";
import { ContentTabsContext } from "./context";
import { TabButton, Panel, TabList, Content } from "./components";

/**
 * A group of tabs whose active one drives a content area (`ContentTabs.Panel`), shown wherever the
 * consumer puts it in the tree — not necessarily right next to the tabs. `ContentTabs` only owns
 * the active-tab state; content stays fully agnostic: `ContentTabs.TabButton` and `ContentTabs.Panel`
 * render whatever `children` you give them. `ContentTabs.TabButton` also works standalone (outside
 * this wrapper) by passing `isSelected`/`onClick` directly, while`ContentTabs.Panel` is always driven by
 * matching its `tabId` against the active tab in context.
 *
 * Controlled: pass `activeTab` and update it yourself via `onTabChange`.
 * Uncontrolled: pass `defaultActiveTab` (or nothing) and let `ContentTabs` manage its own state.
 *
 * Accordion: pass `accordionBreakpoint` to turn the tabs into an accordion when the wrapping element is narrower
 * than that given width. The active tab's panel then opens right below its button, and clicking the open tab again
 * collapses it. Pass `keepMounted` to only hide a collapsed panel, so its state
 * survives a collapse. Crossing the breakpoint moves the panel, which remounts it.
 *
 * @param {React.ReactNode} children The tab buttons and the content area — `ContentTabs.TabButton`/`ContentTabs.Panel`, or any other markup.
 * @param {string|null} [activeTab] The id of the active tab (controlled mode).
 * @param {string} [defaultActiveTab=null] The id of the initially active tab (uncontrolled mode).
 * @param {Function} [onTabChange] Called with the tab id when a tab is activated.
 * @param {number} [accordionBreakpoint] The width in pixels of the wrapping element below which the tabs are an accordion.
 * @param {boolean} [keepMounted=false] Whether a collapsed accordion panel stays mounted (hidden) instead of unmounting.
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
	accordionBreakpoint,
	keepMounted = false,
	as: Component = "div",
	className = "",
	...props
} ) => {
	const [ internalActiveTab, setInternalActiveTab ] = useState( defaultActiveTab );
	const isControlled = typeof activeTab !== "undefined";
	const resolvedActiveTab = isControlled ? activeTab : internalActiveTab;

	const [ rootRef, isAccordion ] = useIsNarrowerThan( accordionBreakpoint );
	// Whether the active tab is open in the accordion.
	const [ isExpanded, setIsExpanded ] = useState( true );
	// The element below each accordion tab button that its panel renders into, by tab id.
	const [ panelSlots, setPanelSlots ] = useState( {} );

	useEffect( () => {
		setIsExpanded( true );
	}, [ resolvedActiveTab, isAccordion ] );

	const handleTabSelect = useCallback( ( tabId ) => {
		if ( isAccordion && tabId === resolvedActiveTab ) {
			setIsExpanded( ( expanded ) => ! expanded );
			return;
		}
		setIsExpanded( true );
		if ( ! isControlled ) {
			setInternalActiveTab( tabId );
		}
		onTabChange?.( tabId );
	}, [ isAccordion, resolvedActiveTab, isControlled, onTabChange ] );

	const registerPanelSlot = useCallback( ( tabId, element ) => {
		setPanelSlots( ( slots ) => {
			if ( ( slots[ tabId ] ?? null ) === element ) {
				return slots;
			}
			const next = { ...slots };
			if ( element ) {
				next[ tabId ] = element;
			} else {
				delete next[ tabId ];
			}
			return next;
		} );
	}, [] );

	const contextValue = useMemo(
		() => ( {
			activeTab: resolvedActiveTab,
			onTabSelect: handleTabSelect,
			isAccordion,
			isExpanded,
			keepMounted,
			panelSlots,
			registerPanelSlot,
		} ),
		[ resolvedActiveTab, handleTabSelect, isAccordion, isExpanded, keepMounted, panelSlots, registerPanelSlot ],
	);

	return (
		<ContentTabsContext.Provider value={ contextValue }>
			<Component
				ref={ accordionBreakpoint ? rootRef : null }
				className={ classNames( "yst-content-tabs", isAccordion && "yst-content-tabs--accordion", className ) }
				{ ...props }
			>
				{ children }
			</Component>
		</ContentTabsContext.Provider>
	);
};

ContentTabs.displayName = "ContentTabs";
ContentTabs.TabButton = TabButton;
ContentTabs.TabButton.displayName = "ContentTabs.TabButton";
ContentTabs.Panel = Panel;
ContentTabs.Panel.displayName = "ContentTabs.Panel";
ContentTabs.TabList = TabList;
ContentTabs.TabList.displayName = "ContentTabs.TabList";
ContentTabs.Content = Content;
ContentTabs.Content.displayName = "ContentTabs.Content";

export { useContentTabsContext } from "./context";
export default ContentTabs;
