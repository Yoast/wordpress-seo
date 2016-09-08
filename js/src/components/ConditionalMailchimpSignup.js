import React from "react";
import MailchimpSignup from "./MailchimpSignup";

/**
 * @summary Mailchimp signup component.
 */
class ConditionalMailchimpSignup extends React.Component {

	/**
	 * @summary Constructs the Mailchimp signup component.
	 *
	 * @param {object} props The properties.
	 */
	constructor( props ) {
		// Change the URL to work with json-p.
		super( props );
		console.log("custom mailchimp signup", this.props.stepState);

		this.state = {
			signedUp: this.props.stepState.fieldValues.intro.mailChimpSignup,
		};
	}

	render() {
		console.log(this.state.signedUp);

		return (
			<div>
				<h2>TEST</h2>
			</div>
		);

	}
}

export default ConditionalMailchimpSignup;
