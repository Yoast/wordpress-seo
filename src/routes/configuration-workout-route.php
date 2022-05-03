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
	 * Represents a person's social profiles route.
	 *
	 * @var string
	 */
	const PERSON_SOCIAL_PROFILES_ROUTE = '/person_social_profiles';

	/**
	 * Represents a route to enable/disable tracking.
	 *
	 * @var string
	 */
	const ENABLE_TRACKING_ROUTE = '/enable_tracking';

	/**
	 * Represents a route to check if current user has the correct capabilities to edit another user's profile.
	 *
	 * @var string
	 */
	const CHECK_CAPABILITY_ROUTE = '/check_capability';

	/**
	 *  The configuration workout action.
	 *
	 * @var Configuration_Workout_Action
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
		$site_representation_route = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'set_site_representation' ],
			'permission_callback' => [ $this, 'can_manage_options' ],
			'args'                => [
				'company_or_person' => [
					'type'     => 'string',
					'enum'     => [
						'company',
						'person',
					],
					'required' => true,
				],
				'company_name' => [
					'type'     => 'string',
				],
				'company_logo' => [
					'type'     => 'string',
				],
				'company_logo_id' => [
					'type'     => 'integer',
				],
				'person_logo' => [
					'type'     => 'string',
				],
				'person_logo_id' => [
					'type'     => 'integer',
				],
				'company_or_person_user_id' => [
					'type'     => 'integer',
				],
				'description' => [
					'type'     => 'string',
				],
			],
		];
		\register_rest_route( Main::API_V1_NAMESPACE, Workouts_Route::WORKOUTS_ROUTE . self::SITE_REPRESENTATION_ROUTE, $site_representation_route );

		$social_profiles_route = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'set_social_profiles' ],
			'permission_callback' => [ $this, 'can_manage_options' ],
			'args'                => [
				'facebook_site' => [
					'type'     => 'string',
				],
				'twitter_site' => [
					'type'     => 'string',
				],
				'other_social_urls' => [
					'type'     => 'array',
				],
			],
		];
		\register_rest_route( Main::API_V1_NAMESPACE, Workouts_Route::WORKOUTS_ROUTE . self::SOCIAL_PROFILES_ROUTE, $social_profiles_route );

		$person_social_profiles_route = [
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get_person_social_profiles' ],
				'permission_callback' => [ $this, 'can_manage_options' ],
				'args'                => [
					'user_id' => [
						'required' => true,
					],
				],
			],
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'set_person_social_profiles' ],
				'permission_callback' => [ $this, 'can_edit_user' ],
				'args'                => [
					'user_id' => [
						'type'     => 'integer',
					],
					'facebook' => [
						'type'     => 'string',
					],
					'instagram' => [
						'type'     => 'string',
					],
					'linkedin' => [
						'type'     => 'string',
					],
					'myspace' => [
						'type'     => 'string',
					],
					'pinterest' => [
						'type'     => 'string',
					],
					'soundcloud' => [
						'type'     => 'string',
					],
					'tumblr' => [
						'type'     => 'string',
					],
					'twitter' => [
						'type'     => 'string',
					],
					'youtube' => [
						'type'     => 'string',
					],
					'wikipedia' => [
						'type'     => 'string',
					],
				],
			],
		];
		\register_rest_route( Main::API_V1_NAMESPACE, Workouts_Route::WORKOUTS_ROUTE . self::PERSON_SOCIAL_PROFILES_ROUTE, $person_social_profiles_route );

		$check_capability_route = [
			'methods'             => 'GET',
			'callback'            => [ $this, 'check_capability' ],
			'permission_callback' => [ $this, 'can_manage_options' ],
			'args'                => [
				'user_id' => [
					'required' => true,
				],
			],
		];
		\register_rest_route( Main::API_V1_NAMESPACE, Workouts_Route::WORKOUTS_ROUTE . self::CHECK_CAPABILITY_ROUTE, $check_capability_route );

		$enable_tracking_route = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'set_enable_tracking' ],
			'permission_callback' => [ $this, 'can_manage_options' ],
			'args'                => [
				'tracking' => [
					'type'     => 'boolean',
					'required' => true,
				],
			],
		];
		\register_rest_route( Main::API_V1_NAMESPACE, Workouts_Route::WORKOUTS_ROUTE . self::ENABLE_TRACKING_ROUTE, $enable_tracking_route );
	}

	/**
	 * Sets the site representation values.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function set_site_representation( WP_REST_Request $request ) {
		$data = $this
			->configuration_workout_action
			->set_site_representation( $request->get_json_params() );

		return new WP_REST_Response( $data, $data->status );
	}

	/**
	 * Sets the social profiles values.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function set_social_profiles( WP_REST_Request $request ) {
		$data = $this
			->configuration_workout_action
			->set_social_profiles( $request->get_json_params() );

		return new WP_REST_Response(
			[ 'json' => $data ]
		);
	}

	/**
	 * Gets a person's social profiles values.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_person_social_profiles( WP_REST_Request $request ) {
		$data = $this
			->configuration_workout_action
			->get_person_social_profiles( $request->get_param( 'user_id' ) );

		return new WP_REST_Response( $data, $data->status );
	}

	/**
	 * Sets a person's social profiles values.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function set_person_social_profiles( WP_REST_Request $request ) {
		$data = $this
			->configuration_workout_action
			->set_person_social_profiles( $request->get_json_params() );

		return new WP_REST_Response(
			[ 'json' => $data ]
		);
	}

	/**
	 * Checks if the current user has the correct capability to edit a specific user.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function check_capability( WP_REST_Request $request ) {
		$data = $this
			->configuration_workout_action
			->check_capability( $request->get_param( 'user_id' ) );

		return new WP_REST_Response( $data );
	}

	/**
	 * Enables or disables tracking.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function set_enable_tracking( WP_REST_Request $request ) {
		$data = $this
			->configuration_workout_action
			->set_enable_tracking( $request->get_json_params() );

		return new WP_REST_Response( $data, $data->status );
	}

	/**
	 * Checks if the current user has the right capability.
	 *
	 * @return bool
	 */
	public function can_manage_options() {
		return \current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Checks if the current user has the capability to edit a specific user.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return bool
	 */
	public function can_edit_user( WP_REST_Request $request ) {
		return $this->configuration_workout_action->check_capability( $request->get_param( 'user_id' ) );
	}
}
