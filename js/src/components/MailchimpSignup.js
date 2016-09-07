import React from "react";
import sendRequest from "yoast-components/composites/OnboardingWizard/helpers/ajaxHelper";
import RaisedButton from "material-ui/RaisedButton";

/**
 * @summary Mailchimp signup component.
 */
class MailchimpSignup extends React.Component {

	/**
	 * @summary Constructs the Mailchimp signup component.
	 *
	 * @param {object} props The properties.
	 */
	constructor( props ) {
		// Change the URL to work with json-p.
		super( props );
		let alreadySignedUpMessage = "You've already signed up for our newsletter, thank you!";
		let message = (
			this.props.value
		) ? alreadySignedUpMessage : "";

		this.state = {
			message,
			succesfulSignup: this.props.value,
		};

		// Set test mailing list.
		this.props.properties.mailchimpActionUrl = "http://yoast.us14.list-manage.com/subscribe/post-json?u=aa73c7380d2fd1a62d2c49aba&id=5b5b5f3b34";
	}

	/**
	 * @summary Execute a Mailchimp signup request.
	 *
	 * @returns {void}
	 */
	signup() {
		let email = this.refs.emailInput.value;
		let data = `EMAIL=${email}`;
		let name = this.props.properties.userName.trim();

		if(name !== ""){
			data = data + `&MERGE7=${encodeURIComponent(name)}`;
		}
		
		let headers = {};

		let result = sendRequest(
			this.props.properties.mailchimpActionUrl,
			{
				data,
				headers,
				dataType: "jsonp",
				jsonp: "c",
				method: "POST",
			}
		);
		this.handleResultSignup( result );
	}

	/**
	 * @summary Handles the result from a MailChimp signup.
	 *
	 * @param {Promise} result The promise from the signup request.
	 *
	 * @returns {void}
	 */
	handleResultSignup( result ) {
		result
			.then(
				( response ) => {
					if ( response.result === "error" ) {
						this.setState( {
							isLoading: false,
							succesfulSignup: false,
							message: this.stripMessage( response.msg ),
						} );
						this.sendChangeEvent();
					}
					else {
						this.setState( {
							isLoading: false,
							succesfulSignup: true,
							message: response.msg,
						} );
						this.sendChangeEvent();
					}
				} )
			.catch( ( response )=> {
				console.error( "MailChimp signup failed:", response );
			} );
	}

	/**
	 * @summary Strips "0 - " from the message string when present.
	 *
	 * @param {string} string The string to strip.
	 *
	 * @returns {string} String with the text.
	 */
	stripMessage( string ) {
		if ( string.endsWith( "0 - ", 4 ) ) {
			return string.slice( 4 );
		}
		return string;
	}

	/**
	 * @summary Triggers the onChange function in the Step component
	 *          to store the Mailchimp signup status.
	 *
	 * @returns {void}
	 */
	sendChangeEvent() {
		let evt = {
			target: {
				name: "mailchimpSignup",
				value: this.state.succesfulSignup,
			},
		};

		this.onChange( evt );
	}

	/**
	 * @summary Renders the MailChimp component.
	 *
	 * @returns {JSX.Element} Rendered Mailchimp Component.
	 */
	render() {
		this.onChange = this.props.onChange;

		let input = <input ref="emailInput" type="text" name={this.props.name}
		                   label="email"
		                   defaultValue={this.props.properties.currentUserEmail}/>;
		let button = <RaisedButton label='Sign Up!'
		                           onClick={this.signup.bind( this )}/>;
		let message = ( this.state.succesfulSignup )
			? <p className="yoast-wizard-mailchimp-message-success">{this.state.message}</p>
			: <p className="yoast-wizard-mailchimp-message-error">{this.state.message}</p>;
		return (
			<div>
				<h4>{this.props.properties.label}</h4>
				{message}
				{input}
				{button}
			</div>
		);
	}
}

MailchimpSignup.propTypes = {
	component: React.PropTypes.string,
	name: React.PropTypes.string.isRequired,
	properties: React.PropTypes.object,
	data: React.PropTypes.string,
	onChange: React.PropTypes.func,
	value: React.PropTypes.bool,

};

MailchimpSignup.defaultProps = {
	component: "",
	properties: {},
	data: "",
	value: false,
};

export default MailchimpSignup;
