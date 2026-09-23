import React from "react";
import PropTypes from "prop-types";

import Heading from "./Heading";

/**
 * Creates a HTML section element with an optional heading.
 *
 * @param {Object} props The props to use.
 * @returns {ReactElement} The rendered component.
 */
const Section = ( { className, headingText, headingLevel = 1, headingClassName, children } ) => {
	return (
		<section className={ className }>
			{ headingText &&
				<Heading level={ headingLevel } className={ headingClassName }>
					{ headingText }
				</Heading>
			}
			{ children }
		</section>
	);
};

Section.propTypes = {
	className: PropTypes.string,
	headingText: PropTypes.string,
	headingLevel: PropTypes.number,
	headingClassName: PropTypes.string,
	children: PropTypes.any,
};

export default Section;
