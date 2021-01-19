import { ImageSelect } from "@yoast/components";
import { openMedia } from "../helpers/selectMedia";

import { Component } from "@wordpress/element";
/* eslint-disable */
/**
 * Renders the ImageSelect.
 */
class ImageSelectComponent extends Component {
	/**
	 * The ImageSelectComponent constructor.
	 *
	 * @param {Object} props The components props.
	 */
	constructor( props ) {
		super( props );

		this.element = document.getElementById( this.props.hiddenField );
		this.state = {
			imageUrl: this.getInitialValue(),
			label: this.props.label,
			hasPreview: this.props.hasPreview,
		};

		this.setMyImageUrl = this.setMyImageUrl.bind( this );
		this.onClick = this.onClick.bind( this );
		this.removeImage = this.removeImage.bind( this );
	}

	/**
	 * Gets the initial value from the hidden input field.
	 *
	 * @returns {string} The image url.
	 */
	getInitialValue() {
		return this.element.imageUrl;
	}

	/**
	 * Handles change event for the image select.
	 *
	 * First updates its internal state and then updates the hidden input.
	 *
	 * @param {string} imageUrl The image url.
	 *
	 * @returns {void}
	 */
	setMyImageUrl( imageUrl ) {
		this.setState( { imageUrl }, () => {
			this.element.imageUrl = imageUrl;
		} );
	}

	/**
	 * Function called when ImageSelect component button is clicked.
	 *
	 * @returns {void}
	 */
	onClick() {
		/**
		 * Callback function for selectMedia. Performs actions with the 'image' Object that it gets as an argument.
		 *
		 * @param {Object} image Object containing data about the selected image.
		 *
		 * @param {Function} onSelect Callback function received from openMedia. Gets object image' as an argument.
		 *
		 * @returns {void}
		 */
		const imageCallback = ( image ) => {
			this.setMyImageUrl( image.url );
		};
		openMedia( imageCallback );
	}

	/**
	 * Function called when 'remove image' button of ImageSelect component is clicked.
	 *
	 * @returns {void}
	 */
	removeImage() {
		const imageUrl = "";
		this.setMyImageUrl( imageUrl );
	}

	/**
	 * Renders the ImageSelect component.
	 *
	 * @returns {wp.Element} The rendered component.
	 */
	render() {
		return (
			<ImageSelect
				label={ this.state.label }
				hasPreview={ this.state.hasPreview }
				imageUrl={ this.state.imageUrl }
				onClick={ this.onClick }
				onRemoveImageClick= { this.removeImage }
			/>
		);
	}
}

export default ImageSelectComponent;
