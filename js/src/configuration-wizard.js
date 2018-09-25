/* global yoastWizardConfig */
import React from "react";
import ReactDOM from "react-dom";

// Required to make Material UI work with touch screens.
import injectTapEventPlugin from "react-tap-event-plugin";
import { OnboardingWizard } from "yoast-components";
import { MessageBox } from "yoast-components";

import MailchimpSignup from "./components/MailchimpSignup";
import ConfigurationChoices from "./components/ConfigurationChoices";
import ConnectGoogleSearchConsole from "./components/ConnectGoogleSearchConsole";
import MediaUpload from "./components/MediaUpload";
import Suggestions from "./components/Suggestions";
import FinalStep from "./components/FinalStep";

import { setTranslations } from "yoast-components";
import isUndefined from "lodash/isUndefined";

import YoastIcon from "../../images/Yoast_SEO_Icon.svg";

import { setYoastComponentsL10n } from "./helpers/i18n";

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
	 * @param {Object} response The response from AJAX request in the getConfig function.
	 *
	 * @returns {void} Returns nothing.
	 */
	setConfig( response ) {
		let config = response;
		let endpoint = this.getEndpoint();

		if ( ! isUndefined( config.translations ) ) {
			setTranslations( config.translations );
		}

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
	 * Renders the App component.
	 *
	 * @returns {JSX.Element|null} The rendered app component.
	 */
	render() {
		// When the wizard is loading, don't do anything.
		if ( this.state.isLoading === true ) {
			return null;
		}

		// When there is a config and it's not empty.
		if ( typeof ( this.state.config ) !== "undefined" && this.state.config !== {} ) {
			return (
				<div>
					<OnboardingWizard { ...this.state.config } headerIcon={YoastIcon} />
				</div>
			);
		}

		let message = {
			/** Translators: {{link}} resolves to the link opening tag to https://yoa.st/configuration-wizard-error-plugin-conflict, {{/link}} resolves to the link closing tag. **/
			mixedString:
			"The configuration wizard could not be started." +
			" The likely cause is an interfering plugin. Please {{link}}check for plugin conflicts{{/link}} to solve this problem. ",
			components: { link: <a href="https://yoa.st/configuration-wizard-error-plugin-conflict" target="_blank" /> },
		};

		return (
			<div>
				<MessageBox { ...message } icon={YoastIcon} />
			</div>
		);
	}
}

setYoastComponentsL10n();

ReactDOM.render( <App/>, document.getElementById( "wizard" ) );
