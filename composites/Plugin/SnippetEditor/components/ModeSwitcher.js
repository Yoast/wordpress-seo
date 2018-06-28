// External dependencies.
import React from "react";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

// Internal dependencies.
import { Button } from "../../Shared/components/Button";
import colors from "../../../../style-guide/colors";
import { MODE_DESKTOP, MODE_MOBILE, MODES } from "../../SnippetPreview/constants";
import ScreenReaderText from "../../../../a11y/ScreenReaderText";
import SvgIcon from "../../Shared/components/SvgIcon";
import PropTypes from "prop-types";
import { getRtlStyle } from "../../../../utils/helpers/styled-components";

/**
 * Renders a switcher button.
 *
 * @param {Object}  props The props for this component.
 * @param {boolean} props.isActive Whether or not this button is currently active.
 *
 * @returns {ReactComponent} The rendered component.
 */
const SwitcherButton = styled( Button )`
	border: none;
	border-bottom: 4px solid transparent;
	
	width: 31px;
	height: 31px;
	
	border-color: ${ ( props ) => props.isActive ? colors.$color_snippet_active : "transparent" };
	color: ${ colors.$color_snippet_active };
	
	transition: 0.15s color ease-in-out,0.15s background-color ease-in-out,0.15s border-color ease-in-out;
	transition-property: border-color;
	
	&:hover, &:focus {
		background-color: ${ colors.$color_white };
		border: none;
		border-bottom: 4px solid transparent;
		border-color: ${ colors.$color_snippet_focus };
		color: ${ colors.$color_snippet_focus };
		box-shadow: none;
	}
`;

export const MobileButton = SwitcherButton.extend`
	border-radius: 3px 0 0 3px;
`;

export const DesktopButton = SwitcherButton.extend`
	border-radius: 0 3px 3px 0;
`;

export const Switcher = styled.div`
	display: inline-block;
	margin-top: 10px;
	margin-left: 20px;
	margin-right: ${ getRtlStyle( "0px", "20px" ) };
	margin-left: ${ getRtlStyle( "20px", "4px" ) };
	border: 1px solid #dbdbdb;
	border-radius: 4px;
	background-color: #f7f7f7;
	vertical-align: top;
`;

/**
 * Renders a mode switcher between mobile and desktop.
 *
 * @param {Object} props The props for this component.
 * @param {Function} props.onChange Callback that is called when the mode switches.
 * @param {boolean}  props.active   Which mode is currently active.
 *
 * @returns {ReactElement} The rendered element.
 */
const ModeSwitcher = ( { onChange, active } ) => {
	return <Switcher>
		<MobileButton
			onClick={ () => onChange( MODE_MOBILE ) }
			isActive={ active === MODE_MOBILE }
			aria-pressed={ active === MODE_MOBILE }>
			<SvgIcon icon="mobile" size="22px" color="currentColor" />
			<ScreenReaderText>
				{ __( "Mobile preview", "yoast-components" ) }
			</ScreenReaderText>
		</MobileButton>

		<DesktopButton
			onClick={ () => onChange( MODE_DESKTOP ) }
			isActive={ active === MODE_DESKTOP }
			aria-pressed={ active === MODE_DESKTOP }>
			<SvgIcon icon="desktop" size="18px" color="currentColor" />
			<ScreenReaderText>
				{ __( "Desktop preview", "yoast-components" ) }
			</ScreenReaderText>
		</DesktopButton>
	</Switcher>;
};

ModeSwitcher.propTypes = {
	onChange: PropTypes.func.isRequired,
	active: PropTypes.oneOf( MODES ),
};

export default ModeSwitcher;
