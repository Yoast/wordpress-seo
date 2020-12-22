import React, { useState } from "react";
import { ImageSelect } from "@yoast/components/src/image-select";

/**
 * Function that displays all the reactified components that we currently have.
 *
 * @returns {*} A div with all reactified components.
 */
function ImageSelectWrapper() {
	// const [ imageSelected, setImageSelected ] = useState( 0 );
	return (
		<div className="yoast">
			<h2>ImageSelect</h2>
			<ImageSelect
				imageUrlInputId="test-image"
				imageUrl="http://test.fakse.test.fake"
				// imageSelected={ imageSelected }
				imageSelected={ false }
				// onClick={ () => setImageSelected( ! imageSelected ) }
				// onRemoveImageClick={ () => setImageSelected( false ) }
				onClick={ () => console.log( "tada" ) }
				onRemoveImageClick={ () => console.log( "tadalida" ) }
				selectImageButtonId="bla1"
				replaceImageButtonId="bla2"
				removeImageButtonId="bla3"
			/>
		</div>
	);
};
export default ImageSelectWrapper;
