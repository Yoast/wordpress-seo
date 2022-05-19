<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Helpers\Options_Helper;

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
		'facebook'   => 'get_non_valid_url',
		'instagram'  => 'get_non_valid_url',
		'linkedin'   => 'get_non_valid_url',
		'myspace'    => 'get_non_valid_url',
		'pinterest'  => 'get_non_valid_url',
		'soundcloud' => 'get_non_valid_url',
		'tumblr'     => 'get_non_valid_url',
		'twitter'    => 'get_non_valid_twitter',
		'youtube'    => 'get_non_valid_url',
		'wikipedia'  => 'get_non_valid_url',
	];

	/**
	 * The fields for the organization social profiles payload.
	 *
	 * @var array
	 */
	private $organization_social_profile_fields = [
		'facebook_site'     => 'get_non_valid_url',
		'twitter_site'      => 'get_non_valid_twitter',
		'other_social_urls' => 'get_non_valid_url_array',
	];

	/**
	 * The Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Social_Profiles_Helper constructor.
	 *
	 * @param Options_Helper $options_helper The WPSEO options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Gets the person social profiles stored in the database.
	 *
	 * @param int $person_id The id of the person.

	 * @return array The person's social profiles.
	 */
	public function get_person_social_profiles( $person_id ) {
		$social_profiles_fields = \array_keys( $this->person_social_profile_fields );
		$person_social_profiles = \array_combine( $social_profiles_fields, \array_fill( 0, count( $social_profiles_fields ), '' ) );

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
	 * Stores the values for the person's social profiles.
	 *
	 * @param int   $person_id       The id of the person to edit.
	 * @param array $social_profiles The array of the person's social profiles to be set.
	 *
	 * @return string[] An array of field names which failed to be saved in the db.
	 */
	public function set_person_social_profiles( $person_id, $social_profiles ) {
		$failures = [];

		// First validate all social profiles, before even attempting to save them.
		foreach ( $this->person_social_profile_fields as $field_name => $validation_method ) {
			if ( ! isset( $social_profiles[ $field_name ] ) ) {
				$failures[] = $field_name;
				continue;
			}

			if ( $social_profiles[ $field_name ] === '' ) {
				continue;
			}

			$value_to_validate = $social_profiles[ $field_name ];
			$failures          = \array_merge( $failures, \call_user_func( [ $this, $validation_method ], $value_to_validate, $field_name ) );
		}

		if ( ! empty( $failures ) ) {
			return $failures;
		}

		// All social profiles look good, now let's try to save them.
		foreach ( $this->person_social_profile_fields as $field_name => $validation_method ) {
			$social_profiles[ $field_name ] = $this->sanitize_social_field( $social_profiles[ $field_name ] );
			\update_user_meta( $person_id, $field_name, $social_profiles[ $field_name ] );
		}

		return $failures;
	}

	/**
	 * Stores the values for the organization's social profiles.
	 *
	 * @param array $social_profiles An array with the social profiles values to be saved in the db.
	 *
	 * @return string[] An array of field names which failed to be saved in the db.
	 */
	public function set_organization_social_profiles( $social_profiles ) {
		$failures = [];

		// First validate all social profiles, before even attempting to save them.
		foreach ( $this->organization_social_profile_fields as $field_name => $validation_method ) {
			if ( ! isset( $social_profiles[ $field_name ] ) ) {
				$failures[] = $field_name;
				continue;
			}
			$social_profiles[ $field_name ] = $this->sanitize_social_field( $social_profiles[ $field_name ] );

			$value_to_validate = $social_profiles[ $field_name ];
			$failures          = \array_merge( $failures, \call_user_func( [ $this, $validation_method ], $value_to_validate, $field_name ) );
		}

		if ( ! empty( $failures ) ) {
			return $failures;
		}

		// All social profiles look good, now let's try to save them.
		foreach ( \array_keys( $this->organization_social_profile_fields ) as $field_name ) {
			// Remove empty strings in Other Social URLs.
			if ( $field_name === 'other_social_urls' ) {
				$other_social_urls = \array_filter(
					$social_profiles[ $field_name ],
					static function( $other_social_url ) {
						return $other_social_url !== '';
					}
				);

				$social_profiles[ $field_name ] = \array_values( $other_social_urls );
			}

			$result = $this->options_helper->set( $field_name, $social_profiles[ $field_name ] );
			if ( ! $result ) {
				/**
				 * The value for Twitter might have been sanitised from URL to username.
				 * If so, $result will be false. We should check if the option value is part of the received value.
				 */
				if ( $field_name === 'twitter_site' ) {
					$current_option = $this->options_helper->get( $field_name );
					if ( ! \strpos( $social_profiles[ $field_name ], 'twitter.com/' . $current_option ) ) {
						$failures[] = $field_name;
					}
				}
				else {
					$failures[] = $field_name;
				}
			}
		}

		if ( ! empty( $failures ) ) {
			return $failures;
		}

		return [];
	}

	/**
	 * Returns a sanitized social field.
	 *
	 * @param string|array $social_field The social field to sanitize.
	 *
	 * @return string|array The sanitized social field.
	 */
	protected function sanitize_social_field( $social_field ) {
		if ( \is_array( $social_field ) ) {
			foreach ( $social_field as $key => $value ) {
				$social_field[ $key ] = \sanitize_text_field( $value );
			}

			return $social_field;
		}

		return \sanitize_text_field( $social_field );
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

	/**
	 * Checks if url is not valid and returns the name of the setting if it's not.
	 *
	 * @param string $url         The url to be validated.
	 * @param string $url_setting The name of the setting to be updated with the url.
	 *
	 * @return array An array with the setting that the non-valid url is about to update.
	 */
	protected function get_non_valid_url( $url, $url_setting ) {
		if ( $this->options_helper->validate_social_url( $url ) ) {
			return [];
		}

		return [ $url_setting ];
	}

	/**
	 * Checks if urls in an array are not valid and return the name of the setting if one of them is not, including the non-valid url's index in the array
	 *
	 * @param array  $urls         The urls to be validated.
	 * @param string $urls_setting The name of the setting to be updated with the urls.
	 *
	 * @return array An array with the settings that the non-valid urls are about to update, suffixed with a dash-separated index of the positions of those settings, eg. other_social_urls-2.
	 */
	protected function get_non_valid_url_array( $urls, $urls_setting ) {
		$non_valid_url_array = [];

		foreach ( $urls as $key => $url ) {
			if ( ! $this->options_helper->validate_social_url( $url ) ) {
				$non_valid_url_array[] = $urls_setting . '-' . $key;
			}
		}

		return $non_valid_url_array;
	}

	/**
	 * Checks if the twitter value is not valid and returns the name of the setting if it's not.
	 *
	 * @param array  $twitter_site    The twitter value to be validated.
	 * @param string $twitter_setting The name of the twitter setting to be updated with the value.
	 *
	 * @return array An array with the setting that the non-valid twitter value is about to update.
	 */
	protected function get_non_valid_twitter( $twitter_site, $twitter_setting ) {
		if ( empty( $twitter_site ) || $this->options_helper->validate_twitter_id( $twitter_site, false ) ) {
			return [];
		}

		return [ $twitter_setting ];
	}
}
