import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { colors } from "@yoast/style-guide";
import { SvgIcon, ScreenReaderText } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";

const LinkSuggestionWrapper = styled.div`
	width: 100%;
	display: block;
	margin-bottom: 5px;
`;

const LinkSuggestionIcon = styled.button`
	height: 30px;
	width: 30px;
	background-color: ${ colors.$color_button };
	border-radius: 5px;
	cursor: pointer;
	outline:none;
	float: left;
	margin-right: 5px;
	display: table-cell;
	border: 1px solid ${ colors.$color_button_border };

	&:focus {
		border-radius: 100%;
		box-shadow: 0 0 0 1px #5b9dd9, 0 0 2px 1px rgba(30, 140, 190, 0.8);
	}
`;

const Link = makeOutboundLink( styled.a`
	padding: 6px 0;
	display: table-cell;
` );

/**
 * @summary Represents a suggestion component with a copy url to clipboard icon and a text value.
 *
 * @param {string}   value     The text value.
 * @param {string}   url       The URL.
 * @param {boolean}   isActive whether the URL is active.
 * @returns {JSX} The rendered suggestion.
 * @constructor
 */
const LinkSuggestion = ( { value, url, isActive } ) => {
	const label = __( "Copy link", "yoast-components" );
	const ariaLabel = sprintf(
		/* translators: %s expands to the link value */
		__( "Copy link to suggested article: %s", "yoast-components" ),
		value
	);

	/**
	 * @summary Resets the button aria-label and data-label to their default values.
	 *
	 * @param {Object} evt The blur SyntheticEvent on the button.
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
		</LinkSuggestionWrapper>
	);
};

LinkSuggestion.propTypes = {
	value: PropTypes.string,
	url: PropTypes.string,
	isActive: PropTypes.bool,
};

export default LinkSuggestion;
