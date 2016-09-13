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
	return new Jed();
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
 * @return {string} The translated string.
 */
function translate( singleForm, pluralForm = "", number = 0 ) {
	let jed = getGlobalJed();

	if ( pluralForm === "" ) {
		return jed.gettext( singleForm );
	} else {
		return jed.ngettext( singleForm, pluralForm, number );
	}
}

/**
 * A higher order component to add a translate function.
 *
 * @param {Object} ComposedComponent The original React component.
 */
export function localize( ComposedComponent ) {
	let componentName = ComposedComponent.displayName || ComposedComponent.name || '';
	let i18nProps = {
		translate: translate,
	};

	return React.createClass( {
		displayName: 'Localized' + componentName,

		render: function() {
			var props = assign( {}, this.props, i18nProps );

			return React.createElement( ComposedComponent, props );
		}
	});
}

export function getTranslateFunction() {
	return translate;
}
