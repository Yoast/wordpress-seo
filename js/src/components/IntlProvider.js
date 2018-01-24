import React from "react";
import PropTypes from "prop-types";
import { IntlProvider as IntlProviderOriginal, addLocaleData } from "react-intl";
import isString from "lodash/isString";

// Global promise to make sure the locale-data is retrieved only once.
let promise, language;

/**
 * Retrieves the language from the passed locale.
 *
 * @param {string} locale                 Locale.
 * @param {string} [defaultLanguage="en"] Default language if no locale is passed.
 * @returns {string} Abbreviated language.
 */
function getLanguageFromLocale( locale, defaultLanguage = "en" ) {
	return isString( locale ) ? locale.split( "_" )[ 0 ] : defaultLanguage;
}

/**
 * Retrieves the locale data and returns a promise, based on the user's locale.
 *
 * @param {string} locale The user locale.
 * @returns {Promise} The promise for retrieving the locale-data.
 */
function loadLocaleData( locale ) {
	if ( process.env.NODE_ENV === "test" ) {
		return new Promise( ( resolve ) => resolve() );
	}

	return import(
		`react-intl/locale-data/${ locale }`
		).then( localeData => {
			addLocaleData( localeData );
		} ).catch( error => {
			console.error( `Error loading locale data for locale: ${ locale }\n\r${ error }` );
		} );
}

/**
 * The component that will be wrapped by the Higher Order component.
 *
 * This component will render an IntlProvider when the locale-data promise is resolved.
 */
class IntlProvider extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			promiseState: "unresolved", // "unresolved" || "rejected" || "resolved"
		};
	}

	componentDidMount() {
		promise.then( () => {
			this.setState( { promiseState: "resolved" } );
		} ).catch( () => {
			this.setState( { promiseState: "rejected" } );
		} );
	}

	renderIntlProvider() {
		return(
			<IntlProviderOriginal
				locale={ language }
				messages={ this.props.messages }>
				{ this.props.children }
			</IntlProviderOriginal>
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

IntlProvider.propTypes = {
	messages: PropTypes.object.isRequired,
	children: PropTypes.node.isRequired,
};

export default ( locale ) => {
	if ( ! language ) {
		language = getLanguageFromLocale( locale );
	}
	if ( ! promise ) {
		promise = loadLocaleData( language );
	}
	return IntlProvider;
};
