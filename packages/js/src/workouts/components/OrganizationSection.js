import { useCallback, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import { openMedia } from "../../helpers/selectMedia";
import { ImageSelect, TextInput } from "@yoast/components";
import PropTypes from "prop-types";

/**
 * The Organization section.
 *
 * @param {function} dispatch     The function to update the container's state.
 * @param {string}   imageUrl         The image URL.
 * @param {string}   organizationName The name of the organization.
 * @param {bool}     isDisabled       A flag to disable the field.
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
		<Fragment>
			<TextInput
				id="organization-name-input"
				name="organization-name"
				label={ __( "Organization name (important)", "wordpress-seo" ) }
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
				label={ __( "Organization logo (important)", "wordpress-seo" ) }
				isDisabled={ isDisabled }
				replaceImageButtonId={ "organization-logo-replace-button" }
				selectImageButtonId={ "organization-logo-select-button" }
				removeImageButtonId={ "organization-logo-remove-button" }
			/>
		</Fragment>
	);
}

OrganizationSection.propTypes = {
	dispatch: PropTypes.func.isRequired,
	imageUrl: PropTypes.string,
	organizationName: PropTypes.string,
	isDisabled: PropTypes.bool,
};

OrganizationSection.defaultProps = {
	imageUrl: "",
	organizationName: "",
	isDisabled: false,
};
