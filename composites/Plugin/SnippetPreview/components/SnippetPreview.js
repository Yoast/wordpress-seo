/* External dependencies */
import React from "react";
import styled from "styled-components";
import interpolateComponents from "interpolate-components";
import transliterate from "yoastseo/js/stringProcessing/transliterate";
import createWordRegex from "yoastseo/js/stringProcessing/createWordRegex";
import PropTypes from "prop-types";
import truncate from "lodash/truncate";
import partial from "lodash/partial";

/* Internal dependencies */
import ScreenReaderText from "../../../../a11y/ScreenReaderText";

const colorTitle = "#1e0fbe";
const colorUrl = "#006621";
const colorDescription = "#545454";
const colorGeneratedDescription = "#777";
const colorDate = "#808080";

const colorCaret = "#555555";
const colorCaretHover = "#bfbfbf";

const maxWidth = 600;
const DESCRIPTION_LIMIT = 280;

export const Container = styled.div`
	max-width: ${ maxWidth }px;
	background-color: white;
`;


const angleRight = ( color ) => "data:image/svg+xml;charset=utf8," + encodeURI(
	'<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">' +
		'<path fill="' + color + '" d="M1152 896q0 26-19 45l-448 448q-19 19-45 19t-45-19-19-45v-896q0-26 19-45t45-19 45 19l448 448q19 19 19 45z" />' +
	"</svg>"
);

export const TitleContainer = styled.div`
	cursor: pointer;
	position: relative;
`;

/**
 * Adds caret styles to a component.
 *
 * @param {ReactElement} WithoutCaret The component without caret styles.
 * @param {string} color The color to render the caret in.
 *
 * @returns {ReactElement} The component with caret styles.
 */
function addCaretStyle( WithoutCaret, color ) {
	return styled( WithoutCaret )`
		&::before {
			display: block;
			position: absolute;
			top: -3px;
			left: -22px;
			width: 24px;
			height: 24px;
			background-image: url( ${ () => angleRight( color ) });
			background-size: 25px;
			content: "";
		}
	`;
}

export const TitleBounded = styled.div`
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

export const UrlContainer = styled.div`
	display: inline-block;
	color: ${colorUrl};
	cursor: pointer;
	position: relative;
`;

export const DescriptionContainer = styled.div.attrs( {
	color: ( props ) => props.isDescriptionGenerated ? colorGeneratedDescription : colorDescription,
} )`
	color: ${ props => props.color };
	cursor: pointer;
	position: relative;
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

const DatePreview = styled.span`
	color: ${ colorDate };
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
export default function SnippetPreview( { title, url, description, keyword, isDescriptionGenerated, locale, onClick, onMouseLeave, onMouseOver, hoveredField, activeField, date } ) {
	let Title = hoveredField === "title" ? addCaretStyle( TitleContainer, colorCaretHover ) : TitleContainer;
	let Description = hoveredField === "description" ? addCaretStyle( DescriptionContainer, colorCaretHover ) : DescriptionContainer;
	let Url = hoveredField === "url" ? addCaretStyle( UrlContainer, colorCaretHover ) : UrlContainer;

	if ( activeField === "title" ) {
		Title = addCaretStyle( Title, colorCaret );
	}

	if ( activeField === "description" ) {
		Description = addCaretStyle( Description, colorCaret );
	}

	if ( activeField === "url" ) {
		Url = addCaretStyle( Url, colorCaret );
	}

	date = date === "" ? null : <DatePreview>{date} - </DatePreview>;

	return (
		<section>
			<Container onMouseLeave={ this.onMouseLeave }>
				<ScreenReaderText>SEO title preview:</ScreenReaderText>
				<Title onClick={onClick.bind( null, "title" )}
				       onMouseOver={partial( onMouseOver, "title" )}
				       onMouseLeave={partial( onMouseLeave, "title" )}>
					<TitleBounded>
						<TitleUnbounded>
							{ title }
						</TitleUnbounded>
					</TitleBounded>
				</Title>
				<ScreenReaderText>Slug preview:</ScreenReaderText>
				<Url onClick={onClick.bind( null, "url" )}
				     onMouseOver={partial( onMouseOver, "url" )}
				     onMouseLeave={partial( onMouseLeave, "url" )}>
					{ highlightKeyword( locale, keyword, url ) }
				</Url>
				<UrlDownArrow />
				<ScreenReaderText>Meta description preview:</ScreenReaderText>
				<Description isDescriptionGenerated={isDescriptionGenerated}
				             onClick={onClick.bind( null, "description" )}
				             onMouseOver={partial( onMouseOver, "description" ) }
				             onMouseLeave={partial( onMouseLeave, "description" )}>
					{ date }
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
	date: PropTypes.string,

	hoveredField: PropTypes.string,
	activeField: PropTypes.string,
	keyword: PropTypes.string,
	isDescriptionGenerated: PropTypes.bool,
	locale: PropTypes.string,

	onClick: PropTypes.func.isRequired,
	onHover: PropTypes.func,
	onMouseOver: PropTypes.func,
	onMouseLeave: PropTypes.func,
};

SnippetPreview.defaultProps = {
	date: "",
	keyword: "",
	isDescriptionGenerated: false,
	locale: "en_US",
	onHover: () => {},
	hoveredField: "",
	activeField: "",
};
