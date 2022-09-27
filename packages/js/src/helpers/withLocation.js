import { createHigherOrderComponent, pure } from "@wordpress/compose";
import { createElement, useContext } from "@wordpress/element";
import { LocationContext } from "@yoast/externals/contexts";

/**
 * Creates a higher-order component that uses the LocationContext.
 *
 * @returns {Component} The component with a location prop.
 */
export default function withLocation() {
	return createHigherOrderComponent( function( WrappedComponent ) {
		return pure( function( ownProps ) {
			const location = useContext( LocationContext );

			return createElement( WrappedComponent, {
				...ownProps,
				location,
			} );
		} );
	}, "withLocation" );
}
