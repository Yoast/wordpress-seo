// External dependencies.
import React, { PureComponent } from "react";
import styled from "styled-components";
import interpolateComponents from "interpolate-components";
import PropTypes from "prop-types";
import truncate from "lodash/truncate";
import { parse } from "url";
import { __ } from "@wordpress/i18n";

// Yoast dependencies.
import { colors, angleLeft, angleRight } from "@yoast/style-guide";
import { languageProcessing } from "yoastseo";
import { getDirectionalStyle } from "@yoast/helpers";
import { ScreenReaderText } from "@yoast/components";

const {
	transliterate,
	createRegexFromArray,
	replaceDiacritics: replaceSpecialCharactersAndDiacritics,
} = languageProcessing;

// Internal dependencies.
import FixedWidthContainer from "./FixedWidthContainer";
import ProductDataDesktop from "./ProductDataDesktop";
import ProductDataMobile from "./ProductDataMobile";
import { DEFAULT_MODE, MODE_DESKTOP, MODE_MOBILE, MODES } from "./constants";

/*
 * These colors should not be abstracted. They are chosen because Google renders
 * the snippet like this.
 */
// Was #1e0fbe
const colorTitleDesktop         = "#1a0dab";
const colorTitleMobile          = "#1558d6";
const colorUrlBaseDesktop       = "#202124";
const colorUrlRestDesktop       = "#5f6368";
const colorUrlBaseMobile        = "#202124";
const colorUrlRestMobile        = "#70757a";
const colorDescriptionDesktop   = "#4d5156";
const colorDescriptionMobile    = "#3c4043";
// Changed to have 4.5:1 contrast.
const colorGeneratedDescription = "4d5156";
// Was #70757f for both desktop and mobile
const colorDateDesktop          = "#777";
const colorDateMobile           = "#70757a";

// Font sizes and line-heights.
const fontSizeTitleMobile    = "20px";
const lineHeightTitleMobile  = "26px";

const fontSizeTitleDesktop   = "20px";
const lineHeightTitleDesktop = "1.3";

const fontSizeUrlMobile      = "12px";
const lineHeightUrlMobile    = "20px";

const fontSizeUrlDesktop     = "14px";
const lineHeightUrlDesktop   = "1.3";


const MAX_WIDTH         = 600;
const MAX_WIDTH_MOBILE  = 400;
const WIDTH_PADDING     = 20;
const DESCRIPTION_LIMIT = 156;

const DesktopContainer = styled( FixedWidthContainer )`
	background-color: #fff;
	font-family: arial, sans-serif;
	box-sizing: border-box;
`;

const MobileContainer = styled.div`
	border-bottom: 1px hidden #fff;
	border-radius: 8px;
	box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
	font-family: Arial, Roboto-Regular, HelveticaNeue, sans-serif;
	max-width: ${ MAX_WIDTH_MOBILE }px;
	box-sizing: border-box;
	font-size: 14px;
`;

const BaseTitle = styled.div`
	cursor: pointer;
	position: relative;
`;

/**
 * Adds caret styles to a component.
 *
 * @param {ReactComponent} WithoutCaret The component without caret styles.
 * @param {string} color The color to render the caret in.
 * @param {string} mode The mode the snippet preview is in.
 *
 * @returns {ReactComponent} The component with caret styles.
 */
function addCaretStyle( WithoutCaret, color, mode ) {
	return styled( WithoutCaret )`
		&::before {
			display: block;
			position: absolute;
			top: 0;
			${ getDirectionalStyle( "left", "right" ) }: ${ () => mode === MODE_DESKTOP ? "-22px" : "-40px" };
			width: 22px;
			height: 22px;
			background-image: url( ${ getDirectionalStyle( angleRight( color ), angleLeft( color ) ) } );
			background-size: 24px;
			background-repeat: no-repeat;
			background-position: center;
			content: "";
		}
	`;
}

const Title = styled.div`
	color: ${ props => props.screenMode === MODE_DESKTOP ? colorTitleDesktop : colorTitleMobile };
	text-decoration: none;
	font-size: ${ props => props.screenMode === MODE_DESKTOP ? fontSizeTitleDesktop : fontSizeTitleMobile };
	line-height: ${ props => props.screenMode === MODE_DESKTOP ? lineHeightTitleDesktop : lineHeightTitleMobile };
	font-weight: normal;
	margin: 0;
	display: inline-block;
	overflow: hidden;
	max-width: ${ MAX_WIDTH }px;
	vertical-align: top;
	text-overflow: ellipsis;
`;

