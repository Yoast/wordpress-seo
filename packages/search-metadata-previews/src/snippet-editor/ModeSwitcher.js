// External dependencies.
import React from "react";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

// Internal dependencies.
import { MODE_DESKTOP, MODE_MOBILE, MODES } from "../snippet-preview/constants";

const Switcher = styled.div`
	display: inline-block;
	margin-bottom: 16px;
	vertical-align: top;
`;

const ModeLabel = styled.label`
	font: 400 14px/24px "Open Sans",sans-serif;
	margin-right: 18px;
	cursor: pointer;
	color: #3c4043;
`;

const ModeRadio = styled.input`
	margin-right: 10px;
`;

const SwitcherTitle = styled.h4`
	margin: .5em 0;
	color: #3c4043;
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
		<SwitcherTitle>{ __( "Preview as", "yoast-components" ) + ":" }</SwitcherTitle>
		<ModeLabel>
			<ModeRadio
				onChange={ () => onChange( MODE_MOBILE ) }
				checked={ active === MODE_MOBILE }
				aria-pressed={ active === MODE_MOBILE }
				type="radio"
				name="screen"
				value="mobile"
			/>
			<span>{ __( "Mobile result", "yoast-components" ) }</span>
		</ModeLabel>
		<ModeLabel>
			<ModeRadio
				onChange={ () => onChange( MODE_DESKTOP ) }
				checked={ active === MODE_DESKTOP }
				aria-pressed={ active === MODE_DESKTOP }
				type="radio"
				name="screen"
				value="desktop"
			/>
			<span>{ __( "Desktop result", "yoast-components" ) }</span>
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
