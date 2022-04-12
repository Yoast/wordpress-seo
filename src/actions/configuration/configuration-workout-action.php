<?php

namespace Yoast\WP\SEO\Actions\Configuration;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Social_Profiles_Helper;

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
	 * The Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * The Social_Profiles_Helper instance.
	 *
	 * @var Social_Profiles_Helper
	 */
	protected $social_profiles_helper;

	/**
	 * Configuration_Workout_Action constructor.
	 *
	 * @param Options_Helper         $options_helper         The WPSEO options helper.
	 * @param Social_Profiles_Helper $social_profiles_helper The social profiles helper.
	 */
	public function __construct( Options_Helper $options_helper, Social_Profiles_Helper $social_profiles_helper ) {
		$this->options_helper         = $options_helper;
		$this->social_profiles_helper = $social_profiles_helper;
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
		$failures = $this->social_profiles_helper->set_organization_social_profiles( $params );

		if ( empty( $failures ) ) {
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
		$social_profiles = \array_filter(
			$params,
			function ( $key ) {
				return $key !== 'user_id';
			},
			ARRAY_FILTER_USE_KEY
		);

		$failures = $this->social_profiles_helper->set_person_social_profiles( $params['user_id'], $social_profiles );

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
	 * @param int $user_id the person id.
	 *
	 * @return object The response object.
	 */
	public function get_person_social_profiles( $user_id ) {

		return (object) [
			'success'         => true,
			'status'          => 200,
			'social_profiles' => $this->social_profiles_helper->get_person_social_profiles( $user_id ),
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

	/**
	 * Checks if the current user has the capability a specific user.
	 *
	 * @param int $user_id The id of the user to be edited.
	 *
	 * @return object The response object.
	 */
	public function check_capability( $user_id ) {
		if ( $this->social_profiles_helper->can_edit_profile( $user_id ) ) {
			return (object) [
				'success' => true,
				'status'  => 200,
			];
		}

		return (object) [
			'success' => false,
			'status'  => 403,
		];
	}
}
