import { Component } from "@wordpress/element";
import { PropTypes } from "prop-types";
import { Fragment } from "react";

export default class RadioButtons extends Component {
	constructor( { hiddenComponentId } ) {
		super();
		this.state = {
			selected: parseInt( document.querySelector( hiddenComponentId ).value ),
		};
		this.changeHiddenInput = this.changeHiddenInput.bind( this );
	}

	changeHiddenInput( event ){
		const value = event.target.value;
		this.setState( { selected: parseInt( value )  } );
		document.querySelector( this.props.hiddenComponentId ).value = value;
	}

	generateButtonGroup(){
		return this.props.options.map( (option, index) => {
			return (
				<Fragment
					key={ `${this.props.componentId}_${index}` }
				>
					<input
						type="radio"
						name={ this.props.componentId }
						id={ `${this.props.componentId}_${index}` }
						value={ index }
						checked={ this.state.selected === index }
						onChange={ this.changeHiddenInput }
					/>
					<label
						htmlFor={ `${this.props.componentId}_${index}` }
					>
						{ option }
					</label>
				</Fragment>
			);
		} );
	}

	render() {
		return (
			<fieldset>
				{ this.generateButtonGroup() }
			</fieldset>
		);
	}
}

RadioButtons.propTypes = {
	numberOfButtons: PropTypes.number,
	componentId: PropTypes.string.isRequired,
	hiddenComponentId: PropTypes.string.isRequired,
	options: PropTypes.array.isRequired,
};

RadioButtons.defaultProps = {
	numberOfButtons: 2,
};
