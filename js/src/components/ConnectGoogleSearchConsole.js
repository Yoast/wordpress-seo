/* global yoastWizardConfig */

import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import { localize } from "yoast-components/utils/i18n";
import LoadingIndicator from "yoast-components/composites/OnboardingWizard/LoadingIndicator";

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
		// Make sure the props is an object and not an empty array.
		if ( typeof props.value.profileList !== "object" ) {
			props.value.profileList = {};
		}

		super( props );

		this.state = {
			isLoading: false,
			profileList: props.value.profileList,
			profile: props.value.profile,
			error: null,
			hasAccessToken: props.value.hasAccessToken,
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
		if ( profileListIsChanged || profileIsChanged ) {
			this.sendChangeEvent();
		}
	}

	/**
	 * Opens a dialog to get the Google Authentication code.
	 *
	 * @returns {Window} Returns instance of the created window.
	 */
	openGoogleAuthDialog() {
		let authUrl = yoastWizardConfig.gscAuthURL,
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
		this.postJSON(
			yoastWizardConfig.ajaxurl,
			{
				action: "wpseo_save_auth_code",
				ajax_nonce: yoastWizardConfig.gscNonce,
				authorization: jQuery( "#gsc_authorization_code" ).val(),
			},
			this.setProfileList.bind( this )
		);
	}

	/**
	 * @summary Sends a jQuery AJAX post request.
	 *
	 * @param {string}   url      The URL to post to.
	 * @param {object}   config   The parameters to send with the request.
	 * @param {function} callback The function to call after executing the request.
	 *
	 * @returns {void}
	 */
	postJSON( url, config, callback ) {
		this.startLoading();

		jQuery
			.post( url, config, callback, "json" )
			.done( ( response ) => {
				this.endLoading();

				return response;
			} )
			.fail( ( response ) => {
				this.endLoading();

				console.error( this.props.translate( "There is an error with the request." ), response );
			} );
	}

	/**
	 * Sets the isLoading state to true.
	 *
	 * @returns {void}
	 */
	startLoading() {
		this.setState( {
			isLoading: true,
		} );
	}

	/**
	 * Sets the isLoading state to false.
	 *
	 * @returns {void}
	 */
	endLoading() {
		this.setState( {
			isLoading: false,
		} );
	}

	/**
	 * @summary Clears the authorization code.
	 *
	 * @returns {void}
	 */
	clearAuthCode() {
		this.postJSON(
			yoastWizardConfig.ajaxurl,
			{
				action: "wpseo_clear_auth_code",
				ajax_nonce: yoastWizardConfig.gscNonce,
			},
			this.clear.bind( this )
		);
	}

	/**
	 * @summary Sends the data to the step component.
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
	 * @summary Clears the state.
	 *
	 * @returns {void}
	 */
	clear() {
		// Sets the profiles.
		this.setState( {
			profileList: null,
			profile: null,
			error: null,
			hasAccessToken: false,
		} );
	}

	/**
	 * @summary Sets the profile list.
	 *
	 * @param {Object|string} response                 The response object.
	 * @param {Object}        response.profileList     List with all available profiles.
	 * @param {bool}          response.hasAccessToken  Is there an access token?
	 *
	 * @returns {void}
	 */
	setProfileList( response ) {
		if ( response === "0" ) {
			return;
		}

		// Sets the profiles.
		this.setState( {
			profileList: response.profileList,
			hasAccessToken: response.hasAccessToken,
		} );
	}

	/**
	 * @summary Sets the profile.
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
	 * @summary Checks if there are any profiles available.
	 *
	 * @returns {boolean} Returns true when there are profiles and false if not.
	 */
	hasProfiles() {
		if ( this.state.profileList !== null && typeof this.state.profileList === "object" ) {
			return ( Object.keys( this.state.profileList ).length !== 0 );
		}

		return false;
	}

	/**
	 * @summary Creates a select box for selecting a Google Search Console Profile.
	 *
	 * @returns {JSX.Element} Profile select box wrapped in a div element.
	 */
	getProfileSelectBox() {
		if ( ! this.hasProfiles() ) {
			return (
				<p>{this.props.translate( "There were no profiles found" )}</p>
			);
		}

		let profiles = this.state.profileList;
		let profileKeys = Object.keys( profiles );

		return (
			<div className="yoast-wizard-input">
				<label
					className="yoast-wizard-text-input-label"
					htmlFor="yoast-wizard-gsc-select-profile">
					{this.props.translate( "Select profile" ) }
				</label>
				<select className="yoast-wizard-input__select"
						id="yoast-wizard-gsc-select-profile"
						onChange={this.setProfile.bind( this )}
						name={this.name} value={this.state.profile}>
					<option value="">{this.props.translate( "Choose a profile" )}</option>
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
			</div>
		);
	}

	/**
	 * Gets the input field option for the google authentication code.
	 *
	 * @returns {JSX.Element} Div element containing a description,
	 *                        input field and submit button.
	 */
	getGoogleAuthCodeInput() {
		return (
			<div>
				<p>
					{this.props.translate(
						"Enter your Google Authorization Code " +
						"and press the Authenticate button."
					)}
				</p>

				<input
					type="text"
					id="gsc_authorization_code"
					name="gsc_authorization_code"
					defaultValue=""
					placeholder={this.props.translate( "Enter authorization code here..." )}
					aria-labelledby="gsc-enter-code-label"
				/>
				<RaisedButton
					label={this.props.translate( "Authenticate" )}
					onClick={this.saveAuthCode.bind( this )}
				/>
			</div>
		);
	}

	/**
	 * @summary Renders the Google Search Console component.
	 *
	 * @returns {JSX.Element} The rendered Google Search Console component.
	 */
	render() {
		this.onChange = this.props.onChange;
		this.name = this.props.name;

		let loader = this.getLoadingIndicator();

		if ( this.state.hasAccessToken ) {
			let profileSelectBox = this.getProfileSelectBox();

			return (
				<div>
					{profileSelectBox}
					<RaisedButton
						label={this.props.translate( "Reauthenticate with Google" )}
						onClick={this.clearAuthCode.bind( this )}/>
					{loader}
				</div>
			);
		}

		return (
			<div>
				<p>{
					/* Translators: %s expands to Yoast SEO  */
					this.props.translate(
						"To allow %s to fetch your Google Search Console information, " +
						"please enter your Google Authorization Code. " +
						"Clicking the button below will open a new window."
					).replace( "%s", "Yoast SEO" )}
				</p>
				<RaisedButton
					label={this.props.translate( "Get Google Authorization Code" )}
					primary={true}
					onClick={this.openGoogleAuthDialog.bind( this )}/>
				{this.getGoogleAuthCodeInput()}
				{loader}
			</div>
		);
	}

	/**
	 * Gets the loading indicator.
	 *
	 * @returns {null|JSX.Element} The loading indicator.
	 */
	getLoadingIndicator() {
		if ( ! this.state.isLoading ) {
			return null;
		}

		return (
			<div className="yoast-wizard-overlay"><LoadingIndicator/></div>
		);
	}

}

ConnectGoogleSearchConsole.propTypes = {
	translate: React.PropTypes.func.isRequired,
	component: React.PropTypes.string,
	data: React.PropTypes.string,
	value: React.PropTypes.shape( {
		profileList: React.PropTypes.oneOfType( [
			React.PropTypes.object,
			React.PropTypes.array,
		] ),

		profile: React.PropTypes.string,
		hasAccessToken: React.PropTypes.bool,
	} ),
	onChange: React.PropTypes.func,
	name: React.PropTypes.string,
};

ConnectGoogleSearchConsole.defaultProps = {
	component: "",
	data: "",
	value: "",
};

export default localize( ConnectGoogleSearchConsole );
