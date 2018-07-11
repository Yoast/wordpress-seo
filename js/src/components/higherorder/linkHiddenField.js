/* External dependencies */
import React from "react";
import PropTypes from "prop-types";

/**
 * Allows multiple inputs to be mapped to a (hidden) input in the DOM.
 *
 * @param {function} mapFieldsFromProps Map the wrapped component's props
 *                                      to an object the HOC can use.
 *
 * @returns {function(*)} A function to pass the component to be wrapped to.
 */
const linkHiddenFields = ( mapFieldsFromProps ) => {
	return ( WrappedComponent ) => {
		class LinkHiddenFields extends React.Component {
			constructor( props ) {
				super( props );

				this.elements = {};
				const state = {};
				this.fields = mapFieldsFromProps( props );

				this.fields.forEach( field => {
					const { name, fieldId } = field;
					const element = document.getElementById( fieldId );

					if( element ) {
						this.elements[ name ] = element;
						state[ name ] = {
							value: element.value,
							onChange: this.onChange.bind( this, name ),
						};
					}
				} );

				this.state = state;
			}

			static get propTypes() {
				return {
					children: PropTypes.node,
				};
			}

			onChange( name, value ) {
				this.setState( {
					...this.state,
					[ name ]: {
						...this.state[ name ],
						value,
					},
				}, () => {
					if ( this.elements[ name ] ) {
						this.elements[ name ].value = value;
					}
				} );
			}

			render() {
				const {
					children,
					...otherProps
				} = this.props;

				return (
					<WrappedComponent
						{ ...otherProps }
						{ ...this.state }
					>
						{ children }
					</WrappedComponent>
				);
			}
		}

		return LinkHiddenFields;
	};
};

export const linkFieldsShape = PropTypes.shape( {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
} );

export default linkHiddenFields;
