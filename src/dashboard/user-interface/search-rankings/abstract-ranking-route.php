<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Search_Rankings;

use Exception;
use WP_REST_Request;
use WP_REST_Response;
use WPSEO_Capability_Utils;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Dashboard\Domain\Search_Rankings\Search_Rankings_Data_Provider;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Search_Console_Parameters;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Abstract scores route.
 */
abstract class Abstract_Ranking_Route implements Route_Interface {

	use No_Conditionals;

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
	 * @var Search_Rankings_Data_Provider $search_rankings_data_provider
	 */
	private $search_rankings_data_provider;

	/**
	 * The constructor.
	 *
	 * @param Search_Rankings_Data_Provider $search_rankings_data_provider The data provider.
	 */
	public function __construct( Search_Rankings_Data_Provider $search_rankings_data_provider ) {
		$this->search_rankings_data_provider = $search_rankings_data_provider;
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
	 * @return string The route prefix.
	 *
	 * @throws Exception If the ROUTE_PREFIX constant is not set in the child class.
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
							'sanitize_callback' => 'sanitize_text_field',
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
			$this->request_parameters->set_start_date( '2024-01-01' );
			$this->request_parameters->set_end_date( '2025-01-01' );

			$search_data_container = $this->search_rankings_data_provider->get_data( $this->request_parameters );

		} catch ( Exception $exception ) {
			return new WP_REST_Response(
				[
					'error' => $exception->getMessage(),
				],
				$exception->getCode()
			);
		}

		return new WP_REST_Response(
			$search_data_container->to_array(),
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
