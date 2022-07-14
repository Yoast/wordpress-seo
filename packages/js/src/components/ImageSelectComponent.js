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
 * @returns {JSX.Element} The ImageSelectComponent.
 */
const ImageSelectComponent = ( { hiddenField, hiddenFieldImageId, hiddenFieldFallbackImageId, hasImageValidation, ...imageSelectProps } ) => {

	const [ usingFallback, setUsingFallback ] = useState( ( document.getElementById( hiddenFieldFallbackImageId  ) !== null ) );
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

ImageSelectComponent.defaultProps = {
	hiddenFieldImageId: "",
	hiddenFieldFallbackImageId: "",
	hasImageValidation: false,
};

export default ImageSelectComponent;
