import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import { openMedia } from "../../helpers/selectMedia";
import { ImageSelect, TextInput } from "@yoast/components";


/**
 * The Organization section.
 *
 * @returns {WPElement} The organization section.
 */
export function OrganizationSection( { dispatch, imageUrl, organizationName, isDisabled } ) {
	const openImageSelect = useCallback( () => {
		openMedia( ( selectedImage ) => {
			dispatch( { type: "SET_COMPANY_LOGO", payload: { ...selectedImage } } );
		} );
	}, [ openMedia ] );

	const removeImage = useCallback( () => {
		dispatch( { type: "REMOVE_COMPANY_LOGO" } );
	} );

	const handleChange = useCallback( ( value ) => {
		dispatch( { type: "CHANGE_COMPANY_NAME", payload: value } );
	} );

	return (
		<>
			<TextInput
				id="organization-name-input"
				name="organization-name"
				label={ __( "Organization name", "wordpress-seo" ) }
				value={ organizationName }
				onChange={ handleChange }
				readOnly={ isDisabled }
			/>
			<ImageSelect
				imageUrl={ imageUrl }
				onClick={ openImageSelect }
				onRemoveImageClick={ removeImage }
				imageAltText=""
				hasPreview={ true }
				label={ __( "Organization logo", "wordpress-seo" ) }
				isDisabled={ isDisabled }
			/>
		</>
	);
}