const TitleBounded = styled( Title )`
	max-width: ${ MAX_WIDTH }px;
	vertical-align: top;
	text-overflow: ellipsis;
`;

const TitleUnboundedDesktop = styled.span`
	white-space: nowrap;
`;

const TitleUnboundedMobile = styled.span`
	display: inline-block;
	max-height: 52px; // max two lines of text
	padding-top: 1px;
	vertical-align: top;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const BaseUrl = styled.div`
	display: inline-block;
	cursor: pointer;
	position: relative;
	max-width: 90%;
	white-space: nowrap;
	font-size: 14px;
	vertical-align: top;
`;

const BaseUrlOverflowContainer = styled( BaseUrl )`
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100%;
	margin-bottom: ${ props => props.screenMode === MODE_DESKTOP ? "0" : "12px" };
	padding-top: 1px;
	line-height: ${ props => props.screenMode === MODE_DESKTOP ? "1.5" : "20px" };
	vertical-align: ${ props => props.screenMode === MODE_DESKTOP ? "baseline" : "top" };
`;

const UrlContentContainer = styled.span`
	font-size: ${ props => props.screenMode === MODE_DESKTOP ? fontSizeUrlDesktop : fontSizeUrlMobile };
	line-height: ${ props => props.screenMode === MODE_DESKTOP ? lineHeightUrlDesktop : lineHeightUrlMobile };
	color: ${ props => props.screenMode === MODE_DESKTOP ? colorUrlRestDesktop : colorUrlRestMobile };
`;

const UrlBaseContainer = styled.span`
	color: ${ props => props.screenMode === MODE_DESKTOP ? colorUrlBaseDesktop : colorUrlBaseMobile };
`;

BaseUrlOverflowContainer.displayName = "SnippetPreview__BaseUrlOverflowContainer";

const DesktopDescription = styled.div`
	color: ${ props => props.isDescriptionPlaceholder ? colorGeneratedDescription : colorDescriptionDesktop };
	cursor: pointer;
	position: relative;
	max-width: ${ MAX_WIDTH }px;
	padding-top: ${ props => props.screenMode === MODE_DESKTOP ? "0" : "1px" };
	font-size: 14px;
	line-height: 1.58;
`;

const MobileDescription = styled.div`
	color: ${ colorDescriptionMobile };
	font-size: 14px;
	line-height: 20px;
	cursor: pointer;
	position: relative;
	max-width: ${ MAX_WIDTH }px;

	/* Clearing pseudo element to contain the floated image. */
	&:after {
		display: table;
		content: "";
		clear: both;
	}
`;

const MobileDescriptionImageContainer = styled.div`
	float: right;
	width: 104px;
	height: 104px;
	margin: 4px 0 4px 16px;
	border-radius: 8px;
	overflow: hidden;
`;

const MobileDescriptionImage = styled.img`
	/* Higher specificity is necessary to make sure inherited CSS rules don't alter the image ratio. */
	&&& {
		display: block;
		width: 104px;
		height: 104px;
		object-fit: cover;
	}
`;

const MobilePartContainer = styled.div`
	padding: 12px 16px;

	&:first-child {
		margin-bottom: -16px;
	}
`;

const DesktopPartContainer = styled.div`
`;

const UrlDownArrow = styled.div`
	display: inline-block;
	margin-top: 9px;
	margin-left: 6px;
	border-top: 5px solid #70757a;
	border-right: 4px solid transparent;
	border-left: 4px solid transparent;
	vertical-align: top;
`;

const DatePreview = styled.span`
	color: ${ props => props.screenMode === MODE_DESKTOP ? colorDateDesktop : colorDateMobile };
