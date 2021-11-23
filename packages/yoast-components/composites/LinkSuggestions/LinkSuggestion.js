import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { colors } from "@yoast/style-guide";
import { SvgIcon, ScreenReaderText } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";

const LinkSuggestionWrapper = styled.div`
	display: flex;
	align-items: center;
	min-height: 40px;
	margin-bottom: 5px;
`;

const LinkSuggestionIcon = styled.button`
	box-sizing: border-box;
	height: 30px;
	width: 30px;
	background-color: ${ colors.$color_button };
	border-radius: 5px;
	cursor: pointer;
	outline:none;
	margin-right: 8px;
	border: 1px solid ${ colors.$color_button_border };

	&:focus {
		box-shadow: 0 0 0 1px #5b9dd9, 0 0 2px 1px rgba(30, 140, 190, 0.8);
	}
`;

const Link = makeOutboundLink( styled.a`
	max-width: 128px;
	padding: 6px 0;
	margin-right: 8px;
` );

const Badge = styled.span`
	max-width: 75px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: center;
	display: block;
	padding: 3px 8px;
	margin-left: auto;
	font-size: 0.85em;
	background-color: #f3f4f5;
	border-radius: 2px;
`;

/**
 * Represents a suggestion component with a copy url to clipboard icon and a text value.
 *
 * @param {string}  value    The text value.
 * @param {string}  url      The URL.
 * @param {boolean} isActive Whether the URL is already in use in the text.
 * @param {string}  type     The type of suggested object (e.g. post, movie, category, etc.).
 *
 * @returns {JSX} The rendered suggestion.
 *
 * @constructor
 */
const LinkSuggestion = ( { value, url, isActive, type } ) => {
	const label = __( "Copy link", "yoast-components" );
	const ariaLabel = sprintf(
		/* translators: %s expands to the link value */
		__( "Copy link to suggested article: %s", "yoast-components" ),
		value
	);

	/**
	 * Resets the button aria-label and data-label to their default values.
	 *
	 * @param {Object} evt The blur SyntheticEvent on the button.
	 *
	 * @returns {void}
	 */
	const resetLabels = ( evt ) => {
		evt.nativeEvent.target.setAttribute( "aria-label", ariaLabel );
		evt.nativeEvent.target.setAttribute( "data-label", label );
	};

	let icon = "clipboard";
	if ( isActive ) {
		icon = "check";
	}
	return (
		<LinkSuggestionWrapper>
			<LinkSuggestionIcon
				type="button"
				className="yoast-link-suggestion__copy yoast-tooltip yoast-tooltip-alt yoast-tooltip-s"
				onBlur={ resetLabels }
				data-clipboard-text={ url }
				aria-label={ ariaLabel }
				data-label={ label }
			>
				<SvgIcon icon={ icon } color={ colors.$color_grey_dark } />
				<ScreenReaderText>{ label }</ScreenReaderText>
			</LinkSuggestionIcon>
			<Link href={ url }>{ value }</Link>
			<Badge title={ type }>{ type }</Badge>
		</LinkSuggestionWrapper>
	);
};

LinkSuggestion.propTypes = {
	value: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	isActive: PropTypes.bool,
	type: PropTypes.string.isRequired,
};

LinkSuggestion.defaultProps = {
	isActive: false,
};

export default LinkSuggestion;
