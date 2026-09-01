import ChevronRightIcon from "@heroicons/react/solid/ChevronRightIcon";
import classNames from "classnames";
import React from "react";
import { useSvgAria } from "../../hooks";

/**
 * A single selectable tab whose selection drives a content area shown elsewhere on the page.
 * Fully agnostic about its content: renders whatever `children` the caller passes,
 * and only owns the tab's own background, hover/selected state, and the trailing chevron.
 * Stacking several of these (in a plain `<ul>`, `<div>`, or any other wrapping
 * element) forms a list on its own. No dedicated list wrapper component is needed.
 *
 * The wrapping button carries `aria-current` and a `group` class, so content that must recolor on
 * selection (e.g. the title) can target it with a `group-aria-[current=true]:` variant.
 *
 * @param {JSX.ElementClass} [as="li"] The wrapping element.
 * @param {string} [id] The id for the tab's button, e.g. to target this tab from a consumer via `aria-controls` or a fragment link.
 * @param {React.ReactNode} children The tab's content.
 * @param {boolean} [isSelected=false] Whether this tab is the active/selected one.
 * @param {boolean} [disabled=false] Whether the tab is disabled.
 * @param {Function} onClick Called when the tab is activated.
 * @param {string} [className=""] Extra class name for the wrapping element.
 * @param {...any} [props] Extra props, spread onto the button.
 *
 * @returns {JSX.Element} The tab.
 */
const ContentTabs = ( {
	as: Component = "li",
	id,
	children,
	isSelected = false,
	disabled = false,
	onClick,
	className = "",
	...props
} ) => {
	const svgAriaProps = useSvgAria();

	return (
		<Component className={ classNames( "yst-content-tabs", className ) }>
			<button
				id={ id }
				type="button"
				disabled={ disabled }
				onClick={ onClick }
				aria-current={ isSelected }
				className={ classNames(
					"yst-content-tabs__button yst-group",
					isSelected && "yst-content-tabs__button--selected",
				) }
				{ ...props }
			>
				<span className="yst-content-tabs__content">{ children }</span>
				<ChevronRightIcon className="yst-content-tabs__icon" { ...svgAriaProps } />
			</button>
		</Component>
	);
};

ContentTabs.displayName = "ContentTabs";

export default ContentTabs;
