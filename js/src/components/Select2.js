import { Component } from "@wordpress/element";
import PropTypes from "prop-types";

export class SingleSelect extends Component {
	componentDidMount() {
		this.select2 = jQuery( `#${ this.props.componentId }` );
		this.select2.select2( { width: "100%" } );
		this.select2.on( "change.select2", e => this.changeHiddenInput( e.target ) );
	}

	changeHiddenInput( target ) {
		document.querySelector( this.props.hiddenInputId ).value = target.value;
	}

	render() {
		const selected = document.querySelector( this.props.hiddenInputId ).value;
		return (
			<select
				id={ this.props.componentId }
				defaultValue={ selected }
			>
				{ this.props.options.map( option => {
					return <option key={ option.value } value={ option.value }>{ option.name }</option>;
				} ) }
			</select>
		);
	}
}


SingleSelect.propTypes = {
	options: PropTypes.arrayOf( PropTypes.shape( { name: PropTypes.string, value: PropTypes.string } ) ).isRequired,
	componentId: PropTypes.string.isRequired,
	hiddenInputId: PropTypes.string.isRequired,
	defaultValue: PropTypes.string,
};

SingleSelect.defaultProps = {
	defaultValue: "",
};

export class MultipleSelect extends SingleSelect {
	changeHiddenInput( target ) {
		let value = "";
		for ( let selection of target.selectedOptions ){
			value += `${ selection.value },`;
		}
		value = value.slice( 0, -1 );
		super.changeHiddenInput( { value } );
	}

	render() {
		let selected = document.querySelector( this.props.hiddenInputId ).value || this.props.default;
		selected = selected.split( ',' );

		return (
			<select multiple="multiple"
			        id={ this.props.componentId }
			        onBlur={ e => this.changeHiddenInput( e.target ) }
			        defaultValue={ selected }
			>
				{ this.props.options.map( option => {
					return <option key={ option.value } value={ option.value }>{ option.name }</option>;
				} ) }
			</select>
		);
	}
}
