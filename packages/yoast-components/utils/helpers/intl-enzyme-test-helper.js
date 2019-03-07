/**
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that and wrap a valid,
 * English-locale intl context around them.
 */

import React from "react";
import { IntlProvider, intlShape } from "react-intl";
import { mount, shallow } from "enzyme";


// Create the IntlProvider to retrieve context for wrapping around.
const intlProvider = new IntlProvider( { locale: "en" }, {} );
const { intl } = intlProvider.getChildContext();

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 *
 * @param {ReactElement} node Element without `intl` prop.
 *
 * @returns {ReactElement} The element with the `intl` prop.
 */
function nodeWithIntlProp( node ) {
	return React.cloneElement( node, { intl } );
}

/**
 * Executes enzymes shallow rendering with an intl context.
 *
 * @param {ReactComponent} node Component to render with context.
 * @param {Object} context Additional context to add.
 * @param {Object} additionalOptions Other options for `shallow`.
 *
 * @returns {Object} The shallow rendered element.
 */
export function shallowWithIntl( node, { context, ...additionalOptions } = {} ) {
	return shallow(
		nodeWithIntlProp( node ),
		{
			context: Object.assign( {}, context, { intl } ),
			...additionalOptions,
		}
	);
}

/**
 * Executes enzymes mounting with an intl context.
 *
 * @param {ReactComponent} node Component to render with context.
 * @param {Object} context Additional context to add.
 * @param {Object} childContextTypes Additional child context types.
 * @param {Object} additionalOptions Other options for `shallow`.
 *
 * @returns {Object} The mounted tree.
 */
export function mountWithIntl( node, { context, childContextTypes, ...additionalOptions } = {} ) {
	return mount(
		nodeWithIntlProp( node ),
		{
			context: Object.assign( {}, context, { intl } ),
			childContextTypes: Object.assign( {}, { intl: intlShape }, childContextTypes ),
			...additionalOptions,
		}
	);
}