`;

const globeFaviconSrc = "data:image/png;base64," +
	"iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABs0lEQVR4AWL4//8/RRjO8Iuc" +
	"x+noO0MWUDo16FYABMGP6ZfUcRnWtm27jVPbtm3bttuH2t3eFPcY9pLz7NxiLjCyVd87pKnH" +
	"yqXyxtCs8APd0rnyxiu4qSeA3QEDrAwBDrT1s1Rc/OrjLZwqVmOSu6+Lamcpp2KKMA9PH1BY" +
	"XMe1mUP5qotvXTywsOEEYHXxrY+3cqk6TMkYpNr2FeoY3KIr0RPtn9wQ2unlA+GMkRw6+9TF" +
	"w4YTwDUzx/JVvARj9KaedXRO8P5B1Du2S32smzqUrcKGEyA+uAgQjKX7zf0boWHGfn71jIKj" +
	"2689gxp7OAGShNcBUmLMPVjZuiKcA2vuWHHDCQxMCz629kXAIU4ApY15QwggAFbfOP9DhgBJ" +
	"+nWVJ1AZAfICAj1pAlY6hCADZnveQf7bQIwzVONGJonhLIlS9gr5mFg44Xd+4S3XHoGNPdJl" +
	"1INIwKyEgHckEhgTe1bGiFY9GSFBYUwLh1IkiJUbY407E7syBSFxKTszEoiE/YdrgCEayDmt" +
	"aJwCI9uu8TKMuZSVfSa4BpGgzvomBR/INhLGzrqDotp01ZR8pn/1L0JN9d9XNyx0AAAAAElF" +
	"TkSuQmCC";

const Favicon = styled.img`
	width: 16px;
	height: 16px;
	margin-right: 12px;
	vertical-align: middle;
`;

const ampLogo = "data:image/png;base64," +
	"iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAABr0lEQVR4AbWWJYCUURhFD04Z" +
	"i7hrLzgFd4nzV9x6wKHinmYb7g4zq71gIw2LWBnZ3Q8df/fh96Tn/t2HVIw4CVKk+fSFNCkS" +
	"xInxW1pFkhLmoMRjVvFLmkEX5ocuZuBVPw5jv8hh+iEU5QEmuMK+prz7RN3dPMMEGQYzxpH/" +
	"lGjzou5jgl7mAvOdZfcbF+jbm3MAbFZ7VX9SJnlL1D8UMyjLe+BrAYDb+jJUr59JrlNWRtcq" +
	"X9GkrPCR4QBAf4qYJAkQoyQrbKKs8RiaEjEI0GvvQ1mLMC9xaBFFBaZS1TbMSwJSomg39erD" +
	"F+TxpCCNOXjGQJTCvG6qn4ZPzkcxA61Tjhaf4KMj+6Q3XvW6Lopraa8IozRQxIi0a7NXorUL" +
	"c5JyHX/3F3q+0PsFYytVTaGgjz/AvCyiegE69IUsPxHNBMpa738i6tGWlzkAABjKe/+j9YeR" +
	"HGVd9oWRnwe2ewDASp/L/UqoPQ5AmFeYZMavBP8dAJz0GWWDHQlzXApMdz4KYUfKICcxkKeO" +
	"fGmQyrIPcgE9m+g/+kT812/Nr3+0kqzitxQjoKXh6xfor99nlEdFjyvH15gAAAAASUVORK5C" +
	"YII=";

const Amp = styled.div`
	background-size: 100% 100%;
	display: inline-block;
	height: 12px;
	width: 12px;
	margin-bottom: -1px;
	opacity: 0.46;
	margin-right: 6px;
	background-image: url( ${ ampLogo } );
