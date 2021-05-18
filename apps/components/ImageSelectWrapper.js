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
			warnings: [],
		};
		this.setImageUrl = this.setStateAttribute.bind( this, "imageUrl" );
		this.changePreview = this.setStateAttribute.bind( this, "hasPreview" );
		this.toggleWarning = this.toggleWarning.bind( this );
	}

	/**
	 * State setting function.
	 *
	 * @param {Object} attr Attributes.
	 * @param {string} value Value.
	 *
	 * @returns {void} Void.
	 */
	setStateAttribute( attr, value ) {
		this.setState( state => ( {
			...state,
			[ attr ]: value,
		} ) );
	}

	/**
	 * Set filled array if warnings is empty. Empty array if warnings is full.
	 *
	 * @returns {void} Void.
	 */
	toggleWarning() {
		if ( this.state.warnings.length === 0 ) {
			this.setState( { warnings: [ "Oops! Something's wrong!" ] } );
			return;
		}
		this.setState( { warnings: [] } );
	}

	/**
	 * Renders the ImageSelect.
	 *
	 * @returns {*} Void.
	 */
	render() {
		return (
			<Fragment>
				<button onClick={ () => this.toggleWarning() }>Toggle warning</button>
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
						warnings={ this.state.warnings }
					/>
				</div>
			</Fragment>

		);
	}
};
export default ImageSelectWrapper;
