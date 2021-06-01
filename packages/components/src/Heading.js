import React from "react";
import PropTypes from "prop-types";

/**
 * Creates a Heading component.
 *
 * @param {Object} props The props to use.
 * @returns {ReactElement} The rendered component.
 */
const Heading = ( props ) => {
	const HeadingLevel = `h${ props.level }`;

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

Heading.defaultProps = {
	level: 1,
};

export default Heading;
