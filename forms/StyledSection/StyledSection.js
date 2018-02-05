import React from "react";
import PropTypes from "prop-types";

import Section from "../Section";

/**
 * Represents a visual section within the page.
 *
 * @param {Object} props The props for this component.
 * @param {string} props.title The title to put inside the heading.
 * @param {string} props.icon The classname to give to the section element.
 * @param {ReactElement} props.sectionContent The content to put inside the section.
 * @returns {ReactElement} The rendered component.
 * @constructor
 */
const StyledSection = ( { title, icon, sectionContent } ) => {
	let className = "yoast-section";
	let headingClassName = "yoast-section__heading yoast-section__heading-icon yoast-section__heading-icon-" + icon;

	return (
		<Section
			level={ 3 }
			headingText={ title }
			className={ className }
			headingClassName={ headingClassName }>
			{ sectionContent }
		</Section>
	);
};

StyledSection.propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	sectionContent: PropTypes.element.isRequired,
};

export default StyledSection;

