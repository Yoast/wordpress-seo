import apiFetch from "@wordpress/api-fetch";
import { useCallback, useMemo, createInterpolateElement, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

import { openMedia } from "../../../../helpers/selectMedia";
import UserSelector from "./user-selector";
import { FadeInAlert } from "../../base/alert";
import ImageSelect from "../../base/image-select";

/**
 * The Person section.
 *
 * @param {Object}   props                      The props object.
 * @param {function} props.dispatch             The function to update the container's state.
 * @param {string}   props.imageUrl             The image URL.
 * @param {string}   props.fallbackImageUrl     The fallback image URL for when there is no image.
 * @param {object}   props.person               The user.
 * @param {Boolean}  props.canEditUser          Whether the current user can edit the selected person's profile.

 * @returns {WPElement} The person section.
 */
export function PersonSection( { dispatch, imageUrl, fallbackImageUrl, person, canEditUser } ) {
	const openImageSelect = useCallback( () => {
		openMedia( ( selectedImage ) => {
			dispatch( { type: "SET_PERSON_LOGO", payload: { ...selectedImage } } );
		} );
	}, [ openMedia ] );

	const removeImage = useCallback( () => {
		dispatch( { type: "REMOVE_PERSON_LOGO" } );
	} );

	const onUserChange = useCallback(
		( selectedPerson ) => {
			dispatch( { type: "SET_PERSON", payload: selectedPerson } );
			apiFetch( {
				path: `yoast/v1/configuration/check_capability?user_id=${ selectedPerson.value  }`,
			} ).then( response => {
				dispatch( { type: "SET_CAN_EDIT_USER", payload: response.success } );
			} ).catch(
				( e ) => {
					console.error( e.message  );
				}
			);
		},
		[ dispatch ]
	);

	const userMessage = useMemo( () => createInterpolateElement(
		sprintf(
			// translators: %1$s is replaced by the selected user's name, and %2$s and %3$s are opening and closing anchor tags.
			canEditUser
				? __(
					"You have selected the user %1$s as the person this site represents. This user profile information will now be used in search results. %2$sUpdate this profile to make sure the information is correct%3$s.",
					"wordpress-seo"
				)
				: __(
					"You have selected the user %1$s as the person this site represents. This user profile information will now be used in search results. You're not allowed to update this user profile, so please ask this user or an admin to make sure the information is correct.",
					"wordpress-seo"
				),
			`<b>${ person.name }</b>`,
			"<a>",
			"</a>"
		),
		{
			b: <b />,
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a
				id="yoast-configuration-user-selector-user-link"
				href={ window.wpseoScriptData.userEditUrl.replace( "{user_id}", person.id ) }
				target="_blank" rel="noopener noreferrer"
			/>,
		}
	), [ person.id, person.name, canEditUser ] );

	return (
		<Fragment>
			<UserSelector
				initialValue={ person }
				onChangeCallback={ onUserChange }
				name={ "person_id" }
				placeholder={ __( "Select a user", "wordpress-seo" ) }
			/>
			<FadeInAlert
				id="user-representation-alert"
				isVisible={ person.id !== 0 }
				type="info"
				className="yst-mt-5"
			>
				{ userMessage }
			</FadeInAlert>
			<ImageSelect
				className="yst-mt-6"
				id="person-logo-input"
				url={ imageUrl }
				fallbackUrl={ fallbackImageUrl }
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
	fallbackImageUrl: PropTypes.string,
	person: PropTypes.shape( {
		id: PropTypes.number,
		name: PropTypes.string,
	} ),
	canEditUser: PropTypes.bool.isRequired,
};

PersonSection.defaultProps = {
	imageUrl: "",
	fallbackImageUrl: "",
	person: {
		id: 0,
		name: "",
	},
};
