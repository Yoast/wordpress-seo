import React from "react";

import Heading from "./Heading";

/**
 * Creates a HTML section element with an optional heading.
 *
 * @param {Object} props The props to use.
 * @param {string} [props.className] The class name of the section.
 * @param {string} [props.headingText] The heading text.
 * @param {number} [props.headingLevel=1] The level of the heading element.
 * @param {string} [props.headingClassName] The class name of the heading.
 * @param {*} [props.children] The content of the section.
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

export default Section;
