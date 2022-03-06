/* eslint-disable require-jsdoc */
import { Component, Fragment, useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { Toggle, FieldGroup } from "@yoast/components";
import { __, sprintf } from "@wordpress/i18n";
import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import { get, noop } from "lodash";
import { openAuthentication, openSettings } from "../helpers/wordproof";

/**
 * The settings link.
 *
 * @param {Object} props The props object.
 * @returns {JSX.Element} The settings link.
 */
const SettingsLink = ( props ) => {
	if ( ! props.isAuthenticated ) {
		return ( <></> );
	}

	const url = get( window, "wordproofSdk.data.popup_redirect_settings_url",
		{} );

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
 * @param {object} props Functional Component props.
 * @returns {JSX.Element|string} The authentication link.
 * @constructor
 */
const AuthenticationLink = ( props ) => {
	const openLink = useCallback( event => {
		event.preventDefault();
		openAuthentication();
	} );

	const url = get( window,
		"wordproofSdk.data.popup_redirect_authentication_url", {} );

	if ( ! props.isAuthenticated && props.toggleIsEnabled ) {
		return (
			<a
				href={ url } onClick={ openLink }
			>{ __( "Authenticate with WordProof", "wordpress-seo" ) }</a>
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

		const eventsToDisableToggle = [
			"wordproof:webhook:failed",
		];

		eventsToDisableToggle.forEach( event => {
			window.addEventListener( event, () => {
				this.props.onToggle( false );
			}, false );
		} );

		window.addEventListener( "wordproof:oauth:success", () => {
			this.props.onToggle( true );
		}, false );
	}

	handleToggle( value ) {
		if ( ! this.props.isAuthenticated && value ) {
			openAuthentication();
			return;
		}

		this.props.onToggle( value );
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
					<div className={ `${ this.props.isAuthenticated ? "" : "yoast-toggle--grayed"}` }>
						<Toggle
							className={ "yoast-field-group__radiobutton" }
							id={ this.props.id }
							labelText={ sprintf(
								/* Translators: %s translates to the Post type in singular form */
								__( "Timestamp this %s", "wordpress-seo" ),
								this.props.postTypeName.toLowerCase()
							) }
							isEnabled={ this.props.isEnabled }
							onSetToggleState={ this.handleToggle }
						/>
					</div>

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
	onToggle: noop
};

export default compose( [
	withSelect( ( select ) => {
		return {
			isAuthenticated: select( "wordproof" ).getIsAuthenticated(),
		};
	} ),
] )( WordProofTimestampToggle );
