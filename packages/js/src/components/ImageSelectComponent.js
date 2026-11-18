/* eslint-disable complexity */
import { useCallback, useEffect, useMemo, useState } from "@wordpress/element";
import { ImageSelect } from "@yoast/components";
import { validateFacebookImage } from "@yoast/helpers";
import PropTypes from "prop-types";
import { fetchAttachment, openMedia } from "../helpers/selectMedia";

/**
 * Renders the ImageSelect.
 *
 * Using WP media to get an attachment and syncing to hidden fields.
 *
 * @param {string} hiddenField The ID of the hidden field for the image URL.
 * @param {string} [hiddenFieldImageId=""] The ID of the hidden field for the image ID.
 * @param {string} [hiddenFieldFallbackImageId=""] The ID of the hidden field for the fallback image ID.
 * @param {boolean} [hasImageValidation=false] Whether to validate the image.
 * @param {...Object} [imageSelectProps] Additional props for the ImageSelect.
 *
 * @returns {JSX.Element} The element.
 */
const ImageSelectComponent = ( {
	hiddenField,
	hiddenFieldImageId = "",
	hiddenFieldFallbackImageId = "",
	hasImageValidation = false,
	...imageSelectProps
} ) => {
	const [ usingFallback, setUsingFallback ] = useState( ( document.getElementById( hiddenFieldFallbackImageId ) !== null ) );
	const hiddenFieldElement = useMemo( () => document.getElementById( hiddenField ) );
	const hiddenFieldSelectImageElement = useMemo( () => document.getElementById( hiddenFieldImageId ) );

	let hiddenFieldImageIdElement = null;

	if ( hiddenFieldFallbackImageId && document.getElementById( hiddenFieldFallbackImageId ) ) {
		hiddenFieldImageIdElement = useMemo( () => document.getElementById( hiddenFieldFallbackImageId ) );
	} else {
		hiddenFieldImageIdElement = hiddenFieldSelectImageElement;
	}

	const [ image, setImage ] = useState( {
		url: hiddenFieldElement ? hiddenFieldElement.value : "",
		id: hiddenFieldImageIdElement ? parseInt( hiddenFieldImageIdElement.value, 10 ) : "",
		alt: "",
	} );
	const [ warnings, setWarnings ] = useState( [] );

	const updateHiddenFields = useCallback( data => {
		if ( hiddenFieldElement ) {
			hiddenFieldElement.value = data.url;
		}
		if ( hiddenFieldImageIdElement ) {
			hiddenFieldImageIdElement.value = data.id;
		}
	} );

	const selectImage = useCallback( () => openMedia( data => {
		hiddenFieldImageIdElement = hiddenFieldSelectImageElement;
		setImage( data );
		updateHiddenFields( data );
		if ( hasImageValidation ) {
			setWarnings( validateFacebookImage( data ) );
		}

		setUsingFallback( false );
	} ), [ hasImageValidation, updateHiddenFields ] );

	const removeImage = useCallback( () => {
		hiddenFieldImageIdElement = hiddenFieldSelectImageElement;
		const emptyImage = { url: "", id: "", alt: "" };
		setImage( emptyImage );
		updateHiddenFields( emptyImage );
		setWarnings( [] );
		setUsingFallback( true );
	}, [ updateHiddenFields ] );

	useEffect( () => {
		if ( image.id && ! image.alt ) {
			fetchAttachment( image.id ).then( data => setImage( data ) );
		}
	}, [ image ] );

	return <ImageSelect
		{ ...imageSelectProps }
		usingFallback={ usingFallback }
		imageUrl={ image.url }
		imageId={ image.id }
		imageAltText={ image.alt }
		onClick={ selectImage }
		onRemoveImageClick={ removeImage }
		warnings={ warnings }
	/>;
};

ImageSelectComponent.propTypes = {
	hiddenField: PropTypes.string.isRequired,
	hiddenFieldImageId: PropTypes.string,
	hiddenFieldFallbackImageId: PropTypes.string,
	hasImageValidation: PropTypes.bool,
};

export default ImageSelectComponent;
