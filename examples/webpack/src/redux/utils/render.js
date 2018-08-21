import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";

/**
 * Wraps a component in the required top level components.
 *
 * @param {ReactElement} Component The component to be wrapped.
 * @param {Object}       store     Redux store.
 * @param {Object}       props     React props to pass to the Component.
 *
 * @returns {ReactElement} The wrapped component.
 */
export function wrapInTopLevelComponents( Component, store, props = {} ) {
	return (
		<Provider store={ store }>
			<Component { ...props } />
		</Provider>
	);
}

/**
 * Render a react app to a target element.
 *
 * @param {string}       targetElement Target element.
 * @param {ReactElement} component     The component to render.
 * @param {Object}       store         Redux store.
 * @param {Object}       props         The component props.
 *
 * @returns {void}
 */
export function renderReactApp( targetElement, component, store, props = {} ) {
	ReactDOM.render(
		wrapInTopLevelComponents( component, store, props ),
		targetElement
	);
}
