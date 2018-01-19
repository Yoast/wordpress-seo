import React from "react";
import PropTypes from "prop-types";
import { IntlProvider, addLocaleData } from "react-intl";
import isString from "lodash/isString";

// Global promise to make sure the locale-data is retrieved only once.
let promise;

/**
 * Retrieves the locale data and returns a promise, based on the user's locale.
 *
 * @param {string} locale The user locale.
 * @returns {Promise} The promise for retrieving the locale-data.
 */
function loadLocaleData( locale ) {
	const parsedLocale = isString( locale ) ? locale.split( "_" )[ 0 ] : "en";

	if ( process.env.NODE_ENV === "test" ) {
		return new Promise( ( resolve ) => resolve() );
	}

	return import(
		`react-intl/locale-data/${ parsedLocale }`
		).then( localeData => {
			addLocaleData( localeData );
		} ).catch( error => {
			console.error( `Error loading locale data for locale: ${ parsedLocale }\n\r${ error }` );
		} );
}

/**
 * The component that will be wrapped by the Higher Order component.
 *
 * This component will render an IntlProvider when the locale-data promise is resolved.
 */
class IntlProviderWaitForLocaleData extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			promiseState: "unresolved", // "unresolved" || "rejected" || "resolved"
		};
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

IntlProviderWaitForLocaleData.propTypes = {
	locale: PropTypes.string.isRequired,
	messages: PropTypes.object.isRequired,
	children: PropTypes.node.isRequired,
	promise: PropTypes.object.isRequired,
};

/**
 * A wrapper around react-intl's IntlProvider to make sure the locale-data
 * is loaded before it is rendered.
 *
 * @param {Object}       props          The component props.
 * @param {string}       props.locale   The user locale.
 * @param {Object}       props.messages The translations.
 * @param {ReactElement} props.children Child elements.
 *
 * @returns {ReactElement} IntlProvider Higher order component.
 */
function IntlProviderHOC( { locale, messages, children } ) {
	const parsedLocale = isString( locale ) ? locale.split( "_" )[ 0 ] : "en";
	return(
		<IntlProviderWaitForLocaleData
			promise={ promise }
			locale={ parsedLocale }
			messages={ messages }>
			{ children }
		</IntlProviderWaitForLocaleData>
	);
}

IntlProviderHOC.propTypes = {
	locale: PropTypes.string.isRequired,
	messages: PropTypes.object.isRequired,
	children: PropTypes.node.isRequired,
};

export default ( locale ) => {
	if ( ! promise ) {
		promise = loadLocaleData( locale );
	}
	return IntlProviderHOC;
};
