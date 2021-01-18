import { ImageSelect } from "@yoast/components";

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

		this.onClick = this.onClick.bind( this );
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
	onClick( imageUrl ) {
		this.setState( { imageUrl }, () => {
			this.element.imageUrl = imageUrl;
		} );
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
			/>
		);
	}
}

export default ImageSelectComponent;
