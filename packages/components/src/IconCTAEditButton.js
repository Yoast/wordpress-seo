import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import SvgIcon from "./SvgIcon";

const IconButtonBase = styled.button`
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	min-width: 32px;
	display: inline-flex;
	border: 1px solid ${ colors.$color_button_border };
	background-color: ${ props => props.background };
	box-shadow: ${ props => props.boxShadowColor };
	border-radius: 3px;
	cursor: pointer;
	padding: 0;
	height: 24px;
	&:hover {
		border-color: ${ props => props.hoverBorderColor };
	}
`;

/**
 * Returns the IconCTAEditButton component.
 *
 * @param {Object} props Component props.
 *
 * @returns {ReactElement} IconCTAEditButton component.
 */
const IconCTAEditButton = function( props ) {
	return (
		<IconButtonBase
			type="button"
			onClick={ props.onClick }
			boxShadowColor={ props.boxShadowColor }
			background={ props.background }
			id={ props.id }
			aria-label={ props.ariaLabel }
			iconColor={ props.iconColor }
			hoverBorderColor={ props.hoverBorderColor }
			className={ props.className }
		>
			<SvgIcon
				icon={ props.icon }
				color={ props.iconColor }
				size="18px"
			/>
		</IconButtonBase>
	);
};

IconCTAEditButton.propTypes = {
	id: PropTypes.string.isRequired,
	ariaLabel: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	boxShadowColor: PropTypes.string,
	background: PropTypes.string,
	iconColor: PropTypes.string,
	icon: PropTypes.string.isRequired,
	hoverBorderColor: PropTypes.string,
	className: PropTypes.string,
};

IconCTAEditButton.defaultProps = {
	boxShadowColor: colors.$color_button_border,
	background: colors.$color_button,
	iconColor: colors.$color_button_text,
	hoverBorderColor: colors.$color_white,
};

export default IconCTAEditButton;
