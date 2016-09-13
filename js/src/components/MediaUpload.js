import React from "react";
import Input from "yoast-components/forms/Input";
import Label from "yoast-components/forms/Label";

/**
 * @summary Media upload component.
 */
class MediaUpload extends React.Component {

	constructor( props ) {

		super( props );

		this.state = {
			currentUpload: props.value,
			media_upload : wp.media( {
				title: 'Choose an image', // Translate this
				button: { text: 'Choose an image' },  // Translate this.
				multiple: false
			} ),
		}

		this.state.media_upload.on( 'select', this.selectUpload.bind( this ) );
	}
	/**
	 * Sends the change event, because the component is updated.
	 *
	 * @param {Object} prevProps
	 * @param {Object} prevState
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps, prevState ) {
		let currentUploadChange = this.state.currentUpload !== prevState.currentUpload;

		if( currentUploadChange ) {
			this.sendChangeEvent();
		}
	}

	/**
	 * Opens the media upload.
	 *
	 * @param {Event} evt The event that is triggered.
	 */
	chooseUpload( evt ) {
		evt.preventDefault();

		this.state.media_upload.open();
	}

	/**
	 * Selects the image and put the value of it to the state.
	 */
	selectUpload() {
		var attachment = this.state.media_upload.state().get( 'selection' ).first().toJSON();

		this.setState( {
			'currentUpload': attachment.url
		} )

	}

	/**
	 * Clears the current upload.
	 */
	removeUpload() {
		this.setState( {
			'currentUpload' : ''
		} )
	}

	/**
	 * Renders the output.
	 *
	 * @returns {JSX.Element}
	 */
	render() {
		let removeButton = '';
		if( this.state.currentUpload !== '' ) {
			removeButton = ( <button onClick={ this.removeUpload.bind( this ) } className="button button-primary" type="button">
				Remove the image
			</button> )
		}

		return (
			<div>
				<Label for={this.props.name}>{this.props.properties.label}</Label>
				<Input type="text" name={this.props.name} onChange={ this.props.onChange.bind( this ) } value={this.state.currentUpload} />
				<button onClick={ this.chooseUpload.bind( this ) } className="button button-primary" type="button">Choose image</button>
				{removeButton}
			</div>
		)
	}

	/**
	 * Sends the data to the step component.
	 *
	 * @returns {void}
	 */
	sendChangeEvent() {
		let changeEvent = {
			target: {
				name: this.props.name,
				value: this.state.currentUpload,
			},
		};

		this.props.onChange( changeEvent );
	}

}

/**
 * Adds validation for the properties.
 */
MediaUpload.propTypes = {
	name: React.PropTypes.string.isRequired,
	value: React.PropTypes.any,
	onChange: React.PropTypes.func,
	properties: React.PropTypes.shape( {
		label : React.PropTypes.string
	} )
};

export default MediaUpload;