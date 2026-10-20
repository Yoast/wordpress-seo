import classNames from "classnames";
import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useIsNarrowerThan } from "../../hooks";
import { ContentTabsContext, PanelSlotContext } from "./context";
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
 * collapses it. A collapsed panel is only hidden, so its state survives a collapse; pass `keepMounted={ false }` to
 * unmount it instead.
 * Crossing the breakpoint moves the panel, which remounts it. With `accordionBreakpoint`, a component passed as `as`
 * receives the ref that measures it, so it must forward it to its element.
 *
 * @param {React.ReactNode} children The tab buttons and the content area — `ContentTabs.TabButton`/`ContentTabs.Panel`, or any other markup.
 * @param {string|null} [activeTab] The id of the active tab (controlled mode).
 * @param {string} [defaultActiveTab=null] The id of the initially active tab (uncontrolled mode).
 * @param {Function} [onTabChange] Called with the tab id when a tab is activated.
 * @param {number} [accordionBreakpoint] The width in pixels of the wrapping element below which the tabs are an accordion.
 * @param {boolean} [keepMounted=true] Whether a collapsed accordion panel stays mounted (hidden) instead of unmounting.
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
	keepMounted = true,
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
	// The element below the active accordion tab's button that its panel renders into: `{ tabId, element }`.
	const [ panelSlot, setPanelSlot ] = useState( null );

	// A tab that becomes active opens, also when that is not from a click (like a controlled change), and so does the
	// active tab when the accordion takes over. A layout effect, so a stale collapsed state never paints.
	useLayoutEffect( () => {
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

	// Only clears the slot if it is still this tab's: the next tab's slot can register first.
	const registerPanelSlot = useCallback( ( tabId, element ) => {
		setPanelSlot( ( slot ) => {
			if ( element ) {
				return slot?.tabId === tabId && slot.element === element ? slot : { tabId, element };
			}
			return slot?.tabId === tabId ? null : slot;
		} );
	}, [] );

	const contextValue = useMemo(
		() => ( {
			activeTab: resolvedActiveTab,
			onTabSelect: handleTabSelect,
			isAccordion,
			isExpanded,
			keepMounted,
			registerPanelSlot,
		} ),
		[ resolvedActiveTab, handleTabSelect, isAccordion, isExpanded, keepMounted, registerPanelSlot ],
	);

	// The slot is in its own context, which only panels read: a slot change does not re-render every tab button.
	return (
		<ContentTabsContext.Provider value={ contextValue }>
			<PanelSlotContext.Provider value={ panelSlot }>
				<Component
					ref={ accordionBreakpoint ? rootRef : null }
					className={ classNames( "yst-content-tabs", { "yst-content-tabs--accordion": isAccordion }, className ) }
					{ ...props }
				>
					{ children }
				</Component>
			</PanelSlotContext.Provider>
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
