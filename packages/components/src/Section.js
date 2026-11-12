import React from "react";
import PropTypes from "prop-types";

import Heading from "./Heading";

/**
 * Creates a HTML section element with an optional heading.
 *
 * @param {Object} props The props to use.
 * @returns {ReactElement} The rendered component.
 */
const Section = ( { headingLevel = 1, ...props } ) => {
	return (
		<section className={ props.className }>
			{ props.headingText &&
				<Heading level={ headingLevel } className={ props.headingClassName }>
					{ props.headingText }
				</Heading>
			}
			{ props.children }
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
