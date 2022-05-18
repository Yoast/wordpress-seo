import { useCallback, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import TextInput from "../../base/text-input";
import ImageSelect from "../../base/image-select";

import { openMedia } from "../../../../helpers/selectMedia";

/**
 * The Organization section.
 *
 * @param {function} dispatch     The function to update the container's state.
 * @param {string}   imageUrl         The image URL.
 * @param {string}   organizationName The name of the organization.
 * @param {bool}     isDisabled       A flag to disable the field.
 * @returns {WPElement} The organization section.
 */
export function OrganizationSection( { dispatch, imageUrl, organizationName, errorFields } ) {
	const openImageSelect = useCallback( () => {
		openMedia( ( selectedImage ) => {
			dispatch( { type: "SET_COMPANY_LOGO", payload: { ...selectedImage } } );
		} );
	}, [ openMedia ] );

	const removeImage = useCallback( () => {
		dispatch( { type: "REMOVE_COMPANY_LOGO" } );
	} );

	const handleChange = useCallback( ( event ) => {
		dispatch( { type: "CHANGE_COMPANY_NAME", payload: event.target.value } );
	} );

	return (
		<Fragment>
			<TextInput
				className="yst-mt-6"
				id="organization-name-input"
				name="organization-name"
				label={ __( "Organization name", "wordpress-seo" ) }
				value={ organizationName }
				onChange={ handleChange }
				feedback={ {
					isVisible: errorFields.includes( "company_name" ),
					message: [ __( "We could not save the organization name. Please check the value.", "wordpress-seo" ) ],
					type: "error",
				} }
			/>
			<ImageSelect
				className="yst-mt-6"
				id="organization-logo-input"
				url={ imageUrl }
				onSelectImageClick={ openImageSelect }
				onRemoveImageClick={ removeImage }
				imageAltText=""
				hasPreview={ true }
				label={ __( "Organization logo", "wordpress-seo" ) }
			/>
		</Fragment>
	);
}

OrganizationSection.propTypes = {
	dispatch: PropTypes.func.isRequired,
	imageUrl: PropTypes.string,
	organizationName: PropTypes.string,
	errorFields: PropTypes.array,
};

OrganizationSection.defaultProps = {
	imageUrl: "",
	organizationName: "",
	errorFields: [],
};
