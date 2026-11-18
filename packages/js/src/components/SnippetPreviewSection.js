import { StyledHeading, StyledSection, StyledSectionBase } from "@yoast/components";
import { getDirectionalStyle as getRtlStyle } from "@yoast/helpers";
import PropTypes from "prop-types";
import styled from "styled-components";

const Section = styled( StyledSection )`
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
 * @param {React.ReactNode} [children=null] The component's children.
 * @param {string} [title=""] The heading title.
 * @param {string} [icon=""] The heading icon.
 * @param {boolean} [hasPaperStyle=true] Whether the section should have a paper style.
 * @param {Object} [shoppingData=null] The shopping data object.
 *
 * @returns {JSX.Element} Snippet Preview Section.
 */
const SnippetPreviewSection = ( {
	children = null,
	title = "",
	icon = "",
	hasPaperStyle = true,
	shoppingData = null,
} ) => {
	return (
		<Section
			headingLevel={ 3 }
			headingText={ title }
			headingIcon={ icon }
			headingIconColor="#555"
			hasPaperStyle={ hasPaperStyle }
			shoppingData={ shoppingData }
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
	shoppingData: PropTypes.object,
};

export default SnippetPreviewSection;
