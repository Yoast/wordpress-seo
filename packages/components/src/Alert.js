/* External dependencies */
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { getDirectionalStyle } from "@yoast/helpers";
import IconButton from "./buttons/IconButton";
import SvgIcon from "./SvgIcon";

const AlertContainer = styled.div`
	display: flex;
	align-items: flex-start; 
	fontSize: 14px;
	border: 1px solid rgba(0,0,0, 0.2);
	padding: 16px;
	color: ${ props => props.color };
	background: ${ props => props.background };
	margin-bottom: 20px;
`;

const AlertContent = styled.div`
	flex-grow: 1;
`;

const AlertIcon = styled( SvgIcon )`
	${ getDirectionalStyle( "margin-right: 8px", "margin-left: 8px" ) };
`;

const AlertDismiss = styled( IconButton )`
	${ getDirectionalStyle( "margin-left: 8px", "margin-right: 8px" ) };
	min-height: auto;
	padding: 0;

	&, &:hover, &:focus, &:active {
		border-radius: 0;
		border: none;
		background: transparent;
		box-shadow: none;
	}

	svg {
		width: 24px;
		height: 24px;
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
 *                                       Note: the function provider should do the actual dismissing!
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
					color: "#8F1919",
					background: "#F9DCDC",
					icon: "alert-error",
				};
			case "info":
				return {
					color: "#00468F",
					background: "#CCE5FF",
					icon: "alert-info",
				};
			case "success":
				return {
					color: "#395315",
					background: "#E2F2CC",
					icon: "alert-success",
				};
			case "warning":
				return {
					color: "#674E00",
					background: "#FFF3CD",
					icon: "alert-warning",
				};
			default:
				return {
					color: "#00468F",
					background: "#CCE5FF",
					icon: "alert-info",
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

		return <AlertContainer color={ options.color } background={ options.background }>
			<AlertIcon icon={ options.icon } color={ options.color } />
			<AlertContent>{ this.props.children }</AlertContent>
			{
				typeof this.props.onDismissed === "function"
					? (
						<AlertDismiss
							icon="times"
							iconColor={ options.color }
							onClick={ this.props.onDismissed }
							aria-label={ __( this.props.dismissAriaLabel, "yoast-components" ) }
						/>
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
