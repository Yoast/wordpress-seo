/* global yoastWizardConfig */

import React from "react";
import RaisedButton from "material-ui/RaisedButton";

/**
 * Represents a Google search console interface.
 */
class ConnectGoogleSearchConsole extends React.Component {

	/**
	 * Sets the default state.
	 *
	 * @param {Object} props The properties to use.
	 */
	constructor( props ) {
		super();

		this.state = {
			profileList: props.value.profileList,
			profile: props.value.profile,
			error: null,
		};
	}

	/**
	 * When the component is rendered and something has been changed, just send the renewed data to the step object.
	 *
	 * @param {Object} prevProps The previous props. Unused.
	 * @param {Object} prevState The previous state.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps, prevState ) {
		let profileListIsChanged = prevState.profileList !== this.state.profileList;
		let profileIsChanged = prevState.profile !== this.state.profile;
		if( profileListIsChanged || profileIsChanged  ) {
			this.sendChangeEvent();
		}
	}

	/**
	 * Opens a dialog to get the Google Authentication code.
	 *
	 * @returns {Window} Returns instance of the created window.
	 */
	openGoogleAuthDialog() {
		var authUrl = yoastWizardConfig.gscAuthURL,
			w = 600,
			h = 500,
			left = ( screen.width / 2 ) - ( w / 2 ),
			top = ( screen.height / 2 ) - ( h / 2 );

		return window.open(
			authUrl,
			"wpseogscauthcode",
			"toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, " +
			"copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left
		);
	}

	/**
	 * Saves the authorization code.
	 *
	 * @returns {void}
	 */
	saveAuthCode() {
		jQuery.post(
			yoastWizardConfig.ajaxurl,
			{
				action: "wpseo_save_auth_code",
				ajax_nonce: yoastWizardConfig.gscNonce,
				authorization: jQuery( "#gsc_authorization_code" ).val(),
			},
			this.setProfileList.bind( this ),
			"json"
		);
	}

	/**
	 * Clears the authorization code.
	 *
	 * @returns {void}
	 */
	clearAuthCode() {
		jQuery.post(
			yoastWizardConfig.ajaxurl,
			{
				action: "wpseo_clear_auth_code",
				ajax_nonce: yoastWizardConfig.gscNonce,
			},
			this.clear.bind( this ),
			"json"
		);
	}

	/**
	 * Sends the data to the step component.
	 *
	 * @returns {void}
	 */
	sendChangeEvent() {
		let changeEvent = {
			target: {
				name: this.name,
				value: {
					profileList: this.state.profileList,
					profile: this.state.profile,
					error: this.state.error,
				},
			},
		};

		this.onChange( changeEvent );
	}

	/**
	 * Clears the state.
	 *
	 * @returns {void}
	 */
	clear() {
		// Sets the profiles.
		this.setState( {
			profileList: null,
			profile: null,
			error: null,
		} );
	}

	/**
	 * Sets the profile list.
	 *
	 * @param {Object|string} response			   The response object.
	 * @param {Object}        response.profileList List with all available profiles.
	 *
	 * @returns {void}
	 */
	setProfileList( response ) {
		if( response === "0" ) {
			return;
		}

		// Sets the profiles.
		this.setState( {
			profileList: response.profileList,
		} );
	}

	/**
	 * Sets the profile.
	 *
	 * @param {Event} evt The event object.
	 *
	 * @returns {void}
	 */
	setProfile( evt ) {
		this.setState( {
			profile: evt.target.value,
		} );
	}

	/**
	 * Sets the error message.
	 *
	 * @param {string} errorMessage The error message.
	 *
	 * @returns {void}
	 */
	setError( errorMessage ) {
		// Sets the profiles.
		this.setState( {
			error: errorMessage,
		} );
	}

	/**
	 * Checks if there are any profiles available.
	 *
	 * @returns {boolean} Returns true when there are profiles and false if not.
	 */
	hasProfiles() {
		if( this.state.profileList !== null && typeof this.state.profileList === "object" ) {
			var totalProfiles = Object.keys( this.state.profileList ).length;

			return ( totalProfiles !== 0 );
		}

		return false;
	}

	/**
	 * Renders the Google Search Console component.
	 *
	 * @returns {XML} The HTML of the rendered component.
	 */
	render() {
		this.onChange = this.props.onChange;
		this.name = this.props.name;

		if( this.hasProfiles() ) {
			let profiles    = this.state.profileList;
			let profileKeys = Object.keys( profiles );

			return (
				<div>
					<select onChange={this.setProfile.bind( this )} name={this.name} value={this.state.profile}>
						<option value="">Choose a profile</option>
						{ profileKeys.map(
							( profileKey, index ) => {
								return (
									<option value={profileKey} key={index}>
										{ profiles[ profileKey ] }
									</option>
								);
							}
						) }
					</select>

					<RaisedButton label='Reauthenticate with Google' onClick={this.clearAuthCode.bind( this )} />
				</div>
			);
		}

		return (
			<div>
				<p>
					To allow Yoast SEO to fetch your Google Search Console information, please enter your Google
					Authorization Code. Clicking the button below will open a new window.
				</p>
				<div>
					<RaisedButton label='Get Google Authorization Code' primary={true} onClick={this.openGoogleAuthDialog.bind( this )} />
				</div>

				<div>
					<p>
						Enter your Google Authorization Code and press the Authenticate button.
					</p>

					<input type="text" id="gsc_authorization_code" name="gsc_authorization_code" defaultValue=""
						placeholder="Authorization code" aria-labelledby="gsc-enter-code-label" />
					<RaisedButton label='Authenticate' onClick={this.saveAuthCode.bind( this )} />
				</div>
			</div>
		);
	}

}

ConnectGoogleSearchConsole.propTypes = {
	component: React.PropTypes.string,
	data: React.PropTypes.string,
	value: React.PropTypes.shape( {
		profileList: React.PropTypes.object,
		profile: React.PropTypes.string,
	} ),
	onChange: React.PropTypes.func,
	name: React.PropTypes.string,
};

ConnectGoogleSearchConsole.defaultProps = {
	component: "",
	data: "",
};

export default ConnectGoogleSearchConsole;
