import React from "react";
import PropTypes from "prop-types";

/**
 * Represents the section HTML element.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX} A representation of the section HTML element based on the passed props.
 * @constructor
 */
const Section = ( props ) => {
	const Heading = `h${props.level}`;

	return (
		<section className={props.className}>
			<Heading className={props.headingClassName}>{props.headingText}</Heading>
			{props.children}
		</section>
	);
};

/**
 * Adds validation for the properties.
 *
 * @type {{level: number, headingText: string, headingClassName: string}}
 */
Section.propTypes = {
	level: PropTypes.number.isRequired,
	headingText: PropTypes.string,
	headingClassName: PropTypes.string,
	className: PropTypes.string,
	children: PropTypes.any,
};

/**
 * Defines the default values for the properties.
 *
 * @type {{level: number, headingClassName: string}}
 */
Section.defaultProps = {
	level: 1,
	headingClassName: "",
	className: "",
};

export default Section;
