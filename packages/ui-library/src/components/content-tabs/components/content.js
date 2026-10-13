import classNames from "classnames";
import React from "react";

/**
 * Container for `ContentTabs.Panel` elements. Stacks all panels in the same grid cell so they
 * overlay each other, enabling cross-fade transitions without layout shifts.
 *
 * @param {React.ReactNode} children The `ContentTabs.Panel` elements.
 * @param {string} [className=""] Extra class name for the wrapping element.
 * @param {...any} [props] Extra props, spread onto the wrapping element.
 *
 * @returns {JSX.Element} The content container.
 */
export const Content = ( { children, className = "", ...props } ) => (
	<div className={ classNames( "yst-content-tabs__content", className ) } { ...props }>
		{ children }
	</div>
);

Content.displayName = "ContentTabs.Content";
