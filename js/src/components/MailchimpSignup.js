import React from "react";
import TextField from "yoast-components/forms/composites/Textfield";
import sendRequest from "yoast-components/composites/OnboardingWizard/helpers/ajaxHelper";
import RaisedButton from 'material-ui/RaisedButton';

/**
 * Represents a mailchimg signup interface.
 *
 * @param {Object} props The properties for the object.
 * @returns {JSX} The mailchimg signup component.
 * @constructor
 */
class MailchimpSignup extends React.Component {

	constructor(props){
		// Change the URL to work with json-p.
		super(props);
		// Test mailing list.
		this.props.properties.mailchimpActionUrl = "http://yoast.us14.list-manage.com/subscribe/post-json?u=aa73c7380d2fd1a62d2c49aba&id=5b5b5f3b34";

// Live yoast mailing list
//		this.props.properties.mailchimpActionUrl = "http://yoast.us1.list-manage1.com/subscribe/post-json?u=ffa93edfe21752c921f860358&id=972f1c9122";
	}

	signup(){
		let email = this.refs.emailInput.value;
		let data = `EMAIL=${email}`;
		let headers = {};

		let result = sendRequest(this.props.properties.mailchimpActionUrl, data, headers, "jsonp", "POST");

		result
			.then(
				( response ) => {
					if ( response.result === "error" ) {
						console.log( "MailChimp signup warning:" + response.msg );
					}
					else {
						this.handleSuccesfulRequest( response );
					}
				} )
			.catch( (response)=> {
					console.error("MailChimp signup failed:", response);
			} );
	}

	handleSuccesfulRequest(response){
		console.log(response);
	}

	render() {
		return (
			<div>
				<h2>{this.props.properties.label}</h2>
				<input ref="emailInput" type="text" name={this.props.name} label="email"
				           defaultValue={this.props.properties.currentUserEmail}
				           />
				<RaisedButton label='Sign Up!'
				              onClick={this.signup.bind(this)}/>
			</div>
		);
	}
}

MailchimpSignup.propTypes = {
	component: React.PropTypes.string,
	name: React.PropTypes.string.isRequired,
	properties: React.PropTypes.object,
	data: React.PropTypes.string,
	email: React.PropTypes.string,
	onChange: React.PropTypes.func,
};

MailchimpSignup.defaultProps = {
	email: "",
	component: "",
	name: "",
	properties: {},
	data: "",
};

export default MailchimpSignup;
