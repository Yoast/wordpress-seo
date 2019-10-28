// External dependencies.
import React from "react";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

// Yoast dependencies
import { Input, Label } from "@yoast/components";
import { getDirectionalStyle } from "@yoast/helpers";
import { colors } from "@yoast/style-guide";

// Internal dependencies.
import { MODE_DESKTOP, MODE_MOBILE, MODES } from "../snippet-preview/constants";

const Switcher = styled.fieldset`
	border: 0;
	padding: 0;
	margin: 0 0 16px;
`;

const SwitcherTitle = styled.legend`
	margin: 8px 0;
	padding: 0;
	color: ${ colors.$color_headings };
	font-size: 14px;
	font-weight: 600;
`;

const ModeLabel = styled( Label )`
	${ getDirectionalStyle( "margin-right: 16px", "margin-left: 16px" ) };
	color: inherit;
	font-size: 14px;
	line-height: 1.71428571;
	cursor: pointer;
	/* Helps RTL in Chrome */
	display: inline-block;
`;

const ModeRadio = styled( Input )`
	&& {
		${ getDirectionalStyle( "margin: 0 8px 0 0", "margin: 0 0 0 8px" ) };
		cursor: pointer;
	}
`;

/**
 * Renders a mode switcher between mobile and desktop.
 *
 * @param {Object}   props          The props for this component.
 * @param {Function} props.onChange Callback that is called when the mode switches.
 * @param {boolean}  props.active   Which mode is currently active.
 *
 * @returns {ReactElement} The rendered element.
 */
const ModeSwitcher = ( { onChange, active } ) => {
	return ( <Switcher>
		<SwitcherTitle>{ __( "Preview as:", "yoast-components" ) }</SwitcherTitle>
		<ModeRadio
			onChange={ () => onChange( MODE_MOBILE ) }
			type="radio"
			name="screen"
			value="mobile"
			optionalAttributes={ {
				id: "yoast-google-preview-mode-mobile",
				checked: active === MODE_MOBILE,
			} }
		/>
		<ModeLabel for="yoast-google-preview-mode-mobile">
			{ __( "Mobile result", "yoast-components" ) }
		</ModeLabel>
		<ModeRadio
			onChange={ () => onChange( MODE_DESKTOP ) }
			type="radio"
			name="screen"
			value="desktop"
			optionalAttributes={ {
				id: "yoast-google-preview-mode-desktop",
				checked: active === MODE_DESKTOP,
			} }
		/>
		<ModeLabel for="yoast-google-preview-mode-desktop">
			{ __( "Desktop result", "yoast-components" ) }
		</ModeLabel>
	</Switcher> );
};

ModeSwitcher.propTypes = {
	onChange: PropTypes.func.isRequired,
	active: PropTypes.oneOf( MODES ),
};

ModeSwitcher.defaultProps = {
	active: MODE_MOBILE,
};

export default ModeSwitcher;
