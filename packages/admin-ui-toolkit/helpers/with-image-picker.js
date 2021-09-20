import { createHigherOrderComponent, pure } from "@wordpress/compose";
import { createElement, useContext } from "@wordpress/element";
import { ImagePickerContext } from "../contexts";

/**
 * Creates a higher-order component that uses the MediaContext.
 *
 * @returns {Component} The component with a location prop.
 */
export default function withImagePicker() {
	return createHigherOrderComponent( function( WrappedComponent ) {
		return pure( function( ownProps ) {
			const imagePicker = useContext( ImagePickerContext );
			return createElement( WrappedComponent, {
				...ownProps,
				imagePicker,
			} );
		} );
	}, "withImagePicker" );
}
