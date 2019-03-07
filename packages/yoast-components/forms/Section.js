import React from "react";
import PropTypes from "prop-types";

import Heading from "../composites/basic/Heading";

/**
 * Creates a HTML section element with an optional heading.
 *
 * @param {Object} props The props to use.
 * @returns {ReactElement} The rendered component.
 */
const Section = ( props ) => {
	return (
		<section className={ props.className }>
			{ props.headingText &&
				<Heading level={ props.headingLevel } className={ props.headingClassName }>
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

Section.defaultProps = {
	headingLevel: 1,
};

export default Section;
