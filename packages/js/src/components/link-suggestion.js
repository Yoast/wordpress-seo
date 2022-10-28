import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import { colors } from "@yoast/style-guide";
import { ScreenReaderText } from "@yoast/components";
import { makeOutboundLink, createSvgIconComponent } from "@yoast/helpers";

const LinkSuggestionWrapper = styled.div`
	display: flex;
	align-items: normal;
	min-height: 40px;
	margin: 10px 0 5px;
`;

/* eslint-disable max-len, quote-props */
const LinkSuggestionSVGIcon = createSvgIconComponent( {
	"copy": { viewbox: "0 0 448 512", path: "M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z" },
	"check": { viewbox: "0 0 512 512", path: "M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" },
} );
/* eslint-enable */

const LinkSuggestionDivider = styled.div`
   background-color: #e5e5e5;
   width: 100%;
   height: 1px;
`;

const LinkSuggestionIcon = styled.button`
	box-sizing: border-box;
	flex: 0 0 30px;
	height: 30px;
	width: 30px;
	background-color: ${ props => props.iconBackground };
	border-radius: 5px;
	outline:none;
	border: 1px solid ${ props => props.iconBorder };
	margin-left: 3px;
	cursor: ${props => props.isEnabled ? "pointer" : "default"};
	pointer-events: ${props => props.isEnabled ? "all" : "none"};

	&:focus {
		box-shadow: 0 0 0 1px #5b9dd9, 0 0 2px 1px rgba(30, 140, 190, 0.8);
	}
`;

LinkSuggestionIcon.props = {
	iconBackground: PropTypes.string,
	iconBorder: PropTypes.string,
};

LinkSuggestionIcon.defaultProps = {
	iconBackground: colors.$color_button,
	iconBorder: colors.$color_button_border,
};

const LinkContainer = styled.div`
	flex: auto;
	max-width: 200px;
`;

const Link = makeOutboundLink( styled.a`
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* -webkit-box-orient: vertical; */
    /* -moz-box-orient: vertical; */
    max-height: 40px;
    margin-bottom: 4px;
    -webkit-box-orient: vertical;
	overflow: hidden;
	padding: 0 0 4px;
` );

const DisabledLink = styled( Link )`
	pointer-events: none;
	cursor: default;
`;

const BadgesWrapper = styled.div`
    flex-wrap: wrap;
    display: flex;
    flex-direction: row;
    justify-content: unset;
    margin-top: 4px;
	cursor: ${props => props.isEnabled ? "auto" : "default"};
`;

const Badge = styled.span`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: center;
	padding: 3px 8px;
	font-size: 0.85em;
	background-color: #f3f4f5;
	border-radius: 2px;
	margin-bottom: 4px;
	margin-right: 4px;
	text-transform: lowercase;
	cursor: ${props => props.isEnabled ? "auto" : "default"};

`;

/**
 * Represents a list of badges.
 *
 * @param {string[]} badges The badges.
 *
 * @returns {React.Element} The rendered badges.
 */
const Badges = ( { badges, isEnabled } ) =>  {
	return ( <BadgesWrapper isEnabled={ isEnabled }>
		{ badges.map( ( badge, key ) => <Badge key={ key }>{ badge }</Badge> ) }
	</BadgesWrapper> );
};

Badges.propTypes = {
	badges: PropTypes.array.isRequired,
	isEnabled: PropTypes.bool,
};

Badges.defaultProps = {
	isEnabled: true,
};

/**
 * Represents a suggestion component with a copy url to clipboard icon and a text value.
 *
 * @param {string}   value    The text value.
 * @param {string}   url      The URL.
 * @param {boolean}  isActive Whether the URL is already in use in the text.
 * @param {string[]} labels   The labels of suggested object (e.g. cornerstone, post, movie, category, etc.).
 * @param {boolean}  isEnabled Whether the link should be clickable.
 *
 * @returns {React.Element} The rendered suggestion.
 *
 * @constructor
 */
const LinkSuggestion = ( { value, url, isActive, labels, isEnabled } ) => {
	const label = __( "Copy link", "wordpress-seo" );
	const ariaLabel = sprintf(
		/* translators: %s expands to the link value */
		__( "Copy link to suggested article: %s", "wordpress-seo" ),
		value
	);

	/**
	 * Resets the button aria-label and data-label to their default values.
	 *
	 * @param {Object} evt The blur SyntheticEvent on the button.
	 *
	 * @returns {void}
	 */
	const resetLabels = useCallback( ( evt ) => {
		evt.nativeEvent.target.setAttribute( "aria-label", ariaLabel );
		evt.nativeEvent.target.setAttribute( "data-label", label );
	} );

	let icon = "copy";
	let iconColor = colors.$color_black;
	let iconBackground = colors.$color_button;
	let iconBorder = "#979797";
	if ( isActive ) {
		icon = "check";
		iconColor = colors.$color_alert_success_text;
		iconBackground = colors.$color_alert_success_background;
		iconBorder = colors.$color_alert_success_background;
	}

	return (
		<div>
			<LinkSuggestionDivider />
			<LinkSuggestionWrapper className="yoast-link-suggestion__wrapper">
				<LinkContainer className="yoast-link-suggestion__container">
					{ isEnabled && <Link href={ url }>{ value }</Link> }
					{ ! isEnabled && <DisabledLink href={ url }>{ value }</DisabledLink> }
					<Badges badges={ labels } />
				</LinkContainer>
				<LinkSuggestionIcon
					type="button"
					className="yoast-link-suggestion__copy yoast-tooltip yoast-tooltip-alt yoast-tooltip-s"
					onBlur={ resetLabels }
					data-clipboard-text={ url }
					aria-label={ ariaLabel }
					data-label={ label }
					iconBackground={ iconBackground }
					iconBorder={ iconBorder }
					isEnabled={ isEnabled }
				>
					<LinkSuggestionSVGIcon icon={ icon } color={ iconColor } />
					<ScreenReaderText>{ label }</ScreenReaderText>
				</LinkSuggestionIcon>
			</LinkSuggestionWrapper>
		</div>
	);
};

LinkSuggestion.propTypes = {
	value: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	isActive: PropTypes.bool,
	labels: PropTypes.array.isRequired,
	isEnabled: PropTypes.bool,
};

LinkSuggestion.defaultProps = {
	isActive: false,
	isEnabled: true,
};

export default LinkSuggestion;
