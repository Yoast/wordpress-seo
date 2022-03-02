/* eslint-disable require-jsdoc */
import { Component, Fragment, useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { Toggle, FieldGroup } from "@yoast/components";
import { __, sprintf } from "@wordpress/i18n";
import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import { get } from "lodash";
import { openAuthentication, openSettings } from "../helpers/wordproof";

/**
 * The settings link.
 *
 * @param {Object} props The props object.
 * @returns {JSX.Element} The SettingsLink component.
 */
const SettingsLink = ( props ) => {
	if ( ! props.isAuthenticated ) {
		return ( <></> );
	}

	const url = get( window, "wordproofSdk.data.popup_redirect_settings_url", {} );

	const openLink = useCallback( event => {
		event.preventDefault();
		openSettings();
	} );

	return (
		<a
			href={ url } onClick={ openLink }
		>{ __( "Manage WordProof settings", "wordpress-seo" ) }</a>
	);
};

SettingsLink.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
};

/**
 * The authentication link.
 *
 * @param props
 * @returns {JSX.Element|string}
 * @constructor
 */
const AuthenticationLink = ( props ) => {
	const openLink = useCallback( event => {
		event.preventDefault();
		openAuthentication();
	} );

	const url = get( window, "wordproofSdk.data.popup_redirect_authentication_url", {} );

	if ( ! props.isAuthenticated && props.toggleIsEnabled ) {
		return (
			<a
				href={ url } onClick={ openLink }
			>{ __( "Authenticate with WordProof", "wordpress-seo" ) }</a>
		);
	}

	return ( "" );
};

AuthenticationLink.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	toggleIsEnabled: PropTypes.bool.isRequired,
};

/**
 * The WordProofTimestampToggle component.
 */
class WordProofTimestampToggle extends Component {
	/**
	 * @param {Object} props The props object.
	 * @param {string} props.id The id for the checkbox.
	 * @param {boolean} props.isEnabled The value of the checkbox.
	 * @param {func} props.onToggle The callback on toggle.
	 * @param {boolean} props.isAuthenticated If the site is authenticated.
	 */
	constructor( props ) {
		super( props );

		this.handleToggle = this.handleToggle.bind( this );
	}

	handleToggle( value ) {
		this.props.onToggle( value );

		if ( ! this.props.isAuthenticated && value ) {
			openAuthentication();
		}
	}

	/**
	 * Renders the WordProofTimestampToggle component.
	 *
	 * @returns {wp.Element} the WordProofTimestampToggle component.
	 */
	render() {
		return (
			<Fragment>
				<FieldGroup
					style={ { display: "flex", marginTop: "8px" } }
					linkText={ __( "Learn more about timestamping",
						"wordpress-seo" ) }
					linkTo={ "https://yoa.st/wordproof-integration" }
					htmlFor={ this.props.id }
					label={ __( "Timestamp with WordProof", "wordpress-seo" ) }
					hasNewBadge={ true }
				>
					<Toggle
						className={ "yoast-field-group__radiobutton" }
						id={ this.props.id }
						labelText={ sprintf(
							/* Translators: %s translates to the Post type in singular form */
							__( "Timestamp this %s", "wordpress-seo" ),
							this.props.postTypeName
						) }
						isEnabled={ this.props.isEnabled }
						onSetToggleState={ this.handleToggle }
					/>
					<SettingsLink
						isAuthenticated={ this.props.isAuthenticated }
					/>
					<AuthenticationLink
						toggleIsEnabled={ this.props.isEnabled }
						isAuthenticated={ this.props.isAuthenticated }
					/>
				</FieldGroup>
			</Fragment>
		);
	}
}

WordProofTimestampToggle.propTypes = {
	id: PropTypes.string,
	isEnabled: PropTypes.bool,
	onToggle: PropTypes.func,
	postTypeName: PropTypes.string,
	isAuthenticated: PropTypes.bool.isRequired,
};

WordProofTimestampToggle.defaultProps = {
	id: "timestamp-toggle",
	isEnabled: true,
	postTypeName: "post",
	onToggle: () => {},
};

export default compose( [
	withSelect( ( select ) => {
		return {
			isAuthenticated: select( "wordproof" ).getIsAuthenticated(),
		};
	} ),
] )( WordProofTimestampToggle );
