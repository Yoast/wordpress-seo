import React from "react";
import { ImageSelect } from "@yoast/components/src/image-select";

/**
 * @returns {void} Void.
 */
class ImageSelectWrapper extends React.Component {
	/**
	 * The constructor.
	 *
	 * @param {Object} props The props.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			imageUrl: "https://placekitten.com/100/150",
		};
		this.setImageUrl = this.setStateAttribute.bind( this, "imageUrl" );
	}
	/**
	 * @returns {void} Void
	 *
	 * @param {Object} attr Attributes
	 * @param {string} value Value
	 */
	setStateAttribute( attr, value ) {
		this.setState( state => ( {
			...state,
			[ attr ]: value,
		} ) );
	}
	/**
	 * Renders
	 * @returns {*} blaa
	 */
	render() {
		return (
			<div className="yoast">
				<h2>ImageSelect</h2>
				<ImageSelect
					imageUrlInputId="test-image"
					imageUrl={ this.state.imageUrl }
					imageSelected={ !! this.state.imageUrl }
					selectImageButtonId="bla1"
					replaceImageButtonId="bla2"
					removeImageButtonId="bla3"
				/>
			</div>
		);
	}
};
export default ImageSelectWrapper;
