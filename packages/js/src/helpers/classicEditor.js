import { render, Component as wpComponent, createRef } from "@wordpress/element";
import { SlotFillProvider } from "@wordpress/components";
import MetaboxPortal from "../components/portals/MetaboxPortal";
import getL10nObject from "../analysis/getL10nObject";
import Root from "../components/contexts/root";

const registeredComponents = [];
let containerRef = null;

/**
 * Container used to render registerd components when wp.plugins is not available.
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
			registeredComponents: [],
		};
	}

	/**
	 * Registers a react component to be rendered within the metabox slot-fill
	 * provider.
	 *
	 * @param {string}          key       Unique key to give to React to render
	 *                                    within a list of components.
	 * @param {wp.Component} Component A valid React component to render.
	 *
	 * @returns {void}
	 */
	registerComponent( key, Component ) {
		this.setState( {
			registeredComponents: [
				...this.state.registeredComponents,
				{
					key,
					Component,
				},
			],
		} );
	}

	/**
	 * Renders all the registered components.
	 *
	 * @returns {wp.Element[]} The rendered components in an array.
	 */
	render() {
		return this.state.registeredComponents.map( ( { Component, key } ) => {
			return <Component key={ key } />;
		} );
	}
}

/**
 * Renders a React tree for the classic editor.
 *
 * @param {Object} store The active redux store.
 *
 * @returns {void}
 */
export function renderClassicEditorMetabox( store ) {
	const localizedData = getL10nObject();
	containerRef = createRef();
	const classicMetaboxContext = { locationContext: "classic-metabox" };
	const theme = {
		isRtl: localizedData.isRtl,
	};

	render(
		(
			<SlotFillProvider>
				<Root context={ classicMetaboxContext }>
					<MetaboxPortal
						target="wpseo-metabox-root"
						store={ store }
						theme={ theme }
					/>
				</Root>
				<RegisteredComponentsContainer ref={ containerRef } />
			</SlotFillProvider>
		),
		document.getElementById( "wpseo-metabox-root" )
	);

	registeredComponents.forEach( ( registered ) => {
		containerRef.current.registerComponent( registered.key, registered.Component );
	} );
}

/**
 * Registers a react component to be rendered within the metabox slot-fill
 * provider.
 *
 * @param {string}          key       Unique key to give to React to render
 *                                    within a list of components.
 * @param {wp.Component} Component A valid React component to render.
 *
 * @returns {void}
 */
export function registerReactComponent( key, Component ) {
	if ( containerRef === null || containerRef.current === null ) {
		registeredComponents.push( { key, Component } );
	} else {
		containerRef.current.registerComponent( key, Component );
	}
}
