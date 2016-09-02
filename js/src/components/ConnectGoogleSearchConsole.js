
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

		console.log( props );

		this.state = {
			auth_code: false,
			data: props.data
		};
	}

	setAuthCode( evt ) {
		console.log( 1233 );
		this.setState( {
			auth_code: true
		} )
	}

	clearAuthCode() {
		this.setState( { auth_code: false } );
	}

	render() {

		if( this.state.auth_code ) {
			return (
				<div>
					Lekker dingetje kiezen
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
					<RaisedButton label='Get Google Authorization Code' primary={true} />
				</div>

				<div>
					<p>
						Enter your Google Authorization Code and press the Authenticate button.
					</p>

					<input type="text" name="gsc[authorization_code]" defaultValue="" placeholder="Authorization code" aria-labelledby="gsc-enter-code-label" />
					<input type="hidden" name="gsc[gsc_nonce]" value="297c951ef9" />
					<RaisedButton label='Reauthenticate' onClick={this.setAuthCode.bind(this)} />
				</div>
			</div>
		);
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
