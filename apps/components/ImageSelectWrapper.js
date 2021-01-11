import React, { Fragment } from "react";
import { ImageSelect } from "@yoast/components";

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
			imageUrl: "",
			hasPreview: true,
		};
		this.setImageUrl = this.setStateAttribute.bind( this, "imageUrl" );
		this.changePreview = this.setStateAttribute.bind( this, "hasPreview" );
	}

	/**
	 * @returns {void} Void.
	 *
	 * @param {Object} attr Attributes.
	 * @param {string} value Value.
	 */
	setStateAttribute( attr, value ) {
		this.setState( state => ( {
			...state,
			[ attr ]: value,
		} ) );
	}

	/**
	 * Renders the ImageSelect.
	 *
	 * @returns {*} Void.
	 */
	render() {
		return (
			<Fragment>
				<button onClick={ () => this.changePreview( ! this.state.hasPreview ) }>Toggle preview</button>
				<div className="yoast">
					<h2>ImageSelect</h2>
					<ImageSelect
						imageUrlInputId="test-image"
						imageUrl={ this.state.imageUrl }
						imageSelected={ !! this.state.imageUrl }
						hasPreview={ this.state.hasPreview }
						label={ "Organization" }
						selectImageButtonId="bla1"
						replaceImageButtonId="bla2"
						removeImageButtonId="bla3"
						onClick={ () => this.setImageUrl( "http://placekitten.com/g/200/300" ) }
						onRemoveImageClick={ () => this.setImageUrl( "" ) }
						warnings={ [ "Oepsiepoepsie!" ] }
					/>
				</div>
			</Fragment>

		);
	}
};
export default ImageSelectWrapper;
