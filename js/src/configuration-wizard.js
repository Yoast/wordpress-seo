// Required for browser compatibility.
import "babel-polyfill";

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
		this.props = {
			config: this.getConfig(),
		};

		this.state = {
			isLoading: true,
		};

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
//		this.setState( {
//			isLoading: true,
//		} );
		jQuery
			.ajax( {
				url: endpoint.url,
				method: "GET",
				async: true,
				beforeSend: ( xhr ) => {
					jQuery.each( endpoint.headers, xhr.setRequestHeader );
				},
			} )
			.done( ( response ) => {
				console.log("done");
				this.setState( {
					isLoading: false,
				} );

				config = response;
				config.finishUrl = yoastWizardConfig.finishUrl;
				config.endpoint = endpoint;
				config.customComponents = {
					MailchimpSignup,
					MediaUpload,
					ConnectGoogleSearchConsole
				};

				return config;
			} ).fail( ()=> {
			this.setState( {
				isLoading: false,
			} );
			return {};
		} );
	}

	render() {
//		let config = this.getConfig();
		console.log( this.state );

		if ( this.state.isLoading === true ) {
			return (
				<div>
					<OnboardingWizard { ...config }/>
				</div>
			);
		}
		return null;
	}
}

ReactDOM.render( <App/>, document.getElementById( "wizard" ) );
