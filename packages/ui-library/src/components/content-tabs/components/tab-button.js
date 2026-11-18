import ChevronDownIcon from "@heroicons/react/outline/ChevronDownIcon";
import ChevronRightIcon from "@heroicons/react/outline/ChevronRightIcon";
import classNames from "classnames";
import React, { useCallback } from "react";
import { useSvgAria } from "../../../hooks";
import { getAccordionPanelId, useContentTabsContext } from "../context";

/**
 * Gets the accordion attributes of a tab button: `aria-expanded` in an accordion, and `aria-controls` when its panel
 * renders below it.
 *
 * @param {string}  id           The tab id.
 * @param {boolean} isAccordion  Whether the tabs are an accordion.
 * @param {boolean} hasPanelSlot Whether the tab's panel renders below its button.
 * @param {boolean} isOpen       Whether the tab is open.
 *
 * @returns {Object} The attributes.
 */
const getAccordionButtonProps = ( id, isAccordion, hasPanelSlot, isOpen ) => ( {
	...( isAccordion && { "aria-expanded": isOpen } ),
	...( hasPanelSlot && { "aria-controls": getAccordionPanelId( id ) } ),
} );

/**
 * A single tab button within `ContentTabs`. Renders an `<li>` and is meant to be used inside
 * `ContentTabs.TabList`. Fully agnostic about its content: renders whatever `children` the caller
 * passes, and only owns the button's own background, hover/selected state, and the trailing chevron.
 *
 * Reads `activeTab`/`onTabSelect` from `ContentTabs`'s context automatically. `isSelected` can be
 * passed explicitly to override the context-derived value. `onClick` is called in addition to the
 * context's `onTabSelect`, not instead of it.
 *
 * `id` is required — it is matched against `ContentTabs.Panel`'s `tabId` to determine which panel
 * to show.
 *
 * The wrapping button carries `aria-current` and a `group` class, so content that must recolor on
 * selection (e.g. the title) can target it with a `group-aria-[current=true]:` variant.
 *
 * In an accordion layout, the button carries `aria-expanded`, its chevron points down/up,
 * and the active tab's panel renders right below it, in the element it carries `aria-controls`.
 * Activating a tab there also scrolls its button into view, as the panel collapsing above it can move it.
 *
 * @param {string} id This tab's identity and DOM id. Must match the `tabId` of the corresponding `ContentTabs.Panel`.
 * @param {React.ReactNode} children The tab button's content.
 * @param {boolean} [isSelected] Whether this tab is the active/selected one. Derived from `ContentTabs` context when omitted.
 * @param {boolean} [disabled=false] Whether the tab button is disabled.
 * @param {Function} [onClick] Called in addition to the context's `onTabSelect` when the tab is activated.
 * @param {string} [className=""] Extra class name for the wrapping element.
 * @param {...any} [props] Extra props, spread onto the button.
 *
 * @returns {JSX.Element} The tab button.
 */
export const TabButton = ( {
	id,
	children,
	isSelected,
	disabled = false,
	onClick,
	className = "",
	...props
} ) => {
	const svgAriaProps = useSvgAria();
	const { activeTab, onTabSelect, isAccordion, isExpanded, registerPanelSlot } = useContentTabsContext();
	const hasPanelSlot = isAccordion && id === activeTab;
	const isOpen = hasPanelSlot && isExpanded;
	const panelSlotRef = useCallback( ( element ) => registerPanelSlot( id, element ), [ registerPanelSlot, id ] );
	const buttonProps = getAccordionButtonProps( id, isAccordion, hasPanelSlot, isOpen );

	const resolvedIsSelected = isSelected ?? ( id === activeTab );
	const [ Icon, iconClassName ] = isAccordion
		? [ ChevronDownIcon, "yst-content-tabs__accordion-icon" ]
		: [ ChevronRightIcon, "yst-content-tabs__icon" ];

	const handleClick = useCallback( ( event ) => {
		onTabSelect( id );
		onClick?.( event );
		if ( isAccordion ) {
			const button = event.currentTarget;
			window.requestAnimationFrame( () => button.scrollIntoView?.( { block: "nearest" } ) );
		}
	}, [ onTabSelect, id, onClick, isAccordion ] );

	return (
		<li className={ classNames( "yst-content-tabs__tab", className ) }>
			<button
				id={ id }
				type="button"
				disabled={ disabled }
				aria-current={ resolvedIsSelected }
				className={ classNames(
					"yst-content-tabs__button yst-group",
					resolvedIsSelected && "yst-content-tabs__button--selected",
				) }
				{ ...props }
				{ ...buttonProps }
				onClick={ handleClick }
			>
				<span className="yst-content-tabs__label">{ children }</span>
				<Icon className={ iconClassName } { ...svgAriaProps } />
			</button>
			{ hasPanelSlot && (
				<div
					id={ getAccordionPanelId( id ) }
					ref={ panelSlotRef }
					className="yst-content-tabs__accordion-panel"
					hidden={ ! isOpen }
				/>
			) }
		</li>
	);
};

TabButton.displayName = "ContentTabs.TabButton";
