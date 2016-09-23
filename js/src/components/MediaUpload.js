/* global wp */

import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import { localize } from "yoast-components/utils/i18n";

/**
 * @summary Media upload component.
 */
class MediaUpload extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			currentUpload: props.value,
			mediaUpload: wp.media( {
				title: this.props.translate( "Choose an image" ),
				button: { text: this.props.translate( "Choose an image" ) },
				multiple: false,
			} ),
		};

		this.state.mediaUpload.on( "select", this.selectUpload.bind( this ) );
	}
	/**
	 * Sends the change event, because the component is updated.
	 *
	 * @param {Object} prevProps The previous props.
	 * @param {Object} prevState The previous state.
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
	 *
	 * @returns {void}
	 */
	chooseUpload( evt ) {
		evt.preventDefault();

		this.state.mediaUpload.open();
	}

	/**
	 * Selects the image and put the value of it to the state.
	 *
	 * @returns {void}
	 */
	selectUpload() {
		var attachment = this.state.mediaUpload.state().get( "selection" ).first().toJSON();

		this.setState( {
			currentUpload: attachment.url,
		} );
	}

	/**
	 * Clears the current upload.
	 *
	 * @returns {void}
	 */
	removeUpload() {
		this.setState( {
			currentUpload: "",
		} );
	}

	/**
	 * Renders the output.
	 *
	 * @returns {JSX.Element} The rendered HTML.
	 */
	render() {
		let removeButton;
		let image;
		if( this.state.currentUpload !== "" ) {
			removeButton = <RaisedButton
				label={this.props.translate( "Remove the image" )}
				onClick={ this.removeUpload.bind( this ) }
				className="yoast-wizard-image-upload-container-buttons__remove"
				type="button"/>;
			image = <img className="yoast-wizard-image-upload-container__image"
						ref="companyImage"
						src={this.state.currentUpload}
						alt={this.props.translate( "company logo image preview" )}/>;
		}

		return (
			<div className="yoast-wizard-image-upload-container">
				<p className="yoast-wizard-image-upload-container-description">
					{this.props.properties.label}
				</p>
				{image}
				<div className="yoast-wizard-image-upload-container-buttons">
					<RaisedButton label={this.props.translate( "Choose image" )}
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
	translate: React.PropTypes.func.isRequired,
	name: React.PropTypes.string.isRequired,
	value: React.PropTypes.any,
	onChange: React.PropTypes.func,
	properties: React.PropTypes.shape( {
		label: React.PropTypes.string,
	} ),
};

export default localize( MediaUpload );
