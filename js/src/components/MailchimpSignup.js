import React from "react";
import sendRequest from "yoast-components/composites/OnboardingWizard/helpers/ajaxHelper";
import RaisedButton from "material-ui/RaisedButton";
import { localize } from "yoast-components/utils/i18n";
import IconMailOutline from "material-ui/svg-icons/communication/mail-outline";
import LoadingIndicator from "yoast-components/composites/OnboardingWizard/LoadingIndicator";
import colors from "yoast-components/style-guide/colors.json";

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
			successfulSignup: this.props.value,
			isLoading: false,
		};
	}

	/**
	 * Sends the change event, because the component is updated.
	 *
	 * @param {Object} prevProps The previous props.
	 * @param {Object} prevState The previous state.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps, prevState ) {
		let successfulSignup = this.state.successfulSignup !== prevState.successfulSignup;

		if ( successfulSignup ) {
			this.sendChangeEvent();
		}
	}

	/**
	 * Checks if current component has a subscription already.
	 *
	 * @returns {boolean} Returns true if the user is already signed-up.
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
			data = data + `&NAME=${encodeURIComponent( name )}`;
		}
		this.setState( {
			isLoading: true,
		} );
		let result = sendRequest(
			this.props.properties.mailchimpActionUrl,
			{
				data,
				headers: {},
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
	 * @returns {void} Returns nothing.
	 */
	handleResultSignup( result ) {
		result
			.then(
				( response ) => {
					if ( response.result === "error" ) {
						this.setState( {
							isLoading: false,
							successfulSignup: false,
							message: this.stripMessage( this.stripLinkFromMessage( response.msg ) ),
						} );
						return;
					}
					this.setState( {
						isLoading: false,
						successfulSignup: true,
						message: response.msg,
					} );
				} )
			.catch( ( response ) => {
				console.error( this.props.translate( "MailChimp signup failed:" ), response );
			} );
	}

	/**
	 * Strips an HTML link element from the message string.
	 *
	 * @param {string} message The message string.
	 *
	 * @returns {string} The message string without a link element.
	 */
	stripLinkFromMessage( message ) {
		return message.replace( /<a.*?<\/a>/, "" );
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

	/**
	 * @summary Renders the Mailchimp component.
	 *
	 * @returns {JSX.Element} Rendered Mailchimp Component.
	 */
	render() {
		if ( this.skipRendering() ) {
			return null;
		}

		this.onChange = this.props.onChange;

		let input = <input
			id="mailchimpEmail"
			className="yoast-wizard-text-input-field"
			ref="emailInput"
			type="text"
			name={this.props.name}
			defaultValue={this.props.properties.currentUserEmail}
		/>;
		let button = <RaisedButton
			primary={true}
			label={this.props.translate( "Sign Up!" )}
			onClick={this.signup.bind( this )}
			icon={ <IconMailOutline color="#ffffff" viewBox="0 0 28 28"/> }
		/>;
		let message = this.getSignupMessage();
		let loader = this.getLoadingIndicator();

		return (
			<div className="yoast-wizard--columns yoast-wizard-newsletter">
				<div>
					<h2 className="yoast-wizard-newsletter--header"><IconMailOutline
						color={ colors.$palette_pink_dark }/>{this.props.properties.title}</h2>
					<p>{this.props.properties.label}</p>
					<div className="yoast-wizard--columns yoast-wizard--columns__even">
						<div className="yoast-wizard-text-input">
							<label
								htmlFor="mailchimpName"
								className="yoast-wizard-text-input-label">
								{this.props.translate( "Name" )}
							</label>
							<input
								id="mailchimpName"
								className="yoast-wizard-text-input-field"
								ref="nameInput"
								type="text"
								name="name"
								defaultValue={this.props.properties.userName}/>
						</div>
						<div className="yoast-wizard-text-input">
							<label
								htmlFor="mailchimpEmail"
								className="yoast-wizard-text-input-label">
								{this.props.translate( "Email" )}
							</label>
							{input}
						</div>
					</div>
					{button}
					{message}
					{loader}
				</div>
				<div className="hide-on-tablet yoast-wizard-newsletter--decoration">
					<img src={this.props.properties.decoration}/>
				</div>
			</div>
		);
	}

	/**
	 * When the last step is success and the user has already give his email address.
	 *
	 * @returns {boolean} Returns if the user is already signed up and
	 *                    component should be rendered.
	 */
	skipRendering() {
		let stepState = this.props.stepState;
		let isCurrentStepSuccess = (
			stepState.currentStep === "success"
		);
		let hasMailchimpSignup = (
			stepState.fieldValues.newsletter.mailchimpSignup.hasSignup === true
		);

		return (
			isCurrentStepSuccess && hasMailchimpSignup
		);
	}

	/**
	 * Renders the message after sign-up.
	 *
	 * @returns {JSX.Element} A HTML paragraph element containing the Mailchimp response.
	 */
	getSignupMessage() {
		if ( this.state.successfulSignup ) {
			return <p className="yoast-wizard-mailchimp-message-success" aria-live="assertive">{this.state.message}</p>;
		}

		return <p className="yoast-wizard-mailchimp-message-error" aria-live="assertive">{this.state.message}</p>;
	}
}

MailchimpSignup.propTypes = {
	translate: React.PropTypes.func.isRequired,
	title: React.PropTypes.string,
	component: React.PropTypes.string,
	name: React.PropTypes.string.isRequired,
	properties: React.PropTypes.object,
	data: React.PropTypes.string,
	onChange: React.PropTypes.func,
	value: React.PropTypes.shape(
		{
			hasSignup: React.PropTypes.bool,
		}
	),
	stepState: React.PropTypes.object,
};

MailchimpSignup.defaultProps = {
	title: "Mailchimp signup",
	component: "",
	properties: {},
	data: "",
	value: {
		hasSignup: false,
	},
};

export default localize( MailchimpSignup );
