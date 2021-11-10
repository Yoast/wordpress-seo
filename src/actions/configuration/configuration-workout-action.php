<?php

namespace Yoast\WP\SEO\Actions\Configuration;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Class Configuration_Workout_Action
 */
class Configuration_Workout_Action {

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

		$field_list = [
			'company_or_person',
			'company_name',
			'company_logo',
			'company_logo_id',
			'person_logo',
			'person_logo_id',
			'company_or_person_user_id',
			'description',
		];

		foreach ( $field_list as $field_name ) {
			if ( isset( $params[ $field_name ] ) ) {
				if ( $field_name === 'description' ) {
					$result = \update_option( 'blogdescription', $params['description'] );
				}
				else {
					$result = $this->options_helper->set( $field_name, $params[ $field_name ] );
				}
				if ( ! $result ) {
					$failures[] = $field_name;
				}
			}
		}

		if ( count( $failures ) === 0 ) {
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

		$field_list = [
			'facebook_site',
			'twitter_site',
			'instagram_url',
			'linkedin_url',
			'myspace_url',
			'pinterest_url',
			'youtube_url',
			'wikipedia_url',
		];

		foreach ( $field_list as $field_name ) {
			if ( isset( $params[ $field_name ] ) ) {
				$result = $this->options_helper->set( $field_name, $params[ $field_name ] );
				if ( ! $result ) {
					$failures[] = $field_name;
				}
			}
		}

		if ( count( $failures ) === 0 ) {
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
