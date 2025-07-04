<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Llms_Txt\User_Interface;

use Exception;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\Llms_Txt_Enabled_Conditional;
use Yoast\WP\SEO\Dashboard\Domain\Time_Based_SEO_Metrics\Repository_Not_Found_Exception;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\Available_Posts\Available_Posts_Repository;
use Yoast\WP\SEO\Llms_Txt\Domain\Available_Posts\Data_Provider\Parameters;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Available posts route.
 */
class Available_Posts_Route implements Route_Interface {

	/**
	 * The namespace of the route.
	 *
	 * @var string
	 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;

	/**
	 * The prefix of the route.
	 *
	 * @var string
	 */
	public const ROUTE_NAME = '/available_posts';

	/**
	 * Holds the available posts repository.
	 *
	 * @var Available_Posts_Repository
	 */
	private $available_posts_repository;

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
		return [ Llms_Txt_Enabled_Conditional::class ];
	}

	/**
	 * The constructor.
	 *
	 * @param Available_Posts_Repository $available_posts_repository The data provider for the available posts.
	 * @param Capability_Helper          $capability_helper          The capability helper.
	 */
	public function __construct(
		Available_Posts_Repository $available_posts_repository,
		Capability_Helper $capability_helper
	) {
		$this->available_posts_repository = $available_posts_repository;
		$this->capability_helper          = $capability_helper;
	}

	/**
	 * Registers routes for scores.
	 *
	 * @return void
	 */
	public function register_routes() {
		\register_rest_route(
			self::ROUTE_NAMESPACE,
			self::ROUTE_NAME,
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_available_posts' ],
					'permission_callback' => [ $this, 'permission_manage_options' ],
					'args'                => [
						'search'   => [
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
							'default'           => '',
						],
						'postType' => [
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
							'default'           => 'page',
						],
					],
				],
			]
		);
	}

	/**
	 * Gets the time based SEO metrics.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The success or failure response.
	 *
	 * @throws Repository_Not_Found_Exception When the given widget name is not implemented yet.
	 */
	public function get_available_posts( WP_REST_Request $request ): WP_REST_Response {
		try {
			$request_parameters = new Parameters( $request->get_param( 'postType' ), $request->get_param( 'search' ) );

			$available_posts_container = $this->available_posts_repository->get_posts( $request_parameters );

		} catch ( Exception $exception ) {
			return new WP_REST_Response(
				[
					'error' => $exception->getMessage(),
				],
				$exception->getCode()
			);
		}

		return new WP_REST_Response(
			$available_posts_container->to_array(),
			200
		);
	}

	/**
	 * Permission callback.
	 *
	 * @return bool True when user has the 'wpseo_manage_options' capability.
	 */
	public function permission_manage_options() {
		return $this->capability_helper->current_user_can( 'wpseo_manage_options' );
	}
}
