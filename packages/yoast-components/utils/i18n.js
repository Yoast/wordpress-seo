import Jed from "jed";
import React from "react";
import assign from "lodash/assign";

var jed = null;

/**
 * Creates a new Jed object that just passes the english originals.
 *
 * @returns {Jed} The new Jed object.
 */
function createJed() {
	return new Jed( {} );
}

/**
 * Sets the translations of the global Jed object to the passed translations.
 *
 * @param {Object} translations The translations to set on the Jed object.
 * @returns {void}
 */
export function setTranslations( translations ) {
	jed = new Jed( translations );
}

/**
 * Retrieves the global Jed object.
 *
 * @returns {Jed} The global Jed object. Will be created if it doesn't exist.
 */
export function getGlobalJed() {
	if ( jed === null ) {
		jed = createJed();
	}

	return jed;
}

/**
 * Translates a string based on the global Jed object.
 *
 * @param {string} singleForm The single form to translate.
 * @param {string} pluralForm The plural form to translate.
 * @param {number} number The number on which to base the single/plural form.
 * @returns {string} The translated string.
 */
export function translate( singleForm, pluralForm = "", number = 0 ) {
	const localJed = getGlobalJed();

	if ( pluralForm === "" ) {
		return localJed.gettext( singleForm );
	}

	return localJed.ngettext( singleForm, pluralForm, number );
}

/**
 * A higher order component to add a translate function.
 *
 * @param {Object} ComposedComponent The original React component.
 * @returns {React.Component} The new localized component.
 */
export function localize( ComposedComponent ) {
	const componentName = ComposedComponent.displayName || ComposedComponent.name || "";
	const i18nProps = {
		translate: translate,
	};
	class LocalizedComponent extends React.Component {
		constructor( props ) {
			super( props );
			this.displayName = "Localized" + componentName;
		}
		render() {
			const props = assign( {}, this.props, i18nProps );
			return <ComposedComponent { ...props } />;
		}
	}
	return LocalizedComponent;
}
