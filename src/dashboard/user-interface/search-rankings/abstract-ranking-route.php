<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Search_Rankings;

use DateTime;
use DateTimeZone;
use Exception;
use WP_REST_Request;
use WP_REST_Response;
use WPSEO_Capability_Utils;
use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Dashboard_Repository_Interface;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Search_Console_Parameters;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Abstract scores route.
 */
abstract class Abstract_Ranking_Route implements Route_Interface {

	/**
	 * The namespace of the rout.
	 *
	 * @var string
	 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;
	/**
	 * The prefix of the rout.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = null;

	/**
	 * The request parameters.
	 *
	 * @var Search_Console_Parameters $request_parameters
	 */
	private $request_parameters;

	/**
	 * The data provider.
	 *
	 * @var Dashboard_Repository_Interface $search_rankings_repository
	 */
	private $search_rankings_repository;

	/**
	 * Returns the needed conditionals.
	 *
	 * @return array<string> The conditionals that must be met to load this.
	 */
	public static function get_conditionals(): array {
		return [ Google_Site_Kit_Feature_Conditional::class ];
	}

	/**
	 * The constructor.
	 *
	 * @param Dashboard_Repository_Interface $search_rankings_repository The data provider.
	 */
	public function __construct( Dashboard_Repository_Interface $search_rankings_repository ) {
		$this->search_rankings_repository = $search_rankings_repository;
	}

	/**
	 * Sets the request parameters.
	 *
	 * @param Search_Console_Parameters $request_parameters The API request parameters.
	 *
	 * @return void
	 */
	public function set_request_parameters(
		Search_Console_Parameters $request_parameters
	) {
		$this->request_parameters = $request_parameters;
	}

	/**
	 * Returns the route prefix.
	 *
	 * @throws Exception If the ROUTE_PREFIX constant is not set in the child class.
	 * @return string The route prefix.
	 */
	public static function get_route_prefix() {
		$class  = static::class;
		$prefix = $class::ROUTE_PREFIX;

		if ( $prefix === null ) {
			throw new Exception( 'Ranking route without explicit prefix' );
		}

		return $prefix;
	}

	/**
	 * Registers routes for scores.
	 *
	 * @return void
	 */
	public function register_routes() {
		\register_rest_route(
			self::ROUTE_NAMESPACE,
			$this->get_route_prefix(),
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_rankings' ],
					'permission_callback' => [ $this, 'permission_manage_options' ],
					'args'                => [
						'limit' => [
							'required'          => true,
							'type'              => 'int',
							'sanitize_callback' => static function ( $param ) {
								return \intval( $param );
							},
							'default'           => 5,
						],

					],
				],
			]
		);
	}

	/**
	 * Gets the rankings of a specific amount of pages.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The success or failure response.
	 */
	public function get_rankings( WP_REST_Request $request ): WP_REST_Response {
		try {
			$this->request_parameters->set_limit( $request->get_param( 'limit' ) );
			$date = new DateTime( 'now', new DateTimeZone( 'UTC' ) );
			$date->modify( '-28 days' );

			$this->request_parameters->set_start_date( $date->format( 'Y-m-d' ) );
			$this->request_parameters->set_end_date( ( new DateTime( 'now', new DateTimeZone( 'UTC' ) ) )->format( 'Y-m-d' ) );

			$search_rankings_container = $this->search_rankings_repository->get_data( $this->request_parameters );

		} catch ( Exception $exception ) {
			return new WP_REST_Response(
				[
					'error' => $exception->getMessage(),
				],
				$exception->getCode()
			);
		}

		return new WP_REST_Response(
			$search_rankings_container->to_array(),
			200
		);
	}

	/**
	 * Permission callback.
	 *
	 * @return bool True when user has the 'wpseo_manage_options' capability.
	 */
	public function permission_manage_options() {
		return WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' );
	}
}
