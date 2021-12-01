import { useCallback, useState, createInterpolateElement, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";

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
	const [ personName, setPersonName ] = useState( "" );
	const openImageSelect = useCallback( () => {
		openMedia( ( selectedImage ) => {
			dispatch( { type: "SET_PERSON_LOGO", payload: { ...selectedImage } } );
		} );
	}, [ openMedia ] );

	const removeImage = useCallback( () => {
		dispatch( { type: "REMOVE_PERSON_LOGO" } );
	} );

	const onUserChange = useCallback(
		( value, name ) => {
			setPersonName( name );
			dispatch( { type: "SET_PERSON_ID", payload: value } );
		},
		[ dispatch ]
	);

	/* eslint-disable max-len */
	const userMessage = createInterpolateElement(
		sprintf(
			// translators: %1$s is replaced by the selected user's name, and %2$s and %3$s are opening and closing anchor tags.
			__(
				"You have selected the user %1$s as the person this site represents. Their user profile information will now be used in search results. %2$sUpdate their profile to make sure the information is correct.%3$s Alternatively, ask the user or an admin to do it if you are not allowed.",
				"wordpress-seo"
			),
			`<b>${ personName }</b>`,
			"<a>",
			"</a>"
		),
		{
			b: <b />,
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a
				id="yoast-configuration-workout-user-selector-user-link"
				href={ window.wpseoScriptData.searchAppearance.userEditUrl.replace( "{user_id}", personId ) }
				target="_blank" rel="noopener noreferrer"
			/>,
		}
	);
	/* eslint-enable max-len */

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
				{ personId !== 0 && <p>{ userMessage }</p> }
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
