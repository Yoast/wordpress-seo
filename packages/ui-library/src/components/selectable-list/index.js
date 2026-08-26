import classNames from "classnames";
import React from "react";
import { Item } from "./item";

/**
 * A vertical list of selectable rows — e.g. a product picker whose selection drives a detail panel
 * shown elsewhere on the page.
 *
 * Agnostic about what each row renders; see `SelectableList.Item`.
 *
 * @param {JSX.ElementClass} [as="ul"] The element to render as.
 * @param {React.ReactNode} [children=null] The list's `SelectableList.Item`s.
 * @param {string} [className=""] Extra class name.
 * @param {...any} [props] Extra props, e.g. `aria-label`.
 *
 * @returns {JSX.Element} The list.
 */
const SelectableList = ( { as: Component = "ul", children = null, className = "", ...props } ) => (
	<Component role="list" className={ classNames( "yst-selectable-list", className ) } { ...props }>
		{ children }
	</Component>
);

SelectableList.displayName = "SelectableList";

SelectableList.Item = Item;
SelectableList.Item.displayName = "SelectableList.Item";

export default SelectableList;
