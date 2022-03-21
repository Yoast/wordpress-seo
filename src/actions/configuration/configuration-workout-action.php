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
		'facebook_site',
		'twitter_site',
		'other_social_urls',
	];

	/**
	 * The fields for the person social profiles payload.
	 */
	const PERSON_SOCIAL_PROFILES_FIELDS = [
		'facebook',
		'twitter',
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
		$failures = [];

		foreach ( self::SOCIAL_PROFILES_FIELDS as $field_name ) {
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
	 * Stores the values for the social profiles.
	 *
	 * @param array $params The values to store.
	 *
	 * @return object The response object.
	 */
	public function set_person_social_profiles( $params ) {
		$failures = [];

		foreach ( self::PERSON_SOCIAL_PROFILES_FIELDS as $field_name ) {
			if ( isset( $params[ $field_name ] ) ) {
				$result = $this->options_helper->set( $field_name, $params[ $field_name ] );
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
	 * Gets the values for the social profiles.
	 *
	 * @param array $params the person id.
	 *
	 * @return object The response object.
	 */
	public function get_person_social_profiles( $person_id ) {
		$social_profiles = [];
		if (\current_user_can( 'edit_user', $person_id)) {
			foreach ( self::PERSON_SOCIAL_PROFILES_FIELDS as $field_name ) {
				$social_profiles[$field_name] = \get_user_meta($person_id, $field_name, true);
			}
			return (object) [
				'success' => true,
				'status'  => 200,
				'social_profiles' => $social_profiles,
			];
		}

		return (object) [
			'success' => false,
			'status'  => 500,
			'error'    => 'The current user has not the permission to edit the selected user',
		];
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
