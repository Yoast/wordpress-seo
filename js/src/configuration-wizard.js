// Required for browser compatibility.
import "babel-polyfill";

/* global yoastWizardConfig */
import React from "react";
import ReactDOM from "react-dom";

// Required to make Material UI work with touch screens.
import injectTapEventPlugin from "react-tap-event-plugin";
import { OnboardingWizard } from "yoast-components";

import MailchimpSignup from "./components/MailchimpSignup";
import ConfigurationChoices from "./components/ConfigurationChoices";
import ConnectGoogleSearchConsole from "./components/ConnectGoogleSearchConsole";
import MediaUpload from "./components/MediaUpload";
import Suggestions from "./components/Suggestions";
import FinalStep from "./components/FinalStep";

import { setTranslations } from "yoast-components/utils/i18n";
import isUndefined from "lodash/isUndefined";

if ( ! isUndefined( yoastWizardConfig.translations ) ) {
	setTranslations( yoastWizardConfig.translations );
}

injectTapEventPlugin();

class App extends React.Component {

	/**
	 * Constructs the App component.
	 *
	 * @param {object} props The properties.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isLoading: true,
		};

		this.getConfig();
	}

	/**
	 * @summay Gets the endpoint configuration from the global yoastWizardConfig.
	 *
	 * @returns {{url: string, headers: {X-WP-Nonce: *}}} Returns the endpoint configuration.
	 */
	getEndpoint() {
		let config = yoastWizardConfig;

		return {
			url: `${config.root}${config.namespace}/${config.endpoint_retrieve}`,
			headers: {
				"X-WP-Nonce": config.nonce,
			},
		};
	}

	/**
	 * Parses the response containing the config and sets it in the state.
	 *
	 * @param response The response from AJAX request in the getConfig function.
	 *
	 * @returns {void} Returns nothing.
	 */
	setConfig( response ) {
		let config = response;
		let endpoint = this.getEndpoint();

		Object.assign( config, {
			finishUrl: yoastWizardConfig.finishUrl,
			endpoint: endpoint,
			customComponents: {
				MailchimpSignup,
				MediaUpload,
				ConnectGoogleSearchConsole,
				ConfigurationChoices,
				Suggestions,
				FinalStep,
			},
		} );

		this.setState( {
			isLoading: false,
			config,
		} );
	}

	/**
	 * Sends a get request to the configured endpoint
	 * to retrieve the wizard's configuration settings.
	 *
	 * @returns {void} Calls the setConfig function when the request is successful.
	 */
	getConfig() {
		let endpoint = this.getEndpoint();

		return jQuery
			.ajax( {
				url: endpoint.url,
				method: "GET",
				async: true,
				beforeSend: ( xhr ) => {
					jQuery.each( endpoint.headers, xhr.setRequestHeader );
				},
			} ).done(
				this.setConfig.bind( this )
			).fail( ()=> {
				this.setState( {
					isLoading: false,
				} );
			} );
	}

	/**
	 * Renders the App componetn.
	 *
	 * @returns {JSX.Element|null} The rendered app component.
	 */
	render() {

		if ( this.state.isLoading === false && this.state.config !== {} ) {

			return (
				<div>
					<OnboardingWizard { ...this.state.config }/>
				</div>
			);
		}
		return null;
	}
}

ReactDOM.render( <App/>, document.getElementById( "wizard" ) );
