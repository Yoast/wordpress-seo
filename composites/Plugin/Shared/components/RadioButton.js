import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import colors from "../../../../style-guide/colors.json";
import { Icon } from "./Icon";
import { rgba } from "../../../../style-guide/helpers";

export const RadioButtonBase = styled.input.attrs( {
	type: "radio",
} )`
	display: none;
`;

export const RadioButtonLabel = styled.label`
	box-sizing: border-box;
	touch-action: manipulation;
	-webkit-appearance: none;
	width: 32px;
	display: inline-block;
	text-align: center;
	border: 1px solid ${ colors.$color_button_border };
	background: ${ props => props.checked ? props.checkedBackground : props.uncheckedBackground };
	box-shadow: ${ props => props.checked
		? `inset 0 2px 0 ${ rgba( props.checkedBoxShadowColor, 0.7 ) }`
		: `0 1px 0 ${ rgba( props.uncheckedBoxShadowColor, 0.7 ) }` };
	border-radius: 3px;
	cursor: pointer;
	outline: none;
	padding-top: ${ props => props.checked ? "2px" : "2px" };
	height: ${ props => props.checked ? "25px" : "24px" };
`;

const IconRadioButton = ( props ) => {
	return (
		<span>
			<RadioButtonBase
				type="radio"
				id={ props.id }
				name={ props.name }
			/>
			<RadioButtonLabel
				onClick={ props.onClick }
				className="label"
				checked={ props.checked }
				htmlFor={ props.id }
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
			</RadioButtonLabel>
		</span>
	);
};

IconRadioButton.propTypes = {
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
	name: PropTypes.string.isRequired,
	checked: PropTypes.bool.isRequired,
};

IconRadioButton.defaultProps = {
	uncheckedBoxShadowColor: colors.$color_button_border,
	checkedBoxShadowColor: colors.$color_purple,
	checkedBackground: colors.$color_pink_dark,
	uncheckedBackground: colors.$color_button,
	checkedIconColor: colors.$color_white,
	uncheckedIconColor: colors.$color_button_text,
};

export default IconRadioButton;
