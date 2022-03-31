<?php

namespace Yoast\WP\SEO\Integrations\Admin;

/**
 * Class Social_Profiles_Helper.
 */
class Social_Profiles_Helper {

	/**
	 * The fields for the person social profiles payload.
	 *
	 * @var array
	 */
	private $person_social_profile_fields = [
		'facebook',
		'instagram',
		'linkedin',
		'myspace',
		'pinterest',
		'soundcloud',
		'tumblr',
		'twitter',
		'youtube',
		'wikipedia',
	];

	/**
	 * Gets the social profiles fields names.
	 *
	 * @return string[] The social profiles fields names.
	 */
	public function get_person_social_profiles_fields() {
		return $this->person_social_profile_fields;
	}

	/**
	 * Gets the person social profiles stored in the database.
	 *
	 * @param int $person_id The id of the person.

	 * @return array The person's social profiles.
	 */
	public function get_person_social_profiles( $person_id ) {
		$person_social_profiles = \array_combine( $this->person_social_profile_fields, \array_fill( 0, count( $this->person_social_profile_fields ), '' ) );

		// If no person has been selected, $person_id is set to false.
		if ( \is_numeric( $person_id ) ) {
			foreach ( \array_keys( $person_social_profiles ) as $field_name ) {
				$value = \get_user_meta( $person_id, $field_name, true );
				// If $person_id is an integer but does not represent a valid user, get_user_meta returns false.
				if ( ! \is_bool( $value ) ) {
					$person_social_profiles[ $field_name ] = $value;
				}
			}
		}

		return $person_social_profiles;
	}

	/**
	 * Stores the values for the social profiles.
	 *
	 * @param int   $person_id       The id of the person to edit.
	 * @param array $social_profiles The array of the person's social profiles.
	 *
	 * @return string[] An array of field names which failed to be saved in the db.
	 */
	public function set_person_social_profiles( $person_id, $social_profiles ) {
		$failures = [];
		// Validation to be added.
		foreach ( $this->person_social_profile_fields as $field_name ) {
			if ( isset( $social_profiles[ $field_name ] ) ) {
				\update_user_meta( $person_id, $field_name, $social_profiles[ $field_name ] );
			}
		}

		return $failures;
	}

	/**
	 * Checks if the current user has the capability to edit a specific user.
	 *
	 * @param int $person_id The id of the person to edit.
	 *
	 * @return bool
	 */
	public function can_edit_profile( $person_id ) {
		return \current_user_can( 'edit_user', $person_id );
	}
}
