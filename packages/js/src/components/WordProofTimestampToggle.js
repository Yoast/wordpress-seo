/* eslint-disable require-jsdoc */
import { Component, Fragment, useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { Toggle, FieldGroup, Alert } from "@yoast/components";
import { __, sprintf } from "@wordpress/i18n";
import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import { noop } from "lodash";
import { openAuthentication, openSettings } from "../helpers/wordproof";
import { Button } from "@wordpress/components";

/**
 * The settings link.
 *
 * @param {Object} props The props object.
 * @returns {JSX.Element|null} The settings link.
 */
const SettingsLink = ( props ) => {
	if ( ! props.isAuthenticated ) {
		return null;
	}

	const openLink = useCallback( () => {
		openSettings();
	} );

	return (
		<Button variant={ "link" } onClick={ openLink }>{ __( "Manage WordProof settings", "wordpress-seo" ) }</Button>
	);
};

SettingsLink.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
};

/**
 * The authentication link.
 *
 * @param {object} props Functional Component props.
 * @returns {JSX.Element|string} The authentication link.
 * @constructor
 */
const AuthenticationLink = ( props ) => {
	const openLink = useCallback( () => {
		openAuthentication();
	} );

	if ( ! props.isAuthenticated && props.toggleIsEnabled ) {
		return (
			<Button variant={ "link" } onClick={ openLink }>{ __( "Authenticate with WordProof", "wordpress-seo" ) }</Button>
		);
	}

	return null;
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
		this.turnToggleOff = this.turnToggleOff.bind( this );
		this.turnToggleOn = this.turnToggleOn.bind( this );
	}

	componentDidMount() {
		window.addEventListener( "wordproof:webhook:failed", this.turnToggleOff, false );
		window.addEventListener( "wordproof:oauth:success", this.turnToggleOn, false );
	}

	componentWillUnmount() {
		window.removeEventListener( "wordproof:webhook:failed", this.turnToggleOff, false );
		window.removeEventListener( "wordproof:oauth:success", this.turnToggleOn, false );
	}

	/**
	 * Send new toggle value to onToggle function and open authentication
	 * if user is not authenticated.
	 *
	 * @param {boolean} value The new value.
	 *
	 * @returns {void} Returns nothing.
	 */
	handleToggle( value ) {
		if ( ! this.props.isAuthenticated && value ) {
			openAuthentication();
			return;
		}

		this.props.onToggle( value );
	}

	/**
	 * Turn on the toggle.
	 *
	 * @returns {void} Returns nothing.
	 */
	turnToggleOn() {
		this.props.onToggle( true );
	}

	/**
	 * Turn off the toggle.
	 *
	 * @returns {void} Returns nothing.
	 */
	turnToggleOff() {
		this.props.onToggle( false );
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
					linkText={ __( "Learn more about timestamping",
						"wordpress-seo" ) }
					linkTo={ "https://yoa.st/wordproof-integration" }
					htmlFor={ this.props.id }
					label={ __( "Timestamp with WordProof", "wordpress-seo" ) }
					hasNewBadge={ true }
				>
					<Toggle
						id={ this.props.id }
						labelText={ sprintf(
							/* Translators: %s translates to the Post type in singular form */
							__( "Timestamp this %s", "wordpress-seo" ),
							this.props.postTypeName.toLowerCase()
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

					{ ( ! this.props.isAuthenticated && this.props.isEnabled ) &&
						<Alert className={ "yoast-wordproof-metabox-alert" } type={ "info" }>{
							__( "Unable to create new timestamps. Please authenticate with WordProof.",
								"wordpress-seo" ) }
						</Alert>
					}

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
	onToggle: noop,
};

export default compose( [
	withSelect( ( select ) => {
		return {
			isAuthenticated: select( "wordproof" ).getIsAuthenticated(),
		};
	} ),
] )( WordProofTimestampToggle );
