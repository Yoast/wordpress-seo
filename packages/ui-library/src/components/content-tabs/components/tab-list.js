import React from "react";
import classNames from "classnames";
import { useContentTabsContext } from "../context";

/**
 * A list wrapper for `ContentTabs.TabButton`s.
 *
 * @param {React.ReactNode} children       The tab buttons.
 * @param {string}          [className=""] Extra class name for the wrapping element.
 * @param {...any}          [props]        Extra props, spread onto the wrapping element.
 *
 * @returns {JSX.Element} The list.
 */
export const TabList = ( { children, className = "", ...props } ) => {
	// From its own `ContentTabs`, so a nested `ContentTabs` that is not an accordion is not styled as one.
	const { isAccordion } = useContentTabsContext();

	return (
		<ul
			className={ classNames( "yst-content-tabs__tab-list", { "yst-content-tabs__tab-list--accordion": isAccordion }, className ) }
			{ ...props }
		>
			{ children }
		</ul>
	);
};
