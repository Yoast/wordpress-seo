import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import colors from "../../../../style-guide/colors.json";
import { Icon } from "./Icon";
import { rgba } from "../../../../style-guide/helpers";

export const ChangingIconButtonBase = styled.button`
	box-sizing: border-box;
	width: 32px;
	display: inline-block;
	border: 1px solid ${ colors.$color_button_border };
	background-color: ${ props => props.pressed ? props.pressedBackground : props.unpressedBackground };
	box-shadow: ${ props => props.pressed
		? `inset 0 2px 0 ${ rgba( props.pressedBoxShadowColor, 0.7 ) }`
		: `0 1px 0 ${ rgba( props.unpressedBoxShadowColor, 0.7 ) }` };
	border-radius: 3px;
	cursor: pointer;
	outline: none;
	height: ${ props => props.pressed ? "24px" : "25px" };

	/* 
	Each button has an icon and a secondary icon to make it possible to switch icons on hover.
	The secondary icon is initially not displayed.
	*/
	.yoast-changing-icon-button__secondary-icon {
			display: none;
	}
	
	// Switch icons on hover.
	&:hover .yoast-changing-icon-button__icon {
		display: none;
	}

	&:hover .yoast-changing-icon-button__secondary-icon {
		display: inline;
	}
`;

const ChangingIconButton = ( props ) => {
	return (
		<ChangingIconButtonBase
			onClick={ props.onClick }
			pressed={ props.pressed }
			unpressedBoxShadowColor={ props.unpressedBoxShadowColor }
			pressedBoxShadowColor={ props.pressedBoxShadowColor }
			pressedBackground={ props.pressedBackground }
			unpressedBackground={ props.unpressedBackground }
			aria-label={ props.id }
			aria-pressed={ props.pressed }
			unpressedIconColor={ props.unpressedIconColor }
			pressedIconColor={ props.pressedIconColor }
		>
			{ props.pressed
				? <Icon className="yoast-changing-icon-button__icon"
					icon={ props.pressedIcon }
					color={ props.pressedIconColor }
					size="18px"/>
				: <Icon className="yoast-changing-icon-button__icon"
					icon={ props.unpressedIcon }
					color={ props.unpressedIconColor }
					size="18px"/>
			}
			{ props.pressed
				? <Icon className="yoast-changing-icon-button__secondary-icon"
					icon={ props.unpressedIcon }
					color={ props.pressedIconColor }
					size="18px"/>
				: <Icon className="yoast-changing-icon-button__secondary-icon"
					icon={ props.pressedIcon }
					color={ props.unpressedIconColor }
					size="18px"/>
			}
		</ChangingIconButtonBase>
	);
};

ChangingIconButton.propTypes = {
	id: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	boxShadowColor: PropTypes.string,
	unpressedBoxShadowColor: PropTypes.string,
	pressedBoxShadowColor: PropTypes.string,
	pressedBackground: PropTypes.string,
	unpressedBackground: PropTypes.string,
	pressedIconColor: PropTypes.string,
	unpressedIconColor: PropTypes.string,
	pressedIcon: PropTypes.func.isRequired,
	unpressedIcon: PropTypes.func.isRequired,
	pressed: PropTypes.bool.isRequired,
};

ChangingIconButton.defaultProps = {
	unpressedBoxShadowColor: colors.$color_button_border,
	pressedBoxShadowColor: colors.$color_purple,
	pressedBackground: colors.$color_pink_dark,
	unpressedBackground: colors.$color_button,
	pressedIconColor: colors.$color_white,
	unpressedIconColor: colors.$color_button_text,
};

export default ChangingIconButton;
