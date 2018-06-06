import React from "react";

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
					console.log( fieldId, element );

					if( element ) {
						this.elements[ name ] = element;
						state[ name ] = {
							value: element.value,
							onChange: this.onChange.bind( this, name ),
						};
					}
				} );

				console.log( state );
				this.state = state;
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

export default linkHiddenFields;
