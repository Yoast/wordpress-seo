import ChevronRightIcon from "@heroicons/react/solid/ChevronRightIcon";
import classNames from "classnames";
import React, { useId } from "react";
import { useSvgAria } from "../../../hooks";
import { useContentTabsContext } from "../context";

/**
 * A single tab button within `ContentTabs`. Fully agnostic about its content: renders whatever
 * `children` the caller passes, and only owns the button's own background, hover/selected state,
 * and the trailing chevron. Stacking several of these (in a plain `<ul>`, `<div>`, or any other
 * wrapping element) forms a list on its own — no dedicated list-wrapper element is needed for that
 * part. If wrapping in a `<ul>`, add `role="list"` to it: this component resets its own
 * `list-style`.
 *
 * Reads `activeTab`/`onTabSelect` from `ContentTabs`'s context, so `isSelected`/`onClick` can be
 * omitted when nested inside one. Passing them explicitly still works and takes priority — e.g. for
 * standalone usage outside a `ContentTabs` wrapper.
 *
 * `id` doubles as this tab's identity in context (`activeTab === id`). When omitted, a stable id is
 * generated via `useId()` so two unlabelled tab buttons can never collide and resolve as selected together.
 *
 * The wrapping button carries `aria-current` and a `group` class, so content that must recolor on
 * selection (e.g. the title) can target it with a `group-aria-[current=true]:` variant.
 *
 * @param {string} [id] This tab's identity and DOM id, e.g. to target it from a consumer via `aria-controls`. Auto-generated when omitted.
 * @param {React.ReactNode} children The tab button's content.
 * @param {boolean} [isSelected] Whether this tab is the active/selected one. Derived from `ContentTabs` context when omitted.
 * @param {boolean} [disabled=false] Whether the tab button is disabled.
 * @param {Function} [onClick] Called when the tab is activated. Derived from `ContentTabs` context when omitted.
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
	const generatedId = useId();
	const tabId = id ?? generatedId;
	const { activeTab, onTabSelect } = useContentTabsContext();

	const resolvedIsSelected = isSelected ?? ( tabId === activeTab );
	const handleClick = onClick ?? ( () => onTabSelect( tabId ) );

	return (
		<li className={ classNames( "yst-content-tabs__tab", className ) }>
			<button
				id={ tabId }
				type="button"
				disabled={ disabled }
				onClick={ handleClick }
				aria-current={ resolvedIsSelected }
				className={ classNames(
					"yst-content-tabs__button yst-group",
					resolvedIsSelected && "yst-content-tabs__button--selected",
					className,
				) }
				{ ...props }
			>
				<span className="yst-content-tabs__label">{ children }</span>
				<ChevronRightIcon className="yst-content-tabs__icon" { ...svgAriaProps } />
			</button>
		</li>
	);
};

TabButton.displayName = "ContentTabs.TabButton";
