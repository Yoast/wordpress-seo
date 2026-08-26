import ChevronRightIcon from "@heroicons/react/solid/ChevronRightIcon";
import classNames from "classnames";
import React from "react";
import { useSvgAria } from "../../hooks";

/**
 * A single row within a `SelectableList`.
 *
 * Fully agnostic about its content: renders whatever `children` the caller passes, and only owns
 * the row's own background, hover/selected state, and the chevron icon. The wrapping
 * button carries `aria-current` and a `group` class, so content that must recolor on selection
 * (e.g. the title) can target it with a `group-aria-[current=true]:` variant.
 *
 * @param {JSX.ElementClass} [as="li"] The wrapping list-item element.
 * @param {string} [id] The id for the row's button, e.g. to target this row from a consumer via `aria-controls` or a fragment link.
 * @param {React.ReactNode} children The row's content.
 * @param {boolean} [isSelected=false] Whether this row is the active/selected one.
 * @param {boolean} [disabled=false] Whether the row is disabled.
 * @param {Function} onClick Called when the row is activated.
 * @param {string} [className=""] Extra class name for the wrapping list-item element.
 * @param {...any} [props] Extra props, spread onto the button.
 *
 * @returns {JSX.Element} The row.
 */
export const Item = ( {
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
		<Component className={ classNames( "yst-selectable-list__item", className ) }>
			<button
				id={ id }
				type="button"
				disabled={ disabled }
				onClick={ onClick }
				aria-current={ isSelected }
				className={ classNames(
					"yst-selectable-list__item-button yst-group",
					isSelected && "yst-selectable-list__item-button--selected",
				) }
				{ ...props }
			>
				<span className="yst-selectable-list__item-content">{ children }</span>
				<ChevronRightIcon className="yst-selectable-list__item-icon" { ...svgAriaProps } />
			</button>
		</Component>
	);
};

Item.displayName = "SelectableList.Item";
