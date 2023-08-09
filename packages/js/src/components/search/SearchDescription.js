import { __ } from "@wordpress/i18n";
import styled from "styled-components";
import { colors } from "@yoast/style-guide";

const Description = styled.legend`
	margin: 16px 0;
	padding: 0;
	color: ${ colors.$color_headings };
	font-size: 12px;
	font-weight: 300;
`;

/**
 * The component that represents the description shown in the search preview.
 *
 * @returns {JSX.Element} The SearchDescription component.
 */
const SearchDescription = () => {
	return (
		<Description>
			{ __( "Determine how your post should look in the search results.", "wordpress-seo" ) }
		</Description>
	);
};


export default SearchDescription;
