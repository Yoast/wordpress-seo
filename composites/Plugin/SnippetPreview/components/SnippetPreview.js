/* External dependencies */
import React from "react";
import styled from "styled-components";
import interpolateComponents from "interpolate-components";
import transliterate from "yoastseo/js/stringProcessing/transliterate";
import createWordRegex from "yoastseo/js/stringProcessing/createWordRegex";
import PropTypes from "prop-types";
import truncate from "lodash/truncate";

/* Internal dependencies */
import ScreenReaderText from "../../../../a11y/ScreenReaderText";

const colorTitle = "#1e0fbe";
const colorUrl = "#006621";
const colorDescription = "#545454";
const colorGeneratedDescription = "#777";

const maxWidth = 600;
const DESCRIPTION_LIMIT = 280;

export const Container = styled.div`
	max-width: ${ maxWidth }px;
	background-color: white;
	margin: 5em auto 0;
`;

export const TitleContainer = styled.div`
	color: ${colorTitle};
	text-decoration: none;
	font-size: 18px;
	line-height: 1.2;
	font-weight: normal;
	margin: 0;

	display: inline-block;
	overflow: hidden;
	max-width: ${ maxWidth }px;
	vertical-align: top;
	text-overflow: ellipsis;
`;

export const TitleUnbounded = styled.span`
	white-space: nowrap;
`;

export const Url = styled.div`
	display: inline-block;
	color: ${colorUrl};
`;

export const Description = styled.div.attrs( {
	color: ( props ) => props.isDescriptionGenerated ? colorGeneratedDescription : colorDescription,
} )`
	color: ${ props => props.color }
`;

export const UrlDownArrow = styled.div`
	display: inline-block;
	margin-top: 6px;
	margin-left: 6px;
	border-top: 5px solid #006621;
	border-right: 4px solid transparent;
	border-left: 4px solid transparent;
	vertical-align: top;
`;

/**
 * Highlights a keyword with strong React elements.
 *
 * @param {string} locale The locale.
 * @param {string} keyword The keyword.
 * @param {string} text The text in which to highlight a keyword.
 *
 * @returns {ReactElement} React elements to be rendered.
 */
function highlightKeyword( locale, keyword, text ) {
	// Match keyword case-insensitively.
	const keywordMatcher = createWordRegex( keyword, "", false );

	text = text.replace( keywordMatcher, function( keyword ) {
		return `{{strong}}${ keyword }{{/strong}}`;
	} );

	// Transliterate the keyword for highlighting
	const transliteratedKeyword = transliterate( keyword, locale );
	if ( transliteratedKeyword !== keyword ) {
		const transliteratedKeywordMatcher = createWordRegex( transliteratedKeyword, "", false );
		text = text.replace( transliteratedKeywordMatcher, function( keyword ) {
			return `{{strong}}${ keyword }{{/strong}}`;
		} );
	}

	return interpolateComponents( {
		mixedString: text,
		components: { strong: <strong /> },
	} );
}

/**
 * Renders the SnippetPreview component.
 *
 * @param {string} title                  The title tag.
 * @param {string} url                    The URL of the page for which to generate a snippet.
 * @param {string} description            The meta description.
 * @param {string} keyword                The keyword for the page.
 * @param {string} isDescriptionGenerated Whether the description was generated.
 * @param {string} locale                 The locale of the page.
 *
 * @returns {ReactElement} The SnippetPreview component.
 */
export default function SnippetPreview( { title, url, description, keyword, isDescriptionGenerated, locale } ) {
	return (
		<section>
			<Container>
				<ScreenReaderText>SEO title preview:</ScreenReaderText>
				<TitleContainer>
					<TitleUnbounded>
						{ title }
					</TitleUnbounded>
				</TitleContainer>
				<ScreenReaderText>Slug preview:</ScreenReaderText>
				<Url>
					{ highlightKeyword( locale, keyword, url ) }
				</Url>
				<UrlDownArrow />
				<ScreenReaderText>Meta description preview:</ScreenReaderText>
				<Description isDescriptionGenerated={ isDescriptionGenerated }>
					{ highlightKeyword( locale, keyword, truncate( description, { length: DESCRIPTION_LIMIT, omission: "" } ) ) }
				</Description>
			</Container>
		</section>
	);
}

SnippetPreview.propTypes = {
	title: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	keyword: PropTypes.string,
	isDescriptionGenerated: PropTypes.bool,
	locale: PropTypes.string,
};

SnippetPreview.defaultProps = {
	keyword: "",
	isDescriptionGenerated: false,
	locale: "en_US",
};
