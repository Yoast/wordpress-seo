import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { intlShape, injectIntl } from "react-intl";

import colors from "../../../../style-guide/colors.json";
import { Icon } from "./Icon";
import { rgba } from "../../../../style-guide/helpers";

const ChangingIconButtonBase = styled.button`
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
	padding: 0;
	height: ${ props => props.pressed ? "24px" : "25px" };
	
	&:hover {
		border-color: ${ props => props.hoverBorderColor }
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
			id={ props.id }
			aria-label={ props.ariaLabel }
			aria-pressed={ props.pressed }
			unpressedIconColor={ props.unpressedIconColor }
			pressedIconColor={ props.pressedIconColor }
			hoverBorderColor={ props.hoverBorderColor }
		>
			{ props.pressed
				? <Icon
					icon={ props.icon }
					color={ props.pressedIconColor }
					size="18px"/>
				: <Icon
					icon={ props.icon }
					color={ props.unpressedIconColor }
					size="18px"/>
			}
		</ChangingIconButtonBase>
	);
};

ChangingIconButton.propTypes = {
	id: PropTypes.string.isRequired,
	ariaLabel: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	boxShadowColor: PropTypes.string,
	unpressedBoxShadowColor: PropTypes.string,
	pressedBoxShadowColor: PropTypes.string,
	pressedBackground: PropTypes.string,
	unpressedBackground: PropTypes.string,
	pressedIconColor: PropTypes.string,
	unpressedIconColor: PropTypes.string,
	icon: PropTypes.func.isRequired,
	pressed: PropTypes.bool.isRequired,
	hoverBorderColor: PropTypes.string,
};

ChangingIconButton.defaultProps = {
	unpressedBoxShadowColor: colors.$color_button_border,
	pressedBoxShadowColor: colors.$color_purple,
	pressedBackground: colors.$color_pink_dark,
	unpressedBackground: colors.$color_button,
	pressedIconColor: colors.$color_white,
	unpressedIconColor: colors.$color_button_text,
	hoverBorderColor: colors.$color_white,
};

export default ChangingIconButton;
