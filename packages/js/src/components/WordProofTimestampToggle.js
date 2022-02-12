/* eslint-disable require-jsdoc */
import { Component, Fragment, useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { Toggle, FieldGroup } from "@yoast/components";
import { __, sprintf } from "@wordpress/i18n";
import AuthenticationModal from "./modals/wordproof/AuthenticationModal";
import { get } from "lodash";
import {openAuthentication, openSettings} from '../helpers/wordproof';

/**
 * @param {Object} props The props object.
 * @returns {JSX.Element} The SettingsLink component.
 */
const SettingsLink = ( props ) => {
	if ( ! props.isAuthenticated ) {
		return ( <></> );
	}

	const openLink = useCallback( event => {
		event.preventDefault();
		openSettings()
	} );

	return (
		<a
			href={ props.settingsUrl } onClick={ openLink }
		>{ __( "Manage WordProof settings", "wordpress-seo" ) }</a>
	);
};

SettingsLink.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	settingsUrl: PropTypes.string.isRequired,
};

const AuthenticationLink = ( props ) => {
	const openLink = useCallback( event => {
		event.preventDefault();
		openAuthentication()
	} );

	if ( ! props.isAuthenticated && props.toggleIsEnabled ) {
		return (
			<a
				href={ props.authenticationUrl } onClick={ openLink }
			>{ __( "Authenticate with WordProof", "wordpress-seo" ) }</a>
		);
	}

	return ( "" );
};

AuthenticationLink.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	toggleIsEnabled: PropTypes.bool.isRequired,
	authenticationUrl: PropTypes.string.isRequired,
};

/**
 * The WordProofTimestampToggle Component.
 */
class WordProofTimestampToggle extends Component {
	/**
	 * @param {Object} props The props object.
	 * @param {string} props.id The id for the checkbox.
	 * @param {boolean} props.isEnabled The value of the checkbox.
	 * @param {string} props.postTypeName The name of the post type.
	 */
	constructor( props ) {
		super( props );

		this.setIsOpen = this.setIsOpen.bind( this );
		this.setIsAuthenticated = this.setIsAuthenticated.bind( this );
		this.openSettings = this.openSettings.bind( this );
		this.openAuthentication = this.openAuthentication.bind( this );
		this.handleToggle = this.handleToggle.bind( this );

		const data = get( window, "wordproofSdk.data", {} );

		this.state = {
			isOpen: false,
			isAuthenticated: data.is_authenticated,
			isDisabled: data.timestamp_current_post_type,
			settingsUrl: data.popup_redirect_settings_url,
			authenticationUrl: data.popup_redirect_authentication_url,
		};
	}

	setIsOpen( value ) {
		this.setState( { isOpen: value } );
	}

	setIsAuthenticated( bool ) {
		this.setState( { isAuthenticated: bool } );
	}

	handleToggle( value ) {
		this.props.onToggle( value );

		if ( ! this.state.isAuthenticated && value ) {
			this.openAuthentication();
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
						disable={ this.state.isDisabled }
					/>
					<SettingsLink
						isAuthenticated={ this.state.isAuthenticated }
						openSettings={ this.openSettings }
						settingsUrl={ this.state.settingsUrl }
					/>
					<AuthenticationLink
						toggleIsEnabled={ this.props.isEnabled }
						isAuthenticated={ this.state.isAuthenticated }
						openAuthentication={ this.openAuthentication }
						authenticationUrl={ this.state.authenticationUrl }
					/>
				</FieldGroup>

				<AuthenticationModal
					isOpen={ this.state.isOpen }
					setIsOpen={ this.setIsOpen }
					isAuthenticated={ this.state.isAuthenticated }
					postTypeName={ this.props.postTypeName }
				/>
			</Fragment>
		);
	}
}

WordProofTimestampToggle.propTypes = {
	id: PropTypes.string,
	isEnabled: PropTypes.bool,
	onToggle: PropTypes.func,
	postTypeName: PropTypes.string,
};

WordProofTimestampToggle.defaultProps = {
	id: "timestamp-toggle",
	isEnabled: true,
	onToggle: () => {
	},
	postTypeName: "post",
};

export default WordProofTimestampToggle;
