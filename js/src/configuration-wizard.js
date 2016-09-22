// Required for browser compatibility.
import "babel-polyfill"

/* global yoastWizardConfig */
import React from "react";
import ReactDOM from "react-dom";

// Required to make Material UI work with touch screens.
import injectTapEventPlugin from "react-tap-event-plugin";
import { OnboardingWizard } from "yoast-components";

import MailchimpSignup from "./components/MailchimpSignup";
import ConnectGoogleSearchConsole from "./components/ConnectGoogleSearchConsole";
import MediaUpload from "./components/MediaUpload";

import { setTranslations } from "yoast-components/utils/i18n";
import isUndefined from "lodash/isUndefined";

if ( ! isUndefined( yoastWizardConfig.translations ) ) {
	setTranslations( yoastWizardConfig.translations );
}

injectTapEventPlugin();

class App extends React.Component {

	getEndpoint() {
		let config = yoastWizardConfig;

		return {
			url: `${config.root}${config.namespace}
			/${config.endpoint_retrieve}`,
			headers: {
				"X-WP-Nonce": config.nonce,
			},
		};
	}

	getConfig() {
		let config = {};
		let endpoint = this.getEndpoint();

		jQuery.ajax( {
			url: endpoint.url,
			method: "GET",
			async: false,
			beforeSend: ( xhr ) => {
				jQuery.each( endpoint.headers, xhr.setRequestHeader );
			},
		} ).done( ( response ) => {
			config = response;
		} );

		config.finishUrl = yoastWizardConfig.finishUrl;
		config.endpoint = endpoint;
		config.customComponents = { MailchimpSignup, MediaUpload, ConnectGoogleSearchConsole };

		return config;
	}

	render() {
		let config = this.getConfig();

		return (
			<div>
				<OnboardingWizard { ...config }/>
			</div>
		);
	}
}

ReactDOM.render( <App/>, document.getElementById( "wizard" ) );
