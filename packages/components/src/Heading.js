import React from "react";

/**
 * Creates a Heading component.
 *
 * @param {Object} props The props to use.
 * @param {number} [props.level=1] The heading level.
 * @param {string} [props.className] The class name of the heading.
 * @param {*} [props.children] The content of the heading.
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

export default Heading;
