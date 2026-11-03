import React from "react";
import PropTypes from "prop-types";

/**
 * Creates a Heading component.
 *
 * @param {Object} props The props to use.
 * @returns {ReactElement} The rendered component.
 */
const Heading = ( { level = 1, ...props } ) => {
	const HeadingLevel = `h${ level }`;

	return (
		<HeadingLevel className={ props.className }>
			{ props.children }
		</HeadingLevel>
	);
};

Heading.propTypes = {
	level: PropTypes.number,
	className: PropTypes.string,
	children: PropTypes.any,
};

export default Heading;
