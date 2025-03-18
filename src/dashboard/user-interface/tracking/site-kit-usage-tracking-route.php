<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Tracking;

use Exception;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Dashboard\Infrastructure\Tracking\Site_Kit_Usage_Tracking_Repository_Interface;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route to keep track of the Site Kit usage.
 *
 * @makePublic
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Site_Kit_Usage_Tracking_Route implements Route_Interface {

	use No_Conditionals;

	/**
	 *  The namespace for this route.
	 *
	 * @var string
	 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;

	/**
	 *  The prefix for this route.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/site_kit_usage_tracking';

	/**
	 * Holds the repository instance.
	 *
	 * @var Site_Kit_Usage_Tracking_Repository_Interface
	 */
	private $site_kit_usage_tracking_repository;

	/**
	 * Holds the capability helper instance.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * Constructs the class.
	 *
	 * @param Site_Kit_Usage_Tracking_Repository_Interface $site_kit_usage_tracking_repository The repository.
	 * @param Capability_Helper                            $capability_helper                  The capability helper.
	 */
	public function __construct(
		Site_Kit_Usage_Tracking_Repository_Interface $site_kit_usage_tracking_repository,
		Capability_Helper $capability_helper
	) {
		$this->site_kit_usage_tracking_repository = $site_kit_usage_tracking_repository;
		$this->capability_helper                  = $capability_helper;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		\register_rest_route(
			self::ROUTE_NAMESPACE,
			self::ROUTE_PREFIX,
			[
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'track_site_kit_usage' ],
					'permission_callback' => [ $this, 'check_capabilities' ],
					'args'                => [
						'element_name' => [
							'required'          => true,
							'type'              => 'string',
							'enum'              => [ 'setup_widget_loaded', 'first_interaction_stage', 'last_interaction_stage', 'setup_widget_dismissed' ],
							'sanitize_callback' => 'rest_sanitize_request_arg',
						],
						'element_value' => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'rest_sanitize_request_arg',
							'validate_callback' => [ $this, 'validate_element_value' ],
						],

					],
				],
			]
		);
	}

	/**
	 * Stores tracking information.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response|WP_Error The success or failure response.
	 */
	public function track_site_kit_usage( WP_REST_Request $request ) {
		$element_name  = $request->get_param( 'element_name' );
		$element_value = $request->get_param( 'element_value' );

		try {
			$result = $this->site_kit_usage_tracking_repository->set_site_kit_usage_tracking( $element_name, $element_value );
		} catch ( Exception $exception ) {
			return new WP_Error(
				'wpseo_set_site_kit_usage_tracking',
				$exception->getMessage(),
				(object) []
			);
		}

		return new WP_REST_Response(
			[
				'success' => $result,
			],
			( $result ) ? 200 : 400
		);
	}

	/**
	 * Custom validation callback for element_value.
	 *
	 * @param string          $element_value The value of the parameter.
	 * @param WP_REST_Request $request       The current request object.
	 * @param string          $param         The parameter name.
	 *
	 * @return bool|WP_Error True if the value is valid, WP_Error otherwise.
	 */
	public function validate_element_value( string $element_value, WP_REST_Request $request, string $param ) {
		$element_name = $request->get_param( 'element_name' );

		$valid_values = [
			'setup_widget_loaded'     => [ 'yes', 'no' ],
			'first_interaction_stage' => [ '1', '2', '3', '4' ],
			'last_interaction_stage'  => [ '1', '2', '3', '4' ],
			'setup_widget_dismissed'  => [ 'yes', 'no', 'permanently' ],
		];

		if ( isset( $valid_values[ $element_name ] ) && \in_array( $element_value, $valid_values[ $element_name ], true ) ) {
			return true;
		}

		return new WP_Error( 'rest_invalid_param', \sprintf( \__( 'The %s parameter is invalid.', 'text-domain' ), $param ) );
	}

	/**
	 * Checks if the current user has the required capabilities.
	 *
	 * @return bool
	 */
	public function check_capabilities() {
		return $this->capability_helper->current_user_can( 'wpseo_manage_options' );
	}
}
