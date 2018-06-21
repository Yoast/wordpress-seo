// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { StyledSection, StyledHeading, StyledSectionBase } from "yoast-components";

const Section = styled( StyledSection )`
	margin-bottom: 2em;
	max-width: 640px;
	
	&${ StyledSectionBase } {
		& ${ StyledHeading } {
			padding-left: 20px;
			font-size: 14.4px;
		}
	}
`;

/**
 * Creates the Snippet Preview Section.
 *
 * @param {Object}         props               The component props.
 * @param {ReactComponent} props.children      The component's children.
 * @param {string}         props.title         The heading title.
 * @param {string}         props.icon          The heading icon.
 * @param {bool}           props.hasPaperStyle Whether the section should have a paper style.
 *
 * @returns {ReactElement} Snippet Preview Section.
 */
const SnippetPreviewSection = ( { children, title, icon, hasPaperStyle } ) => {
	return (
		<Section
			headingLevel={ 3 }
			headingText={ title }
			headingIcon={ icon }
			headingIconColor="#555"
			hasPaperStyle={ hasPaperStyle }
		>
			{ children }
		</Section>
	);
};

SnippetPreviewSection.propTypes = {
	children: PropTypes.element,
	title: PropTypes.string,
	icon: PropTypes.string,
	hasPaperStyle: PropTypes.bool,
};

SnippetPreviewSection.defaultProps = {
	hasPaperStyle: true,
};

export default SnippetPreviewSection;
