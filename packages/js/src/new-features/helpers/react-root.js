import { SlotFillProvider } from "@wordpress/components";
import { Component as wpComponent, createRef, Fragment, render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { forEach, map } from "lodash";

const registeredComponents = {};
let containerRef = null;

/**
 * Container used to render registered components.
 */
class RegisteredComponentsContainer extends wpComponent {
	/**
	 * Constructs a container for registered components.
	 *
	 * @param {Object} props Props for this component.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			registeredComponents: {},
		};
	}

	/**
	 * Registers a React component.
	 *
	 * @param {string} key Unique key to give to React to render within a list of components.
	 * @param {JSX.ElementClass} Component A valid React component to render.
	 *
	 * @returns {void}
	 */
	registerComponent( key, Component ) {
		this.setState( {
			registeredComponents: {
				...this.state.registeredComponents,
				[ key ]: Component,
			},
		} );
	}

	/**
	 * Renders all the registered components.
	 *
	 * @returns {JSX.Element[]} The rendered components in an array.
	 */
	render() {
		return map( this.state.registeredComponents, ( Component, key ) => (
			<Component key={ key } />
		) );
	}
}

/**
 * Renders a React tree with registration mechanism.
 *
 * @param {JSX.Element} children The children to render.
 * @param {HTMLElement} container The HTML element to render in.
 * @param {Object} [context] The root context.
 *
 * @returns {void}
 */
export function renderReactRoot( children, container, context = { isRtl: false } ) {
	containerRef = createRef();

	render(
		(
			<Root context={ context }>
				<SlotFillProvider>
					<Fragment>
						{ children }
						<RegisteredComponentsContainer ref={ containerRef } />
					</Fragment>
				</SlotFillProvider>
			</Root>
		),
		container
	);

	forEach( registeredComponents, ( Component, key ) => {
		containerRef.current.registerComponent( key, Component );
	} );
}

/**
 * Registers a React component.
 *
 * This is the mechanism to register before the root has been rendered.
 *
 * @param {string} key Unique key to give to React to render within a list of components.
 * @param {JSX.ElementClass} Component A valid React component to render.
 *
 * @returns {void}
 */
export function registerReactComponent( key, Component ) {
	if ( containerRef === null || containerRef.current === null ) {
		registeredComponents[ key ] = Component;
	} else {
		containerRef.current.registerComponent( key, Component );
	}
}
