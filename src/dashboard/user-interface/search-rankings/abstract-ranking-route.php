<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Search_Rankings;

use Exception;
use WP_REST_Request;
use WP_REST_Response;
use WPSEO_Capability_Utils;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Dashboard\Domain\Search_Rankings\Request_Parameters;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Rankings\Search_Rankings_Parser;
use Yoast\WP\SEO\Dashboard\Infrastructure\Site_Kit_Adapter_Interface;
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
	 * @var Request_Parameters $request_parameters
	 */
	private $request_parameters;

	/**
	 * The API adapter.
	 *
	 * @var Site_Kit_Adapter_Interface $site_kit_search_console_adapter
	 */
	private $site_kit_search_console_adapter;

	/**
	 * The rankings parser.
	 *
	 * @var Search_Rankings_Parser $search_rankings_parser
	 */
	private $search_rankings_parser;

	/**
	 * The constructor.
	 *
	 * @param Site_Kit_Adapter_Interface $site_kit_search_console_adapter The adapter.
	 * @param Search_Rankings_Parser     $search_rankings_parser          The parser.
	 */
	public function __construct( Site_Kit_Adapter_Interface $site_kit_search_console_adapter, Search_Rankings_Parser $search_rankings_parser ) {
		$this->site_kit_search_console_adapter = $site_kit_search_console_adapter;
		$this->search_rankings_parser          = $search_rankings_parser;
	}

	/**
	 * Sets the request parameters.
	 *
	 * @param Request_Parameters $request_parameters The API request parameters.
	 *
	 * @return void
	 */
	public function set_request_parameters(
		Request_Parameters $request_parameters
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
			$this->request_parameters->set_end_date( '2025-01-02' );

			$results = $this->site_kit_search_console_adapter->get_data( $this->request_parameters );

		} catch ( Exception $exception ) {
			return new WP_REST_Response(
				[
					'error' => $exception->getMessage(),
				],
				$exception->getCode()
			);
		}

		$search_data_container = $this->search_rankings_parser->parse( $results );

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
