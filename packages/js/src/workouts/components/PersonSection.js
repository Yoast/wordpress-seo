import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import { openMedia } from "../../helpers/selectMedia";
import WordPressUserSelectorSearchAppearance from "../../components/WordPressUserSelectorSearchAppearance";
import { ImageSelect } from "@yoast/components";

/**
 * The Person section.
 * @returns {WPElement} The person section.
 */
export function PersonSection( { dispatch, imageUrl, isDisabled } ) {
	const openImageSelect = useCallback( () => {
		openMedia( ( selectedImage ) => {
			dispatch( { type: "SET_PERSON_LOGO", payload: { ...selectedImage } } );
		} );
	}, [ openMedia ] );

	const removeImage = useCallback( () => {
		dispatch( { type: "REMOVE_PERSON_LOGO" } );
	} );
	return (
		<>
			<WordPressUserSelectorSearchAppearance />
			<ImageSelect
				imageUrl={ imageUrl }
				onClick={ openImageSelect }
				onRemoveImageClick={ removeImage }
				imageAltText=""
				hasPreview={ true }
				label={ __( "Person logo / avatar *", "wordpress-seo" ) }
				isDisabled={ isDisabled }
			/>
		</>
	);
}
