import { useCallback, useState, createInterpolateElement, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

import { openMedia } from "../../../../helpers/selectMedia";
import UserSelector from "./user-selector";
import { FadeInAlert } from "../../base/alert";
import ImageSelect from "../../base/image-select";

/**
 * The Person section.
 *
 * @param {function} dispatch     The function to update the container's state.
 * @param {string}   imageUrl     The image URL.
 * @param {integer}  personId     The ID of the user.
 * @param {bool}     isDisabled   A flag to disable the field.
 * @returns {WPElement} The person section.
 */
export function PersonSection( { dispatch, imageUrl, personId } ) {
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
		( { value, label } ) => {
			setPersonName( label );
			dispatch( { type: "SET_PERSON_ID", payload: value } );
		},
		[ dispatch ]
	);

	const userMessage = createInterpolateElement(
		sprintf(
			// translators: %1$s is replaced by the selected user's name, and %2$s and %3$s are opening and closing anchor tags.
			__(
				"You have selected the user %1$s as the person this site represents. This user profile information will now be used in search results. %2$sUpdate this profile to make sure the information is correct%3$s.",
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

	return (
		<Fragment>
			<UserSelector
				initialValue={ personId }
				onChangeCallback={ onUserChange }
				name={ "person_id" }
				placeholder={ __( "Select a user", "wordpress-seo" ) }
			/>
			<FadeInAlert
				id="user-representation-alert"
				isVisible={ personId !== 0 }
				type="info"
				className="yst-mt-5"
			>
				{ userMessage }
			</FadeInAlert>
			<ImageSelect
				className="yst-mt-6"
				id="person-logo-input"
				url={ imageUrl }
				onSelectImageClick={ openImageSelect }
				onRemoveImageClick={ removeImage }
				imageAltText=""
				hasPreview={ true }
				label={ __( "Personal logo or avatar", "wordpress-seo" ) }
			/>
		</Fragment>
	);
}

PersonSection.propTypes = {
	dispatch: PropTypes.func.isRequired,
	imageUrl: PropTypes.string,
	personId: PropTypes.number,
};

PersonSection.defaultProps = {
	imageUrl: "",
	personId: 0,
};
