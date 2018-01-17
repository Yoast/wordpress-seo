import React from "react";
import { IntlProvider, addLocaleData } from "react-intl";
import isString from "lodash/isString";

let promise;

function loadLocaleData( locale ) {
	const parsedLocale = isString( locale ) ? locale.split( "_" )[ 0 ] : "en";
	return import(
		`react-intl/locale-data/${ parsedLocale }`
		).then( localeData => {
		addLocaleData( localeData );
	} ).catch( error => {
		console.error(`Error loading locale data for locale: ${ parsedLocale }\n\r${ error }`);
	} );
}

class IntlProviderWaitForLocaleData extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			promiseState: "unresolved", // "unresolved" || "rejected" || "resolved"
		}
	}

	componentDidMount() {
		this.props.promise.then( () => {
			this.setState( { promiseState: "resolved" } );
		} ).catch( () => {
			this.setState( { promiseState: "rejected" } );
		} );
	}

	renderIntlProvider() {
		return(
			<IntlProvider
				locale={ this.props.locale }
				messages={ this.props.messages }>
				{ this.props.children }
			</IntlProvider>
		);
	}

	render() {
		switch( this.state.promiseState ) {
			case "rejected":
			case "resolved":
				return this.renderIntlProvider();
			default:
				return null;
		}
	}
}

function IntlProviderHOC( { locale, messages, children } ) {
	const parsedLocale = isString( locale ) ? locale.split( "_" )[ 0 ] : "en";
	return(
		<IntlProviderWaitForLocaleData
			promise={ promise }
			locale={ parsedLocale }
			messages={ messages } >
			{ children }
		</IntlProviderWaitForLocaleData>
	);
}

export default ( locale ) => {
	if( ! promise ) {
		promise = loadLocaleData( locale );
	}
	return IntlProviderHOC;
};
