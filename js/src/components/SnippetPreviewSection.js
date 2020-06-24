// External dependencies.
import PropTypes from "prop-types";
import styled from "styled-components";
import { StyledSection, StyledHeading, StyledSectionBase } from "@yoast/components";
import { getDirectionalStyle as getRtlStyle } from "@yoast/helpers";

const Section = styled( StyledSection )`
	max-width: 640px;
	
	&${ StyledSectionBase } {
		padding: 0;

		& ${ StyledHeading } {
			${ getRtlStyle( "padding-left", "padding-right" ) }: 20px;
			margin-left: ${ getRtlStyle( "0", "20px" ) };
		}
	}
`;

/**
 * Creates the Snippet Preview Section.
 *
 * @param {Object}         props               The component props.
 * @param {wp.Element}     props.children      The component's children.
 * @param {string}         props.title         The heading title.
 * @param {string}         props.icon          The heading icon.
 * @param {bool}           props.hasPaperStyle Whether the section should have a paper style.
 *
 * @returns {wp.Element} Snippet Preview Section.
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
