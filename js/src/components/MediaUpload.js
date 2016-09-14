/* global wp */

import React from "react";
import RaisedButton from "material-ui/RaisedButton";

/**
 * @summary Media upload component.
 */
class MediaUpload extends React.Component {

	constructor( props ) {

		super( props );

		this.state = {
			currentUpload: props.value,
			media_upload : wp.media( {
				title: "Choose an image",
				button: { text: "Choose an image" },
				multiple: false
			} ),
		};

		this.state.media_upload.on( "select", this.selectUpload.bind( this ) );
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
		var attachment = this.state.media_upload.state().get( "selection" ).first().toJSON();

		this.setState( {
			"currentUpload": attachment.url,
		} );
	}

	/**
	 * Clears the current upload.
	 */
	removeUpload() {
		this.setState( {
			"currentUpload" : "",
		} );
	}

	/**
	 * Renders the output.
	 *
	 * @returns {JSX.Element}
	 */
	render() {
		let removeButton;
		let image;
		if( this.state.currentUpload !== "" ) {
			removeButton = <RaisedButton
				label="Remove the image"
				onClick={ this.removeUpload.bind( this ) }
				className="yoast-wizard-image-upload-container-buttons__remove"
				type="button"/>;
			image = <img className="yoast-wizard-image-upload-container__image"
			             ref="companyImage"
			             src={this.state.currentUpload}
			             alt="company logo image preview"/>;
		}

		return (
			<div className="yoast-wizard-image-upload-container">
				<p className="yoast-wizard-image-upload-container-description">
					{this.props.properties.label}
				</p>
				{image}
				<div className="yoast-wizard-image-upload-container-buttons">
					<RaisedButton label="Choose image"
					              onClick={ this.chooseUpload.bind( this ) }
					              type="button"
					              className="yoast-wizard-image-upload-container-buttons__choose"/>
					{removeButton}
				</div>
			</div>
		);
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
