import classNames from "classnames";
import React from "react";

/**
 * A horizontal line.
 *
 * @param {string} [className] The HTML class.
 * @returns {JSX.Element} The horizontal line.
 */
const HorizontalLine = ( { className = "", ...props } ) => (
	<hr className={ classNames( "yst-border-0 yst-border-t yst-border-slate-200", className ) } { ...props } />
);

HorizontalLine.displayName = "HorizontalLine";

/**
 * @param {React.ReactNode} [children] Optional content centered on the line, e.g. a label or a toggle button.
 * @param {string} [className] The HTML class.
 * @returns {JSX.Element} The divider.
 */
const Divider = ( {
	children = null,
	className = "",
	...props
} ) => {
	// Without content the divider is a single horizontal line, acting as a `separator`.
	if ( ! children ) {
		return <HorizontalLine className={ className } { ...props } />;
	}

	// With content the line is split so the children sit centered between the two halves.
	return (
		<div className={ classNames( "yst-flex yst-items-center", className ) } { ...props }>
			<HorizontalLine className="yst-grow" />
			{ children }
			<HorizontalLine className="yst-grow" />
		</div>
	);
};

Divider.displayName = "Divider";

export default Divider;
