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
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		// Change the URL to work with json-p.
		super( props );

		this.state = {
			message: this.getMessage(),
			successfulSignup: this.props.value,
		};
	}

	/**
	 * Sends the change event, because the component is updated.
	 *
	 * @param {Object} prevProps
	 * @param {Object} prevState
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps, prevState ) {
		let successfulSignup = this.state.successfulSignup !== prevState.successfulSignup;

		if( successfulSignup ) {
			this.sendChangeEvent();
		}
	}

	/**
	 * Gets a message when the user has subscribed to the newsletter before.
	 *
	 * @returns {string} The message if applicable otherwise an empty string.
	 */
	getMessage() {
		if( this.hasSubscription() ) {
			return "You've already signed up for our newsletter, thank you! If you'd like you can sign up with " +
				"another email address.";
		}

		return "";
	}

	/**
	 * Checks if current component has a subscription already.
	 *
	 * @returns {boolean}
	 */
	hasSubscription() {
		return this.props.value.hasSignup;
	}

	/**
	 * @summary Execute a Mailchimp signup request.
	 *
	 * @returns {void}
	 */
	signup() {
		let email = this.refs.emailInput.value;
		let data = `EMAIL=${email}`;
		let name = this.refs.nameInput.value.trim();

		if ( name !== "" ) {
			// MERGE7 = the name field in the Yoast newsletter signup form.
			data = data + `&MERGE7=${encodeURIComponent( name )}`;
		}

		let result = sendRequest(
			this.props.properties.mailchimpActionUrl,
			{
				data,
				headers : {},
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
							successfulSignup: false,
							message: this.stripMessage( response.msg ),
						} );

						this.setSubscription();

						return;
					}

					this.setState( {
						isLoading: false,
						successfulSignup: true,
						message: response.msg,
					} );
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
				value: {
					hasSignup: this.state.successfulSignup,
				},
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
		if( this.skipRendering() ) {
			return null;
		}

		this.onChange = this.props.onChange;

		let input = <input id="mailchimpEmail"
		                   ref="emailInput"
		                   type="text"
		                   name={this.props.name}
		                   label="email"
		                   defaultValue={this.props.properties.currentUserEmail}
		/>;
		let button = <RaisedButton label='Sign Up!' onClick={this.signup.bind( this )}/>;
		let message = this.getSignupMessage();

		return (
			<div>
				<h4>{this.props.properties.label}</h4>
				<div className="yoast-wizard-text-input">
					<label htmlFor="mailchimpName"
					       className="yoast-wizard-text-input-label">
						Name
					</label>
					<input id="mailchimpName"
					       ref="nameInput"
					       type="text"
					       name="name"
					       label="name"
					       defaultValue={this.props.properties.userName}/>
				</div>
				<div className="yoast-wizard-text-input">
					<label htmlFor="mailchimpEmail" className="yoast-wizard-text-input-label">Email</label>
					{input}
				</div>
				{button}
				{message}
			</div>
		);
	}

	/**
	 * When the last step is success and the user has already give his email address.
	 *
	 * @returns {boolean}
	 */
	skipRendering() {
		let stepState            = this.props.stepState;
		let isCurrentStepSuccess = ( stepState.currentStep === "success" );
		let hasMailchimpSignup   = ( stepState.fieldValues.intro.mailchimpSignup.hasSignup === true );

		return ( isCurrentStepSuccess && hasMailchimpSignup );
	}

	/**
	 * Renders the message after signup.
	 *
	 * @returns {XML}
	 */
	getSignupMessage() {
		if( this.state.successfulSignup ) {
			return <p className="yoast-wizard-mailchimp-message-success">{this.state.message}</p>;
		}

		return <p className="yoast-wizard-mailchimp-message-error">{this.state.message}</p>;
	}
}

MailchimpSignup.propTypes = {
	component: React.PropTypes.string,
	name: React.PropTypes.string.isRequired,
	properties: React.PropTypes.object,
	data: React.PropTypes.string,
	onChange: React.PropTypes.func,
	value: React.PropTypes.shape(
		{
			hasSignup : React.PropTypes.bool
		}
	),
	stepState: React.PropTypes.object
};

MailchimpSignup.defaultProps = {
	component: "",
	properties: {},
	data: "",
	value: {
		hasSignup: false,
	},
};

export default MailchimpSignup;
