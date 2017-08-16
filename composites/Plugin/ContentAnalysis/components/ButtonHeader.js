import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import colors from "../../../../style-guide/colors.json";
import defaults from "../../../../config/defaults.json";
import { caretUp, caretDown } from "../../../../style-guide/svg";
import { Icon } from "../../Shared/components/Icon";

const AnalysisHeader = styled.button`
	display: flex;
	width: 100%;
	justify-content: space-between;
	align-items: center;
	background-color: ${ colors.$color_white };
	padding: 0;
	border: none;
	text-align: left;
	font-weight: 300;
	cursor: pointer;
	// When clicking, the button text disappears in Safari 10 because of color: activebuttontext.
	color: ${ colors.$color_blue };
	@media screen and ( max-width: ${ defaults.css.breakpoint.tablet }px ) {
		padding: 16px 24px;
	}
	@media screen and ( max-width: ${ defaults.css.breakpoint.mobile }px ) {
		padding: 16px;
	}
	svg {
		flex: 0 0 40px;
		// Compensate the SVGIcon width-viewbox size.
		margin-right: -10px;
		// Add some spacing between icon and text.
		margin-left: 10px;
		// Compensate the height difference with a line of text (32px).
		margin-top: -4px;
		margin-bottom: -4px;
		// Looks like Safari 10 doesn't like align-items: center for SVGs and needs some help.
		align-self: flex-start;
		
		@media screen and ( max-width: ${ defaults.css.breakpoint.tablet }px ) {
		margin-top: 4px;
		margin-bottom: 4px;
		margin-right: -2px;
		}
	}
`;

const AnalysisTitle = styled.span`
	flex: 1 1 auto;
	font-size: 1.5em;
	// Chrome needs 8 decimals to make this 32px without roundings.
	line-height: 1.33333333;
	// Looks like Safari 10 doesn't like align-items: center for SVGs and needs some help.
	align-self: center;
`;


/**
 * Returns the ButtonHeader component.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Icon component.
 */
export const ButtonHeader = ( props ) => {
	return (
		<div id="accordionGroup" role="presentation" className="Accordion">
			<h3 role="heading" aria-level="3">
				<AnalysisHeader aria-expanded={ props.isOpen } className="Accordion-trigger" aria-controls="sect1" id="accordion1id" onClick={ props.headerClick }>
					<Icon icon={ props.isOpen ? caretUp : caretDown } iconColor= { colors.$color_grey_dark }  iconSize="20px" /><AnalysisTitle className="Accordion-title">{ props.title }</AnalysisTitle>
				</AnalysisHeader>
			</h3>
		</div>
	);
};

ButtonHeader.propTypes = {
	title: PropTypes.string.isRequired,
	isOpen: PropTypes.bool,
	headerClick: PropTypes.func,
};

ButtonHeader.defaultProps = {
	isOpen: false,
};