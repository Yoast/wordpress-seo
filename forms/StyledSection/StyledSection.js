import Section from "../Section";
import React from "react";

/**
 * Represents a visual section within the page.
 *
 * @param {Object} props The props for this component.
 * @param {string} props.title The title to put inside the heading
 * @param {string} props.icon The classname to give to the section element.
 * @param {ReactElement} props.sectionContent The content to put inside the section.
 * @returns {ReactElement} The rendered component.
 * @constructor
 */
const StyledSection = ( { title, icon, sectionContent } ) => {
	let className = "yoast-section";
	let headingClassName = "yoast-section__heading yoast-section__heading-icon yoast-section__heading-icon-" + icon;

	return (
		<Section level={3} headingText={title} className={className} headingClassName={headingClassName} children={sectionContent} />
	);
};

StyledSection.propTypes = {
	title: React.PropTypes.string.isRequired,
	icon: React.PropTypes.string.isRequired,
	sectionContent: React.PropTypes.element.isRequired,
};

export default StyledSection;