`;

/**
 * Highlights a keyword with strong React elements.
 *
 * @param {string} locale ISO 639 (2/3 characters) locale.
 * @param {string[]} wordsToHighlight The array of words to be highlighted.
 * @param {string} text The text in which to highlight words.
 * @param {string} cleanText Optional. The text in which to highlight words
 *                           without special characters and diacritics.
 *
 * @returns {ReactElement} React elements to be rendered.
 */
function highlightWords( locale, wordsToHighlight, text, cleanText ) {
	if ( wordsToHighlight.length === 0 ) {
		return text;
	}

	// Clean the text from special characters and diacritics.
	let textToUse = cleanText ? cleanText : text;

	// Initiate an array of cleaned and transliterated forms.
	const wordsToHighlightCleaned = [];

	wordsToHighlight.forEach( function( form ) {
		/*
	    * When a text has been cleaned up from special characters and diacritics
	    * we need to match against a cleaned up keyword as well.
	    */
		form = cleanText ? replaceSpecialCharactersAndDiacritics( form ) : form;

		wordsToHighlightCleaned.push( form );

		// Transliterate the keyword for highlighting
		const formTransliterated = transliterate( form, locale );

		if ( formTransliterated !== form ) {
			wordsToHighlightCleaned.push( formTransliterated );
		}
	} );

	const keywordFormsMatcher = createRegexFromArray( wordsToHighlightCleaned, false, "", false );

	textToUse = textToUse.replace( keywordFormsMatcher, function( matchedKeyword ) {
		return `{{strong}}${ matchedKeyword }{{/strong}}`;
	} );

	return interpolateComponents( {
		mixedString: textToUse,
		components: { strong: <strong /> },
	} );
}

/**
 * The snippet preview class.
 */
export default class SnippetPreview extends PureComponent {
	/**
	 * Renders the SnippetPreview component.
	 *
	 * @param {Object} props The passed props.
	 * @param {string} props.title                      The title tag.
	 * @param {string} props.url                        The URL of the page for which to generate a snippet.
	 * @param {string} props.description                The meta description.
	 * @param {string} props.keyword                    The keyword for the page.
	 * @param {string} props.isDescriptionPlaceholder   Whether the description is the placeholder.
	 * @param {string} props.locale                     The locale of the page.
	 * @param {string} props.date                       Optional, the date to display before the meta description.
	 *
	 * @returns {ReactElement} The SnippetPreview component.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			title: props.title,
			description: props.description,
			isDescriptionPlaceholder: true,
		};

		this.setTitleRef       = this.setTitleRef.bind( this );
		this.setDescriptionRef = this.setDescriptionRef.bind( this );
	}

	/**
	 * Sets the title element reference for later use.
	 *
	 * @param {Object} titleElement The title element.
	 *
	 * @returns {void}
	 */
	setTitleRef( titleElement ) {
		this._titleElement = titleElement;
	}

	/**
	 * Sets the description element reference for later use.
	 *
	 * @param {Object} descriptionElement The description element.
	 *
	 * @returns {void}
	 */
	setDescriptionRef( descriptionElement ) {
		this._descriptionElement = descriptionElement;
	}

	/**
	 * Returns whether an element has content that doesn't fit.
	 *
	 * Has a leeway of 2 to make sure weird measurements don't cause an infinite
	 * loop.
	 *
	 * @param {HTMLElement} element The element to check.
	 *
	 * @returns {boolean} Whether it has content that doesn't fit.
	 */
	hasOverflowedContent( element ) {
		return Math.abs( element.clientHeight - element.scrollHeight ) >= 2;
	}

	/**
	 * Set the title in the state so it fits in two lines.
	 *
	 * @returns {void}
	 */
	fitTitle() {
		const titleElement = this._titleElement;

		/*
		 * When the title is 600 pixels in width and two lines it approximately fits 200
		 * characters. Because we need to translate the pixels (current width) to the
		 * amount of characters we need a ratio. That ratio is 600/200 = 3.
		 */
		const PIXELS_PER_CHARACTER_FOR_TWO_LINES = 3;

		if ( this.hasOverflowedContent( titleElement ) ) {
			let prevTitle = this.state.title;

			// Heuristic to prevent too many re-renders.
			const maxCharacterCount = titleElement.clientWidth / PIXELS_PER_CHARACTER_FOR_TWO_LINES;

			if ( prevTitle.length > maxCharacterCount ) {
				prevTitle = prevTitle.substring( 0, maxCharacterCount );
			}

			const newTitle = this.dropLastWord( prevTitle );

			this.setState( {
				title: newTitle,
			} );
		}
	}

	/**
	 * Removes the last word of a sentence.
	 *
	 * @param {string} sentence The sentence to drop a word of.
	 * @returns {string} The new sentence.
	 */
	dropLastWord( sentence ) {
		const titleParts = sentence.split( " " );
		titleParts.pop();

		return titleParts.join( " " );
	}

	/**
	 * Returns the title for rendering.
	 *
	 * @returns {string} The title to render.
	 */
	getTitle() {
		if ( this.props.title !== this.state.title ) {
			return this.state.title + " ...";
		}

		return this.props.title;
	}

	/**
	 * Returns the description for rendering.
	 *
	 * @returns {string} The description to render.
	 */
	getDescription() {
		if ( ! this.props.description ) {
			return __(
				// eslint-disable-next-line max-len
				"Please provide a meta description by editing the snippet below. If you don’t, Google will try to find a relevant part of your post to show in the search results.",
				"wordpress-seo"
			);
		}

		return truncate( this.props.description, {
			length: DESCRIPTION_LIMIT,
			separator: " ",
			omission: " ...",
		} );
	}

	/**
	 * Renders the date if set.
	 *
	 * @returns {?ReactElement} The rendered date.
	 */
	renderDate() {
		// The u2014 and uFF0D unicode characters represent the em-dashes / minus signs.
		const separator = this.props.mode === MODE_DESKTOP ? "\u2014" : "\uFF0D";

		return this.props.date &&
			<DatePreview screenMode={ this.props.mode }>{ this.props.date } { separator } </DatePreview>;
	}

	/**
	 * Adds caret styles to the base component if relevant prop is active.
	 *
	 * @param {string} fieldName The field to add caret styles to.
	 * @param {ReactComponent} BaseComponent The base component for the field.
	 *
	 * @returns {ReactComponent} The component with caret styles added.
	 */
	addCaretStyles( fieldName, BaseComponent ) {
		const {
			mode,
			hoveredField,
			activeField,
		} = this.props;

		if ( activeField === fieldName ) {
			return addCaretStyle( BaseComponent, colors.$color_snippet_active, mode );
		}

		if ( hoveredField === fieldName ) {
			return addCaretStyle( BaseComponent, colors.$color_snippet_hover, mode );
		}

		return BaseComponent;
	}

	/**
	 * Returns the breadcrumbs string to be rendered.
	 *
	 * @param {string} url The url to use to build the breadcrumbs.
	 *
	 * @returns {{hostname: string, breadcrumbs: string}} An Object with the hostPart and the breadcrumbs.
	 */
	getBreadcrumbs( url ) {
		const { breadcrumbs } = this.props;
		/*
		 * Strip out question mark and hash characters from the raw URL and percent-encode
		 * characters that are not allowed in a URI.
		 */
		const cleanEncodedUrl = encodeURI( url.replace( /\?|#/g, "" ) );

		const { hostname, pathname } = parse( cleanEncodedUrl );

		const urlParts = breadcrumbs || pathname.split( "/" );

		const breadCrumbs = " › " + urlParts.filter( part => !! part ).join( " › " );

		return { hostname: decodeURI( hostname ), breadcrumbs: decodeURI( breadCrumbs ) };
	}

	/**
	 * Renders the URL for display in the snippet preview.
	 *
	 * @returns {ReactElement} The rendered URL.
	 */
	renderUrl() {
		const {
			url,
			onMouseUp,
			onMouseEnter,
			onMouseLeave,
			mode,
			faviconSrc,
		} = this.props;

		const isMobileMode = mode === MODE_MOBILE;

		/*
		 * We need to replace special characters and diacritics only on the url
		 * string because when highlightWords kicks in, interpolateComponents
		 * returns an array of strings plus a strong React element, and replace()
		 * can't run on an array.
		 */
		const urlContent = replaceSpecialCharactersAndDiacritics( url );

		const { hostname, breadcrumbs } = this.getBreadcrumbs( urlContent );

		const Url = this.addCaretStyles( "url", BaseUrl );
		/*
		 * The jsx-a11y eslint plugin is asking for an onFocus accompanying the onMouseEnter.
		 * However this is not relevant in this case, because the url is not focusable.
		 */
		/* eslint-disable jsx-a11y/mouse-events-have-key-events */
		return <React.Fragment>
			<ScreenReaderText>
				{ __( "Url preview", "wordpress-seo" ) + ":" }
			</ScreenReaderText>
			<Url>
				<BaseUrlOverflowContainer
					onMouseUp={ onMouseUp.bind( null, "url" ) }
					onMouseEnter={ onMouseEnter.bind( null, "url" ) }
					onMouseLeave={ onMouseLeave.bind( null ) }
					screenMode={ mode }
				>
					{ isMobileMode && <Favicon src={ faviconSrc || globeFaviconSrc } alt="" /> }
					<UrlContentContainer
						screenMode={ mode }
					>
						<UrlBaseContainer>{ hostname }</UrlBaseContainer>
						{ breadcrumbs }
					</UrlContentContainer>
				</BaseUrlOverflowContainer>
			</Url>
		</React.Fragment>;
		/* eslint-enable jsx-a11y/mouse-events-have-key-events */
	}

	/**
	 * Before we receive props we need to set the title and description in the
	 * state.
	 *
	 * @param {Object} nextProps The props this component will receive.
	 *
	 * @returns {void}
	 */
	componentWillReceiveProps( nextProps ) {
		const nextState = {};

		if ( this.props.title !== nextProps.title ) {
			nextState.title = nextProps.title;
		}

		if ( this.props.description !== nextProps.description ) {
			nextState.description = nextProps.description;
		}

		this.setState( nextState );
	}

	/**
	 * After a component updates we need to fit the title.
	 *
	 * @returns {void}
	 */
	componentDidUpdate() {
		this.setState( {
			isDescriptionPlaceholder: ( ! this.props.description ),
		} );

		if ( this.props.mode === MODE_MOBILE ) {
			clearTimeout( this.fitTitleTimeout );

			// Make sure that fitting the title doesn't block other rendering.
			this.fitTitleTimeout = setTimeout( () => {
				this.fitTitle();
			}, 10 );
		}
	}

	/**
	 * After a component has mounted, we need to set the state depending on the props provided.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.setState( {
			isDescriptionPlaceholder: ( ! this.props.description ),
		} );
	}

	/**
	 * Unset the timeout when unmounting, because "element" will no longer be available to fit the title.
	 *
	 * @returns {void}
	 */
	componentWillUnmount() {
		clearTimeout( this.fitTitleTimeout );
	}

	/**
	 * Renders the snippet preview description, based on the mode.
	 *
	 * @returns {ReactElement} The rendered description.
	 */
	renderDescription() {
		const {
			wordsToHighlight,
			locale,
			onMouseUp,
			onMouseLeave,
			onMouseEnter,
			mode,
			mobileImageSrc,
		} = this.props;

		const renderedDate = this.renderDate();

		const outerContainerProps = {
			isDescriptionPlaceholder: this.state.isDescriptionPlaceholder,
			onMouseUp: onMouseUp.bind( null, "description" ),
			onMouseEnter: onMouseEnter.bind( null, "description" ),
			onMouseLeave: onMouseLeave.bind( null ),
		};

		if ( mode === MODE_DESKTOP ) {
			const DesktopDescriptionWithCaret = this.addCaretStyles( "description", DesktopDescription );
			return (
				<DesktopDescriptionWithCaret
					{ ...outerContainerProps }
					ref={ this.setDescriptionRef }
				>
					{ renderedDate }
					{ highlightWords( locale, wordsToHighlight, this.getDescription() ) }
				</DesktopDescriptionWithCaret>
			);
		} else if ( mode === MODE_MOBILE ) {
			const MobileDescriptionWithCaret = this.addCaretStyles( "description", MobileDescription );
			return (
				<MobileDescriptionWithCaret
					{ ...outerContainerProps }
				>
					<MobileDescription
						isDescriptionPlaceholder={ this.state.isDescriptionPlaceholder }
						ref={ this.setDescriptionRef }
					>
						{ mobileImageSrc &&
							<MobileDescriptionImageContainer>
								<MobileDescriptionImage src={ mobileImageSrc } alt="" />
							</MobileDescriptionImageContainer>
						}
						{ renderedDate }
						{ this.getDescription() }
					</MobileDescription>
				</MobileDescriptionWithCaret>
			);
		}
		return null;
	}

	/**
	 * Renders the product / shopping data, in mobile or desktop view, based on the mode.
	 *
	 * @param {object} PartContainer the PartContainer component that needs to be rendered within the snippet preview container.
	 *
	 * @returns {ReactElement} The rendered description.
	 */
	renderProductData( PartContainer ) {
		const {	mode, shoppingData } = this.props;

		if ( Object.values( shoppingData ).length === 0 ) {
			return null;
		}

		if ( mode === MODE_DESKTOP ) {
			return (
				<PartContainer className="yoast-shopping-data-preview--desktop">
					<ScreenReaderText>
						{ __( "Shopping data preview:", "wordpress-seo" ) }
					</ScreenReaderText>
					<ProductDataDesktop
						shoppingData={ shoppingData }
					/>
				</PartContainer>
			);
		}

		if ( mode === MODE_MOBILE ) {
			return (
				<PartContainer className="yoast-shopping-data-preview--mobile">
					<ScreenReaderText>
						{ __( "Shopping data preview:", "wordpress-seo" ) }
					</ScreenReaderText>
					<ProductDataMobile
						shoppingData={ shoppingData }
					/>
				</PartContainer>
			);
		}

		return null;
	}

	/**
	 * Renders the snippet preview.
	 *
	 * @returns {ReactElement} The rendered snippet preview.
	 */
	render() {
		const {
			onMouseUp,
			onMouseLeave,
			onMouseEnter,
			mode,
			isAmp,
		} = this.props;

		const {
			PartContainer,
			Container,
			TitleUnbounded,
			SnippetTitle,
		} = this.getPreparedComponents( mode );

		const isDesktopMode = mode === MODE_DESKTOP;
		const downArrow     = isDesktopMode ? <UrlDownArrow /> : null;
		const amp           = isDesktopMode || ! isAmp ? null : <Amp />;

		/*
		 * The jsx-a11y eslint plugin is asking for an onFocus accompanying the onMouseEnter.
		 * However this is not relevant in this case, because the title and description are
		 * not focusable.
		 */
		/* eslint-disable jsx-a11y/mouse-events-have-key-events */
		return (
			<section>
				<Container
					id="yoast-snippet-preview-container"
					/*
					 * MobileContainer doesn't use the width prop: avoid to
					 * render an invalid `width` HTML attribute on the DOM node.
					 */
					width={ isDesktopMode ? MAX_WIDTH + ( 2 * WIDTH_PADDING ) : null }
					padding={ WIDTH_PADDING }
				>
					<PartContainer>
						{ this.renderUrl() }
						{ downArrow }
						<ScreenReaderText>
							{ __( "SEO title preview", "wordpress-seo" ) + ":" }
						</ScreenReaderText>
						<SnippetTitle
							onMouseUp={ onMouseUp.bind( null, "title" ) }
							onMouseEnter={ onMouseEnter.bind( null, "title" ) }
							onMouseLeave={ onMouseLeave.bind( null ) }
						>
							<TitleBounded screenMode={ mode }>
								<TitleUnbounded ref={ this.setTitleRef }>
									{ this.getTitle() }
								</TitleUnbounded>
							</TitleBounded>
						</SnippetTitle>
						{ amp }
					</PartContainer>
					<PartContainer>
						<ScreenReaderText>
							{ __( "Meta description preview:", "wordpress-seo" ) }
						</ScreenReaderText>
						{ this.renderDescription() }
					</PartContainer>
					{ this.renderProductData( PartContainer ) }
				</Container>
			</section>
		);
	/* eslint-enable jsx-a11y/mouse-events-have-key-events */
	}

	/**
	 * Returns the prepared components based on the mode we are currently in.
	 *
	 * @param {string} mode The mode we are in.
	 * @returns {{
	 *     PartContainer: ReactComponent,
	 *     Container: ReactComponent,
	 *     TitleUnbounded: ReactComponent,
	 *     SnippetTitle: ReactComponent,
	 * }} The prepared components.
	 */
	getPreparedComponents( mode ) {
		const PartContainer = mode === MODE_DESKTOP ? DesktopPartContainer : MobilePartContainer;
		const Container = mode === MODE_DESKTOP ? DesktopContainer : MobileContainer;
		const TitleUnbounded = mode === MODE_DESKTOP ? TitleUnboundedDesktop : TitleUnboundedMobile;
		const SnippetTitle = this.addCaretStyles( "title", BaseTitle );

		return {
			PartContainer,
			Container,
			TitleUnbounded,
			SnippetTitle,
		};
	}
}

SnippetPreview.propTypes = {
	title: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	date: PropTypes.string,
	breadcrumbs: PropTypes.array,

	hoveredField: PropTypes.string,
	activeField: PropTypes.string,
	keyword: PropTypes.string,
	wordsToHighlight: PropTypes.array,
	locale: PropTypes.string,
	mode: PropTypes.oneOf( MODES ),
	isAmp: PropTypes.bool,
	faviconSrc: PropTypes.string,
	mobileImageSrc: PropTypes.string,
	shoppingData: PropTypes.object,

	onMouseUp: PropTypes.func.isRequired,
	onHover: PropTypes.func,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
};

SnippetPreview.defaultProps = {
	date: "",
	keyword: "",
	wordsToHighlight: [],
	breadcrumbs: null,
	locale: "en",
	hoveredField: "",
	activeField: "",
	mode: DEFAULT_MODE,
	isAmp: false,
	faviconSrc: "",
	mobileImageSrc: "",
	shoppingData: {},

	onHover: () => {},
	onMouseEnter: () => {},
	onMouseLeave: () => {},
};
