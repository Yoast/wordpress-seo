// External dependencies.
import React from "react";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import { Component } from "react";
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
 * The mode switcher component for the google preview.
 */
class ModeSwitcher extends Component {
	/**
	 * ModeSwitcher constructor.
	 *
	 * @param {Object} props Component props.
	 */
	constructor( props ) {
		super( props );

		this.switchToMobile = this.props.onChange.bind( this, "mobile" );
		this.switchToDesktop = this.props.onChange.bind( this, "desktop" );
	}

	/**
	 * Render the ModeSwitcher component.
	 *
	 * @returns {JSX.Element} The rendered component.
	 */
	render() {
		const {
			active,
			mobileModeInputId,
			desktopModeInputId,
		} = this.props;

		const mobileInputId = mobileModeInputId.length > 0 ? mobileModeInputId : "yoast-google-preview-mode-mobile";
		const desktopInputId = desktopModeInputId.length > 0 ? desktopModeInputId : "yoast-google-preview-mode-desktop";

		return ( <Switcher>
			<SwitcherTitle>{ __( "Preview as:", "wordpress-seo" ) }</SwitcherTitle>
			<ModeRadio
				onChange={ this.switchToMobile }
				type="radio"
				name="screen"
				value="mobile"
				optionalAttributes={ {
					id: mobileInputId,
					checked: active === MODE_MOBILE,
				} }
			/>
			<ModeLabel for={ mobileInputId }>
				{ __( "Mobile result", "wordpress-seo" ) }
			</ModeLabel>
			<ModeRadio
				onChange={ this.switchToDesktop }
				type="radio"
				name="screen"
				value="desktop"
				optionalAttributes={ {
					id: desktopInputId,
					checked: active === MODE_DESKTOP,
				} }
			/>
			<ModeLabel for={ desktopInputId }>
				{ __( "Desktop result", "wordpress-seo" ) }
			</ModeLabel>
		</Switcher> );
	}
}

ModeSwitcher.propTypes = {
	onChange: PropTypes.func.isRequired,
	active: PropTypes.oneOf( MODES ),
	mobileModeInputId: PropTypes.string,
	desktopModeInputId: PropTypes.string,
};

ModeSwitcher.defaultProps = {
	active: MODE_MOBILE,
	mobileModeInputId: "",
	desktopModeInputId: "",
};

export default ModeSwitcher;
