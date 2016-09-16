/* global yoastWizardConfig */

import React from "react";
import RaisedButton from "material-ui/RaisedButton";
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
		if( typeof props.value.profileList !== "object" ) {
			props.value.profileList = {};
		}

		super( props );

		this.state = {
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
		let url = yoastWizardConfig.ajaxurl;
		let config = {
			action: "wpseo_save_auth_code",
			ajax_nonce: yoastWizardConfig.gscNonce,
			authorization: jQuery( "#gsc_authorization_code" ).val(),
		};
		let callback = this.setProfileList.bind( this );
		let dataType = "json";

		this.sendJQueryAJAXrequest( url, config, callback, dataType );
	}

	sendJQueryAJAXrequest( url, config, callback, dataType ) {
		let newState = this.getLoadingState( true );
		this.setState( newState );

		jQuery.post( url, config, callback, dataType )
		   .done( ( response ) => {
			    newState = this.getLoadingState( false );
			    this.setState(
				    newState
			    );
			    return response;
		     }
		      )
		      .fail( ( response ) => {
			    console.log( response );
		     } );
	}


	/**
	 * Gets a new state object with the loading state added to it.
	 *
	 * @param {bool} isLoading Is the google search console loading.
	 *
	 * @returns {object} Returns the current state object with the isLoading variable added.
	 */
	getLoadingState( isLoading ) {
		let currentState = this.state;

		if( currentState.isLoading === true && isLoading === false ) {
			currentState.isLoading = false;
			return currentState;
		}

		let newState = {
			isLoading
		};

		Object.assign( newState, currentState );
		return newState;
	}

	/**
	 * @summary Clears the authorization code.
	 *
	 * @returns {void}
	 */
	clearAuthCode() {
		let url = yoastWizardConfig.ajaxurl;
		let config = {
			action: "wpseo_clear_auth_code",
			ajax_nonce: yoastWizardConfig.gscNonce,
		};
		let callback = this.clear.bind( this );
		let dataType = "json";

		this.sendJQueryAJAXrequest( url, config, callback, dataType );
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
			hasAccessToken: false
		} );
	}

	/**
	 * @summary Sets the profile list.
	 *
	 * @param {Object|string} response			       The response object.
	 * @param {Object}        response.profileList     List with all available profiles.
	 * @param {bool}          response.hasAccessToken  Is there an access token?
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
		if( this.state.profileList !== null && typeof this.state.profileList === "object" ) {
			var totalProfiles = Object.keys( this.state.profileList ).length;

			return ( totalProfiles !== 0 );
		}

		return false;
	}

	/**
	 * @summary Creates a select box for selecting a Google Analytics Profile
	 * that is needed for the Google search console.
	 *
	 * @returns {JSX.Element} Profile select box wrapped in a div element.
	 */
	getProfileSelectBox() {
		let profiles    = this.state.profileList;
		let profileKeys = Object.keys( profiles );

		return <div>
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
		</div>;
	}

	getGoogleAuthCodeInput() {
		return <div>
			<p>
				Enter your Google Authorization Code and press the Authenticate button.
			</p>

			<input type="text" id="gsc_authorization_code" name="gsc_authorization_code" defaultValue=""
			       placeholder="Authorization code" aria-labelledby="gsc-enter-code-label" />
			<RaisedButton label="Authenticate" onClick={this.saveAuthCode.bind( this )} />
		</div>;
	}

	/**
	 * @summary Renders the Google Search Console component.
	 *
	 * @returns {JSX.Element} The rendered Google Search Console component.
	 */
	render() {
		this.onChange = this.props.onChange;
		this.name = this.props.name;
		let profiles = ( this.hasProfiles() )
			? this.getProfileSelectBox()
			: <p>There were no profiles found</p>;

		if( this.state.hasAccessToken ) {
			return (
				<div>
					{profiles}
					<RaisedButton label="Reauthenticate with Google" onClick={this.clearAuthCode.bind( this )} />
					{( this.state.isLoading ) ? <div className="yoast-wizard-overlay"><LoadingIndicator/></div> : null}
				</div>
			);
		}

		return (
			<div>
				<p>
					To allow Yoast SEO to fetch your Google Search Console information, please enter your Google
					Authorization Code. Clicking the button below will open a new window.
				</p>
				<RaisedButton label="Get Google Authorization Code" primary={true} onClick={this.openGoogleAuthDialog.bind( this )} />
				{this.getGoogleAuthCodeInput()}
				{( this.state.isLoading ) ? <div className="yoast-wizard-overlay"><LoadingIndicator/></div> : null}
			</div>
		);
	}

}

ConnectGoogleSearchConsole.propTypes = {
	component: React.PropTypes.string,
	data: React.PropTypes.string,
	value: React.PropTypes.shape( {
		profileList: React.PropTypes.oneOfType( [
			React.PropTypes.object,
			React.PropTypes.array
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

export default ConnectGoogleSearchConsole;
