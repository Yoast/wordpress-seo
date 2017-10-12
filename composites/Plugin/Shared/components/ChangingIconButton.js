import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import colors from "../../../../style-guide/colors.json";
import { Icon } from "./Icon";
import { rgba } from "../../../../style-guide/helpers";

export const ChangingIconButtonBase = styled.button`
	box-sizing: border-box;
	touch-action: manipulation;
	-webkit-appearance: none;
	width: 32px;
	display: inline-block;
	text-align: center;
	border: 1px solid ${ colors.$color_button_border };
	background-color: ${ props => props.checked ? props.checkedBackground : props.uncheckedBackground };
	box-shadow: ${ props => props.checked
		? `inset 0 2px 0 ${ rgba( props.checkedBoxShadowColor, 0.7 ) }`
		: `0 1px 0 ${ rgba( props.uncheckedBoxShadowColor, 0.7 ) }` };
	border-radius: 3px;
	cursor: pointer;
	outline: none;
	padding-top: 2px;
	height: ${ props => props.checked ? "25px" : "24px" };
		
		&:hover {
			// Invert colors and icon on hover.
			background-color: ${ props => props.checked ? props.uncheckedBackground : props.checkedBackground };
			box-shadow: ${ props => props.checked
				? `0 1px 0 ${ rgba( props.uncheckedBoxShadowColor, 0.7 ) }`
				: `inset 0 2px 0 ${ rgba( props.checkedBoxShadowColor, 0.7 ) }` };
		}
`;

const ChangingIconButton = ( props ) => {
	return (
		<ChangingIconButtonBase
			onClick={ props.onClick }
			checked={ props.checked }
			uncheckedBoxShadowColor={ props.uncheckedBoxShadowColor }
			checkedBoxShadowColor={ props.checkedBoxShadowColor }
			checkedBackground={ props.checkedBackground }
			uncheckedBackground={ props.uncheckedBackground }
			aria-label={ props.id }
			aria-checked={ props.checked }
		>
			{ props.checked
				? <Icon icon={ props.checkedIcon } color={ props.checkedIconColor }/>
				: <Icon icon={ props.uncheckedIcon } color={ props.uncheckedIconColor }/>
			}
		</ChangingIconButtonBase>
	);
};

ChangingIconButton.propTypes = {
	id: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	boxShadowColor: PropTypes.string,
	uncheckedBoxShadowColor: PropTypes.string,
	checkedBoxShadowColor: PropTypes.string,
	checkedBackground: PropTypes.string,
	uncheckedBackground: PropTypes.string,
	checkedIconColor: PropTypes.string,
	uncheckedIconColor: PropTypes.string,
	checkedIcon: PropTypes.func.isRequired,
	uncheckedIcon: PropTypes.func.isRequired,
	checked: PropTypes.bool.isRequired,
};

ChangingIconButton.defaultProps = {
	uncheckedBoxShadowColor: colors.$color_button_border,
	checkedBoxShadowColor: colors.$color_purple,
	checkedBackground: colors.$color_pink_dark,
	uncheckedBackground: colors.$color_button,
	checkedIconColor: colors.$color_white,
	uncheckedIconColor: colors.$color_button_text,
};

export default ChangingIconButton;
