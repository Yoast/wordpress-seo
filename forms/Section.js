import React from "react";

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
	)
};

/**
 * Adds validation for the properties.
 *
 * @type {{level: number, headingText: string, headingClassName: string}}
 */
Section.propTypes = {
	level: React.PropTypes.number.isRequired,
	headingText: React.PropTypes.string.isRequired,
	headingClassName: React.PropTypes.string,
};

/**
 * Defines the default values for the properties.
 *
 * @type {{level: number, headingClassName: string}}
 */
Section.defaultProps = {
	level: 1,
	headingClassName: "",
};

export default Section;
