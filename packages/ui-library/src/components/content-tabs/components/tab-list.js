import React from "react";
import classNames from "classnames";

/**
 * A list wrapper for `ContentTabs.TabButton`s.
 *
 * @param {React.ReactNode} children       The tab buttons.
 * @param {string}          [className=""] Extra class name for the wrapping element.
 * @param {...any}          [props]        Extra props, spread onto the wrapping element.
 *
 * @returns {JSX.Element} The list.
 */
export const TabList = ( { children, className = "", ...props } ) => (
	<ul className={ classNames( "yst-content-tabs__tab-list", className ) } { ...props }>
		{ children }
	</ul>
);
