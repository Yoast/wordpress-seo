<?php

namespace Yoast\WP\SEO\Actions\Configuration;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Class Configuration_Workout_Action.
 */
class Configuration_Workout_Action {

	/**
	 * The fields for the site representation payload.
	 */
	const SITE_REPRESENTATION_FIELDS = [
		'company_or_person',
		'company_name',
		'company_logo',
		'company_logo_id',
		'person_logo',
		'person_logo_id',
		'company_or_person_user_id',
		'description',
	];

	/**
	 * The fields for the social profiles payload.
	 */
	const SOCIAL_PROFILES_FIELDS = [
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
	 * Configuration_Workout_Action constructor.
	 *
	 * @param Options_Helper $options_helper The WPSEO options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Stores the values for the site representation.
	 *
	 * @param array $params The values to store.
	 *
	 * @return object The response object.
	 */
	public function set_site_representation( $params ) {
		$failures = [];

		foreach ( self::SITE_REPRESENTATION_FIELDS as $field_name ) {
			if ( isset( $params[ $field_name ] ) ) {
				if ( $field_name === 'description' && \current_user_can( 'manage_options' ) ) {
					$result = \update_option( 'blogdescription', $params['description'] );
					if ( ! $result && $params['description'] === \get_option( 'blogdescription' ) ) {
						$result = true;
					}
				}
				else {
					$result = $this->options_helper->set( $field_name, $params[ $field_name ] );
				}
				if ( ! $result ) {
					$failures[] = $field_name;
				}
			}
		}

		if ( \count( $failures ) === 0 ) {
			return (object) [
				'success' => true,
				'status'  => 200,
			];
		}
		return (object) [
			'success'  => false,
			'status'   => 500,
			'error'    => 'Could not save some options in the database',
			'failures' => $failures,
		];
	}

	/**
	 * Stores the values for the social profiles.
	 *
	 * @param array $params The values to store.
	 *
	 * @return object The response object.
	 */
	public function set_social_profiles( $params ) {
		$failures         = [];
		$invalid_settings = [];

		// First validate all social profiles, before even attempting to save them.
		foreach ( self::SOCIAL_PROFILES_FIELDS as $field_name => $validation_method ) {
			$value_to_validate = $params[ $field_name ];
			$invalid_settings  = \array_merge( $invalid_settings, \call_user_func( [ $this, $validation_method ], $value_to_validate, $field_name ) );
		}

		if ( ! empty( $invalid_settings ) ) {
			return (object) [
				'success'  => false,
				'status'   => 500,
				'error'    => 'Could not save some options in the database',
				'failures' => $invalid_settings,
			];
		}

		// All social profiles look good, now let's try to save them.
		foreach ( array_keys( self::SOCIAL_PROFILES_FIELDS ) as $field_name ) {
			if ( isset( $params[ $field_name ] ) ) {
				$result = $this->options_helper->set( $field_name, $params[ $field_name ] );
				if ( ! $result ) {
					/**
					 * The value for Twitter might have been sanitised from URL to username.
					 * If so, $result will be false. We should check if the option value is part of the received value.
					 */
					if ( $field_name === 'twitter_site' ) {
						$current_option = $this->options_helper->get( $field_name );
						if ( ! \strpos( $params[ $field_name ], 'twitter.com/' . $current_option ) ) {
							$failures[] = $field_name;
						}
					}
					else {
						$failures[] = $field_name;
					}
				}
			}
		}

		if ( \count( $failures ) === 0 ) {
			return (object) [
				'success' => true,
				'status'  => 200,
			];
		}
		return (object) [
			'success'  => false,
			'status'   => 500,
			'error'    => 'Could not save some options in the database',
			'failures' => $failures,
		];
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
		// @todo Implement validating twitter values.
		return [];
	}

	/**
	 * Stores the values to enable/disable tracking.
	 *
	 * @param array $params The values to store.
	 *
	 * @return object The response object.
	 */
	public function set_enable_tracking( $params ) {
		$success      = true;
		$option_value = $this->options_helper->get( 'tracking' );

		if ( $option_value !== $params['tracking'] ) {
			$success = $this->options_helper->set( 'tracking', $params['tracking'] );
		}

		if ( $success ) {
			return (object) [
				'success' => true,
				'status'  => 200,
			];
		}
		return (object) [
			'success' => false,
			'status'  => 500,
			'error'   => 'Could not save the option in the database',
		];
	}
}
