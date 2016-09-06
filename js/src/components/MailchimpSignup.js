import React from "react";
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

		this.state = {
			message: this.props.message,
		};

		// Test mailing list.
		this.props.properties.mailchimpActionUrl = "http://yoast.us14.list-manage.com/subscribe/post-json?u=aa73c7380d2fd1a62d2c49aba&id=5b5b5f3b34";

// Live yoast mailing list
//		this.props.properties.mailchimpActionUrl = "http://yoast.us1.list-manage1.com/subscribe/post-json?u=ffa93edfe21752c921f860358&id=972f1c9122";
	}

	signup(){
		let email = this.refs.emailInput.value;
		let data = `EMAIL=${email}`;
		let headers = {};

		this.setState({
			isLoading : true,
			succesfulSignup : false,
		});

		let result = sendRequest(
			this.props.properties.mailchimpActionUrl,
			{
				data,
				headers,
				dataType: "jsonp",
				jsonp: "c", // trigger MailChimp to return a JSONP response
				method: "POST"
			}
		);

		result
			.then(
				( response ) => {
					if ( response.result === "error" ) {
						console.log( "MailChimp signup warning:" + response.msg );
						this.setState({
							isLoading : false,
							succesfulSignup : false,
							message: response.msg,
						});
					}
					else {
						this.setState({
							isLoading : false,
							succesfulSignup : true,
							message: response.msg,
						});
					}
				} )
			.catch( (response)=> {
					console.error("MailChimp signup failed:", response);
			} );
	}

	render() {
		let input = <input ref="emailInput" type="text" name={this.props.name}
		                   label="email"
		                   defaultValue={this.props.properties.currentUserEmail}/>;
		let button = <RaisedButton label='Sign Up!'
		                           onClick={this.signup.bind( this )}/>;
		let message = (this.state.succesfulSignup
		               && typeof this.state.email !== "undefined") ?
			<p className="yoast-wizard-mailchimp-message-error">{this.state.message}</p> :
			<p className="yoast-wizard-mailchimp-message-success">{this.state.message}</p>;

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
	message: React.PropTypes.string,
	onChange: React.PropTypes.func,
};

MailchimpSignup.defaultProps = {
	message: "",
	component: "",
	name: "",
	properties: {},
	data: "",
};

export default MailchimpSignup;
