import React from "react";
import PropTypes from "prop-types";

import Heading from "../composites/basic/Heading";

/**
 * Represents a HTML section element.
 *
 * @param {Object} props The properties to use.
 * @returns {ReactElement} The rendered component.
 */
const Section = ( props ) => {
	return (
		<section className={ props.className }>
			{ ! props.styled &&
				<Heading level={ props.headingLevel } className={ props.headingClassName }>
					{ props.headingText }
				</Heading>
			}
			{ props.children }
		</section>
	);
};

/**
 * Adds validation for the properties.
 *
 * @type {{level: number, headingText: string, headingClassName: string}}
 */
Section.propTypes = {
	headingLevel: PropTypes.number,
	headingClassName: PropTypes.string,
	headingIcon: PropTypes.string,
	headingText: PropTypes.string,
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
