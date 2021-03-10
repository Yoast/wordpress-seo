import { Component, forwardRef } from "@wordpress/element";

/**
 * Higher order that maps an onChange that only returns a value to an "Event" object,
 * just as a native element would return.
 *
 * @param {wp.Component} WrappedComponent The component to be wrapped.
 *
 * @returns {wp.Component} Higher order component.
 */
export default ( WrappedComponent ) => {
	/**
	 * The Wrapper component.
	 */
	class WrapperComponent extends Component {
		/**
		 * The WrapperComponent constructor.
		 *
		 * @param {Object} props Component props.
		 */
		constructor( props ) {
			super( props );

			this.onChange = this.onChange.bind( this );
		}

		/**
		 * Handles the onChange event.
		 *
		 * @param {any} value The value to be mapped to an object, similar to an event object.
		 *
		 * @returns {Object} Mimicked event object.
		 */
		onChange( value ) {
			return this.props.onChange( {
				target: {
					name: this.props.name,
					value,
				},
			} );
		}

		/**
		 * Renders the Wrapper component, and intercepts props that shouldn't be passed down.
		 *
		 * @returns {wp.Element} The rendered component.
		 */
		render() {
			// Extract props that shouldn't be passed down.
			const {
				/* eslint-disable-next-line no-unused-vars */
				onChange,
				forwardedRef,
				...otherProps
			} = this.props;

			return (
				<WrappedComponent
					{ ...otherProps }
					ref={ forwardedRef }
					onChange={ this.onChange }
				/>
			);
		}
	}

	return forwardRef( ( props, ref ) => (
		<WrapperComponent
			{ ...props }
			forwardedRef={ ref }
		/>
	) );
};
