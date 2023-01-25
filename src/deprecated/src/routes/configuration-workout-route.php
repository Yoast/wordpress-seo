<?php

namespace Yoast\WP\SEO\Routes;

use WP_REST_Request;
use Yoast\WP\SEO\Actions\Configuration\Configuration_Workout_Action;
use Yoast\WP\SEO\Conditionals\No_Conditionals;

/**
 * Configuration_Workout_Route class.
 *
 * @deprecated 19.0 - Use \Yoast\WP\SEO\Actions\First_Time_Configuration_Action instead.
 * @codeCoverageIgnore
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
	 * Configuration_Workout_Route constructor.
	 *
	 * @deprecated 19.0
	 * @codeCoverageIgnore
	 *
	 * @param Configuration_Workout_Action $configuration_workout_action The configuration workout action.
	 */
	public function __construct(
		Configuration_Workout_Action $configuration_workout_action
	) {
		\_deprecated_function( __METHOD__, 'WPSEO 19.0' );
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @deprecated 19.0
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_routes() {
		\_deprecated_function( __METHOD__, 'WPSEO 19.0', '\Yoast\WP\SEO\Routes\First_Time_Configuration_Route::register_routes' );
	}

	/**
	 * Sets the site representation values.
	 *
	 * @deprecated 19.0
	 * @codeCoverageIgnore
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return void
	 */
	public function set_site_representation( WP_REST_Request $request ) {
		\_deprecated_function( __METHOD__, 'WPSEO 19.0', '\Yoast\WP\SEO\Routes\First_Time_Configuration_Route::set_site_representation' );
	}

	/**
	 * Sets the social profiles values.
	 *
	 * @deprecated 19.0
	 * @codeCoverageIgnore
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return void
	 */
	public function set_social_profiles( WP_REST_Request $request ) {
		\_deprecated_function( __METHOD__, 'WPSEO 19.0', '\Yoast\WP\SEO\Routes\First_Time_Configuration_Route::set_social_profiles' );
	}

	/**
	 * Gets a person's social profiles values.
	 *
	 * @deprecated 19.0
	 * @codeCoverageIgnore
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return void
	 */
	public function get_person_social_profiles( WP_REST_Request $request ) {
		\_deprecated_function( __METHOD__, 'WPSEO 19.0', '\Yoast\WP\SEO\Routes\First_Time_Configuration_Route::get_person_social_profiles' );
	}

	/**
	 * Sets a person's social profiles values.
	 *
	 * @deprecated 19.0
	 * @codeCoverageIgnore
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return void
	 */
	public function set_person_social_profiles( WP_REST_Request $request ) {
		\_deprecated_function( __METHOD__, 'WPSEO 19.0', '\Yoast\WP\SEO\Routes\First_Time_Configuration_Route::set_person_social_profiles' );
	}

	/**
	 * Checks if the current user has the correct capability to edit a specific user.
	 *
	 * @deprecated 19.0
	 * @codeCoverageIgnore
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return void
	 */
	public function check_capability( WP_REST_Request $request ) {
		\_deprecated_function( __METHOD__, 'WPSEO 19.0', '\Yoast\WP\SEO\Routes\First_Time_Configuration_Route::check_capability' );
	}

	/**
	 * Enables or disables tracking.
	 *
	 * @deprecated 19.0
	 * @codeCoverageIgnore
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return void
	 */
	public function set_enable_tracking( WP_REST_Request $request ) {
		\_deprecated_function( __METHOD__, 'WPSEO 19.0', '\Yoast\WP\SEO\Routes\First_Time_Configuration_Route::set_enable_tracking' );
	}

	/**
	 * Checks if the current user has the right capability.
	 *
	 * @deprecated 19.0
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public function can_manage_options() {
		\_deprecated_function( __METHOD__, 'WPSEO 19.0', '\Yoast\WP\SEO\Routes\First_Time_Configuration_Route::can_manage_options' );

		return \current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Checks if the current user has the capability to edit a specific user.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return void
	 */
	public function can_edit_user( WP_REST_Request $request ) {
		\_deprecated_function( __METHOD__, 'WPSEO 19.0', '\Yoast\WP\SEO\Routes\First_Time_Configuration_Route::can_edit_user' );
	}
}
