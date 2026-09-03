import ChevronRightIcon from "@heroicons/react/solid/ChevronRightIcon";
import classNames from "classnames";
import React, { useCallback } from "react";
import { useSvgAria } from "../../../hooks";
import { useContentTabsContext } from "../context";

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
	const { activeTab, onTabSelect } = useContentTabsContext();

	const resolvedIsSelected = isSelected ?? ( id === activeTab );
	const handleClick = useCallback( ( event ) => {
		onTabSelect( id );
		onClick?.( event );
	}, [ onTabSelect, id, onClick ] );

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
				onClick={ handleClick }
			>
				<span className="yst-content-tabs__label">{ children }</span>
				<ChevronRightIcon className="yst-content-tabs__icon" { ...svgAriaProps } />
			</button>
		</li>
	);
};

TabButton.displayName = "ContentTabs.TabButton";
