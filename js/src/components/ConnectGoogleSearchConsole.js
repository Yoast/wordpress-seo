
import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';

/**
 * Represents a Google search console interface.
 *
 * @param {Object} props The properties for the object.
 * @returns {JSX} The ConnectGoogleSearchConsole component.
 * @constructor
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
			profileList: props.value.profiles,
			profile: props.value.profile,
			error: null
		}
	}

	/**
	 * Opens a dialog to get the Google Authentication code.
	 *
	 * @returns {Window}
	 */
	openGoogleAuthDialog() {
		var auth_url = yoastWizardConfig.gscAuthURL,
			w = 600,
			h = 500,
			left = ( screen.width / 2 ) - ( w / 2 ),
			top = ( screen.height / 2 ) - ( h / 2 );

		return window.open( auth_url, "wpseogscauthcode", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left );
	}

	/**
	 * Saves the authorization code.
	 */
	saveAuthCode() {
		jQuery.post(
			yoastWizardConfig.ajaxurl,
			{
				action: "wpseo_save_auth_code",
				ajax_nonce: yoastWizardConfig.gscNonce,
				authorization: jQuery( "#gsc_authorization_code" ).val()
			},
			this.setProfileList.bind( this ),
			'json'
		)
	}

	clearAuthCode() {

		jQuery.post(
			yoastWizardConfig.ajaxurl,
			{
				action: "wpseo_clear_auth_code",
				ajax_nonce: yoastWizardConfig.gscNonce
			},
			this.clear.bind( this ),
			'json'
		);
	}


	sendChangeEvent() {
		let changeEvent = {
			target: {
				name: this.name,
				value: {
					profileList: this.state.profileList,
					profile: this.state.profile,
					error: this.state.error
				}
			}
		};

		this.onChange(changeEvent);
	}

	clear() {
		// Sets the profiles.
		this.setState( {
			profileList: null,
			profile: null,
			error: null
		} );

		this.sendChangeEvent();
	}

	/**
	 *
	 * @param {Object|string} response
	 * @param {Object}        response.profiles
	 * @param {string}        response.profile
	 */
	setProfileList( response ) {
		if( response === '0' ) {
			return;
		}

		// Sets the profiles.
		this.setState( {
			profileList: response.profiles,
		} );

		this.sendChangeEvent();
	}

	/**
	 *
	 * @param {Object|string} response
	 * @param {Object}        response.profiles
	 * @param {string}        response.profile
	 */
	setProfile( ev ) {
		// Sets the profiles.
		console.log("yolo", ev.target.value)
		this.setState( {
			profile: ev.target.value
		} );

		this.sendChangeEvent();
	}

	/**
	 *
	 * @param {Object|string} response
	 * @param {Object}        response.profiles
	 * @param {string}        response.profile
	 */
	setError( errorMessage ) {
		// Sets the profiles.
		this.setState( {
			error: errorMessage
		} );

		this.sendChangeEvent();
	}

	/**
	 * Checks if there are any profiles available.
	 * @returns {boolean}
	 */
	hasProfiles() {
		if( typeof this.state.profileList === "object" ) {
			var totalProfiles = Object.keys( this.state.profileList ).length;

			return ( totalProfiles !== 0 );
		}

		return false;
	}

	/**
	 * Renders the Google Search Console component.
	 *
	 * @returns {XML}
	 */
	render() {
		this.onChange = this.props.onChange;
		this.name = this.props.name;

		if( this.hasProfiles() ) {
			let profile     = this.state.profile;
			let profiles    = this.state.profileList;
			let profileKeys = Object.keys( profiles );

			return (
				<div>
					<select onChange={this.setProfile.bind(this)} name={this.props.name}>
						<option value="">Choose a profile</option>
						{ profileKeys.map(
							( profileKey, index ) => {
								let isChecked = ( profile === profileKey ) ? 'true' : 'false';

								return (
									<option checked={isChecked} value={profileKey} key={index}>
										{ profiles[ profileKey ] }
									</option>
								);
							}
						) }
					</select>

					<RaisedButton label='Reauthenticate with Google' onClick={this.clearAuthCode.bind(this)} />
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

					<input type="text" id="gsc_authorization_code" name="gsc[authorization_code]" defaultValue="" placeholder="Authorization code" aria-labelledby="gsc-enter-code-label" />
					<RaisedButton label='Authenticate' onClick={this.saveAuthCode.bind(this)} />
				</div>
			</div>
		);
	}

	renderSelectOption( index, value ) {



		return '';
	}
}

ConnectGoogleSearchConsole.propTypes = {
	component: React.PropTypes.string,
	data: React.PropTypes.string,
};

ConnectGoogleSearchConsole.defaultProps = {
	component: "",
	data: "",
};

export default ConnectGoogleSearchConsole;
