import { StyledHeading, StyledSection, StyledSectionBase } from "@yoast/components";
import { getDirectionalStyle as getRtlStyle } from "@yoast/helpers";
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
 * @param {Object} props Component props.
 * @param {React.ReactNode} [props.children=null] The component's children.
 * @param {string} [props.title=""] The heading title.
 * @param {string} [props.icon=""] The heading icon.
 * @param {boolean} [props.hasPaperStyle=true] Whether the section should have a paper style.
 * @param {Object} [props.shoppingData=null] The shopping data object.
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

export default SnippetPreviewSection;
