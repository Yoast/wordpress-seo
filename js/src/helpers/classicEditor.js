import { render, Component, createRef } from "@wordpress/element";
import { SlotFillProvider } from "@wordpress/components";
import MetaboxPortal from "../components/MetaboxPortal";
import getL10nObject from "../analysis/getL10nObject";

const registeredComponents = [];
let containerRef = null;

class RegisteredComponentsContainer extends Component {

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
	 * @param {React.Component} Component A valid React component to render.
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
	 * @returns {React.Element[]} The rendered components in an array.
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

	const theme = {
		isRtl: localizedData.isRtl,
	};

	render(
		(
			<SlotFillProvider>
				<MetaboxPortal
					target="wpseo-meta-section-react"
					store={store}
					theme={theme}
				/>
				<RegisteredComponentsContainer ref={containerRef}/>
			</SlotFillProvider>
		),
		document.getElementById( "wpseo-meta-section-react" )
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
 * @param {React.Component} Component A valid React component to render.
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
