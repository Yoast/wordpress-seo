/* External dependencies */
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { getDirectionalStyle } from "@yoast/helpers";
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import Button from "./buttons/Button";
import SvgIcon from "./SvgIcon";

const AlertContainer = styled.div`
	display: flex;
	align-items: flex-start;
	fontSize: 14px;
	border: 1px solid rgba(0, 0, 0, 0.2);
	padding: 16px;
	color: ${ props => props.alertColor };
	background: ${ props => props.alertBackground };
	margin-bottom: 20px;
`;

const AlertContent = styled.div`
	flex-grow: 1;

	a {
		color: ${ colors.$color_alert_link_text };
	}
`;

const AlertIcon = styled( SvgIcon )`
	margin-top: 0.125rem;
	${ getDirectionalStyle( "margin-right: 8px", "margin-left: 8px" ) };
`;

const AlertDismiss = styled( Button )`
	${ getDirectionalStyle( "margin-left: 8px", "margin-right: 8px" ) };
	font-size: 24px;
	line-height: 24px;
	color: ${ props => props.alertDismissColor };

	// Override the base button style: get rid of the button styling.
	min-height: auto;
	padding: 0;

	&, &:hover, &:focus, &:active {
		border-radius: 0;
		border: none;
		background: transparent;
		box-shadow: none;
	}
`;

/**
 * Alert component.
 *
 * @param {Object}   props               The props to use.
 * @param {*}        props.children      The children to render inside the alert.
 * @param {string}   props.type          The type of Alert. Can be: "error", "info", "success" or "warning".
 *                                       Controls the colors and icon of the Alert.
 * @param {Function} [props.onDismissed] When supplied this Alert will gain an 'X' button.
 *                                       Note: the function provided should do the actual dismissing!
 *
 * @returns {Alert} The Alert component.
 */
class Alert extends React.Component {
	/**
	 * Returns the colors and icon to be used based on the type provided to the props.
	 *
	 * @param {string} type The type of Alert.
	 *
	 * @returns {object} Options with colors and icons to be used.
	 */
	getTypeDisplayOptions( type ) {
		switch ( type ) {
			case "error":
				return {
					color: colors.$color_alert_error_text,
					background: colors.$color_alert_error_background,
					icon: "alert-error",
				};
			case "info":
				return {
					color: colors.$color_alert_info_text,
					background: colors.$color_alert_info_background,
					icon: "alert-info",
				};
			case "success":
				return {
					color: colors.$color_alert_success_text,
					background: colors.$color_alert_success_background,
					icon: "alert-success",
				};
			case "warning":
				return {
					color: colors.$color_alert_warning_text,
					background: colors.$color_alert_warning_background,
					icon: "alert-warning",
				};
		}
	}

	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render() {
		const options = this.getTypeDisplayOptions( this.props.type );

		return <AlertContainer alertColor={ options.color } alertBackground={ options.background }>
			<AlertIcon icon={ options.icon } color={ options.color } />
			<AlertContent>{ this.props.children }</AlertContent>
			{
				typeof this.props.onDismissed === "function"
					? (
						<AlertDismiss
							alertDismissColor={ options.color }
							onClick={ this.props.onDismissed }
							aria-label={ __( this.props.dismissAriaLabel, "yoast-components" ) }
						>
							&times;
						</AlertDismiss>
					)
					: null
			}
		</AlertContainer>;
	}
}

Alert.propTypes = {
	children: PropTypes.any.isRequired,
	type: PropTypes.oneOf( [ "error", "info", "success", "warning" ] ).isRequired,
	onDismissed: PropTypes.func,
	dismissAriaLabel: PropTypes.string,
};

Alert.defaultProps = {
	onDismissed: null,
	dismissAriaLabel: "Dismiss this alert",
};

export default Alert;
