<?php

namespace Yoast\WP\SEO\Routes;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Configuration\Configuration_Workout_Action;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;

/**
 * Configuration_Workout_Route class.
 */
class Configuration_Workout_Route implements Route_Interface {

	use No_Conditionals;

	/**
	 * Represents a site representation route.
	 *
	 * @var string
	 */
	const SITE_REPRESENTATION_ROUTE = '/site_representation';

	/**
	 * Represents a social profiles route.
	 *
	 * @var string
	 */
	const SOCIAL_PROFILES_ROUTE = '/social_profiles';

	/**
	 * Represents a route to enable/disable tracking.
	 *
	 * @var string
	 */
	const ENABLE_TRACKING_ROUTE = '/enable_tracking';

	/**
	 *  The configuration workout action.
	 *
	 * @var Configuration_Workout_Action;
	 */
	private $configuration_workout_action;

	/**
	 * Configuration_Workout_Route constructor.
	 *
	 * @param Configuration_Workout_Action $configuration_workout_action The configuration workout action.
	 */
	public function __construct(
		Configuration_Workout_Action $configuration_workout_action
	) {
		$this->configuration_workout_action = $configuration_workout_action;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		$manage_options = static function() {
			return \current_user_can( 'wpseo_manage_options' );
		};

		$site_representation_route = [
			[
				'methods'             => 'PUT',
				'callback'            => [ $this, 'set_site_representation' ],
				'permission_callback' => $manage_options,
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, Workouts_Route::WORKOUTS_ROUTE . self::SITE_REPRESENTATION_ROUTE, $site_representation_route );

		$social_profiles_route = [
			[
				'methods'             => 'PUT',
				'callback'            => [ $this, 'set_social_profiles' ],
				'permission_callback' => $manage_options,
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, Workouts_Route::WORKOUTS_ROUTE . self::SOCIAL_PROFILES_ROUTE, $social_profiles_route );

		$enable_tracking_route = [
			[
				'methods'             => 'PUT',
				'callback'            => [ $this, 'set_enable_tracking' ],
				'permission_callback' => $manage_options,
				'args'                => [
					'tracking' => [
						'type'     => 'boolean',
						'required' => true,
					],
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, Workouts_Route::WORKOUTS_ROUTE . self::ENABLE_TRACKING_ROUTE, $enable_tracking_route );
	}

	/**
	 * Sets the site representation values.
	 *
	 * @param \WP_REST_Request $request The request.
	 *
	 * @return \WP_REST_Response
	 */
	public function set_site_representation( \WP_REST_Request $request ) {
		$data = $this
			->configuration_workout_action
			->set_site_representation( $request->get_json_params() );

		return new \WP_REST_Response( $data, $data->status );
	}

	/**
	 * Sets the social profiles values.
	 *
	 * @param \WP_REST_Request $request The request.
	 *
	 * @return \WP_REST_Response
	 */
	public function set_social_profiles( \WP_REST_Request $request ) {
		$data = $this
			->configuration_workout_action
			->set_social_profiles( $request->get_json_params() );

		return new \WP_REST_Response( $data, $data->status );
	}

	/**
	 * Enables or disables tracking.
	 *
	 * @param \WP_REST_Request $request The request.
	 *
	 * @return \WP_REST_Response
	 */
	public function set_enable_tracking( \WP_REST_Request $request ) {
		$data = $this
			->configuration_workout_action
			->set_enable_tracking( $request->get_json_params() );

		return new \WP_REST_Response( $data, $data->status );
	}

	/**
	 * Validates the tracking parameter.
	 *
	 * @param string $tracking The tracking option.
	 *
	 * @return bool If the payload is valid or not.
	 */
	public function validate_enable_tracking( $tracking ) {
		return \in_array( $tracking, [ 'yes', 'no' ], true );
	}
}
