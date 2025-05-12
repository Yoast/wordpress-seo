<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Tracking;

use Exception;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Dashboard\Infrastructure\Tracking\Setup_Steps_Tracking_Repository_Interface;
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
class Setup_Steps_Tracking_Route implements Route_Interface {

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
	public const ROUTE_PREFIX = '/setup_steps_tracking';

	/**
	 * Holds the repository instance.
	 *
	 * @var Setup_Steps_Tracking_Repository_Interface
	 */
	private $setup_steps_tracking_repository;

	/**
	 * Holds the capability helper instance.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * Returns the needed conditionals.
	 *
	 * @return array<string> The conditionals that must be met to load this.
	 */
	public static function get_conditionals(): array {
		return [ Google_Site_Kit_Feature_Conditional::class ];
	}

	/**
	 * Constructs the class.
	 *
	 * @param Setup_Steps_Tracking_Repository_Interface $setup_steps_tracking_repository The repository.
	 * @param Capability_Helper                         $capability_helper               The capability helper.
	 */
	public function __construct(
		Setup_Steps_Tracking_Repository_Interface $setup_steps_tracking_repository,
		Capability_Helper $capability_helper
	) {
		$this->setup_steps_tracking_repository = $setup_steps_tracking_repository;
		$this->capability_helper               = $capability_helper;
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
					'callback'            => [ $this, 'track_setup_steps' ],
					'permission_callback' => [ $this, 'check_capabilities' ],
					'args'                => [
						'setup_widget_loaded' => [
							'required'          => false,
							'type'              => 'string',
							'enum'              => [ 'yes', 'no' ],
						],
						'first_interaction_stage' => [
							'required'          => false,
							'type'              => 'string',
							'enum'              => [ 'install', 'activate', 'setup', 'grantConsent', 'successfullyConnected' ],
						],
						'last_interaction_stage' => [
							'required'          => false,
							'type'              => 'string',
							'enum'              => [ 'install', 'activate', 'setup', 'grantConsent', 'successfullyConnected' ],
						],
						'setup_widget_temporarily_dismissed' => [
							'required'          => false,
							'type'              => 'string',
							'enum'              => [ 'yes', 'no' ],
						],
						'setup_widget_permanently_dismissed' => [
							'required'          => false,
							'type'              => 'string',
							'enum'              => [ 'yes', 'no' ],
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
	public function track_setup_steps( WP_REST_Request $request ) {
			$data = [
				'setup_widget_loaded'                => $request->get_param( 'setupWidgetLoaded' ),
				'first_interaction_stage'            => $request->get_param( 'firstInteractionStage' ),
				'last_interaction_stage'             => $request->get_param( 'lastInteractionStage' ),
				'setup_widget_temporarily_dismissed' => $request->get_param( 'setupWidgetTemporarilyDismissed' ),
				'setup_widget_permanently_dismissed' => $request->get_param( 'setupWidgetPermanentlyDismissed' ),
			];

			try {
				foreach ( $data as $key => $value ) {
					if ( $value !== null ) {
						$success = $this->setup_steps_tracking_repository->set_setup_steps_tracking_element( $key, $value );
						if ( ! $success ) {
							return new WP_Error(
								'wpseo_set_site_kit_usage_tracking',
								\sprintf( \__( 'Failed to save the tracking data for: %s.', 'wordpress-seo' ), $key ),
								[ 'status' => 400 ]
							);
						}
					}
				}
			} catch ( Exception $exception ) {
				return new WP_Error(
					'wpseo_set_site_kit_usage_tracking',
					\__( 'An error occurred while saving the tracking data.', 'wordpress-seo' ),
					[
						'status'    => 500,
						'exception' => $exception->getMessage(),
					]
				);
			}

			return new WP_REST_Response( [ 'success' => true ], 200 );
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
