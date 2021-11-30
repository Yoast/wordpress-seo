import { useCallback, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import { openMedia } from "../../helpers/selectMedia";
import { FieldGroup, ImageSelect } from "@yoast/components";
import WordPressUserSelector from "../../components/WordPressUserSelector";
import PropTypes from "prop-types";

/**
 * The Person section.
 *
 * @param {function} dispatch     The function to update the container's state.
 * @param {string}   imageUrl     The image URL.
 * @param {integer}  personId     The ID of the user.
 * @param {bool}     isDisabled   A flag to disable the field.
 * @returns {WPElement} The person section.
 */
export function PersonSection( { dispatch, imageUrl, personId, isDisabled } ) {
	const openImageSelect = useCallback( () => {
		openMedia( ( selectedImage ) => {
			dispatch( { type: "SET_PERSON_LOGO", payload: { ...selectedImage } } );
		} );
	}, [ openMedia ] );

	const removeImage = useCallback( () => {
		dispatch( { type: "REMOVE_PERSON_LOGO" } );
	} );

	const onUserChange = useCallback(
		( value ) => dispatch( { type: "SET_PERSON_ID", payload: value } ),
		[ dispatch ] );

	return (
		<Fragment>
			<FieldGroup
				label={ __( "Name (important)", "wordpress-seo" ) }
				htmlFor={ "person_id" }
			>
				<WordPressUserSelector
					value={ personId }
					onChange={ onUserChange }
					name={ "person_id" }
				/>
			</FieldGroup>
			<ImageSelect
				imageUrl={ imageUrl }
				onClick={ openImageSelect }
				onRemoveImageClick={ removeImage }
				imageAltText=""
				hasPreview={ true }
				label={ __( "Person logo / avatar (important)", "wordpress-seo" ) }
				isDisabled={ isDisabled }
				replaceImageButtonId={ "person-logo-replace-button" }
				selectImageButtonId={ "person-logo-select-button" }
				removeImageButtonId={ "person-logo-remove-button" }
			/>
		</Fragment>
	);
}

PersonSection.propTypes = {
	dispatch: PropTypes.func.isRequired,
	imageUrl: PropTypes.string,
	personId: PropTypes.number,
	isDisabled: PropTypes.bool,
};

PersonSection.defaultProps = {
	imageUrl: "",
	personId: 0,
	isDisabled: false,
};
