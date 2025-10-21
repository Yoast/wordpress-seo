<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Nlweb\Schema_Aggregator\User_Interface;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Nlweb\Schema_Aggregator\Application\Aggregate_Site_Schema_Command;
use Yoast\WP\SEO\Nlweb\Schema_Aggregator\Application\Aggregate_Site_Schema_Command_Handler;
use Yoast\WP\SEO\Nlweb\Schema_Aggregator\Infrastructure\Config;
use Yoast\WP\SEO\Nlweb\Schema_Aggregator\Infrastructure\Site_Schema_Json_Conditional;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Handles the route to represent a site's schema as JSON.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Site_Schema_Aggregator_Route implements Route_Interface {
	/**
	 * Represents the site schema prefix.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = 'yoast-nlweb';

	/**
	 * Represents route to view the schema.
	 *
	 * @var string
	 */
	public const GET_SCHEMA_ROUTE = self::ROUTE_PREFIX . '/get-schema';

	/**
	 * The configuration instance.
	 *
	 * @var Config
	 */
	private $config;

	/**
	 * The capability helper instance.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The command handler instance.
	 *
	 * @var Aggregate_Site_Schema_Command_Handler
	 */
	private $aggregate_site_schema_command_handler;

	/**
	 * Returns the conditional for this route.
	 *
	 * @return array<string> The conditionals that must be met to load this.
	 */
	public static function get_conditionals() {
		return [ Site_Schema_Json_Conditional::class ];
	}

	/**
	 * Site_Schema_Aggregator_Route constructor.
	 *
	 * @param Config                                $config                                The config object.
	 * @param Capability_Helper                     $capability_helper                     The capability helper.
	 * @param Aggregate_Site_Schema_Command_Handler $aggregate_site_schema_command_handler The command handler.
	 */
	public function __construct( Config $config, Capability_Helper $capability_helper, Aggregate_Site_Schema_Command_Handler $aggregate_site_schema_command_handler ) {
		$this->config                                = $config;
		$this->capability_helper                     = $capability_helper;
		$this->aggregate_site_schema_command_handler = $aggregate_site_schema_command_handler;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		$schema_aggregator_route = [
			'methods'             => 'GET',
			'callback'            => [ $this, 'aggregate_site_schema' ],
			'permission_callback' => [ $this, 'get_permission_callback' ],
			'args'                => [
				'page'     => [
					'default'           => 1,
					'validate_callback' => static function ( $param ) {
						return \is_numeric( $param ) && $param > 0;
					},
					'sanitize_callback' => 'absint',
				],
				'per_page' => [
					'default'           => $this->config->get_per_page(),
					'validate_callback' => function ( $param ) {
						return \is_numeric( $param ) && $param > 0 && $param <= $this->config->get_max_per_page();
					},
					'sanitize_callback' => 'absint',
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::GET_SCHEMA_ROUTE, $schema_aggregator_route );
	}

	/**
	 * Permission callback for the route.
	 *
	 * @return bool True if the user has permission, false otherwise.
	 */
	public function get_permission_callback(): bool {
		return true;
	}

	/**
	 * Returns a JSON representation of a site.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response|WP_Error The success or failure response.
	 */
	public function aggregate_site_schema( WP_REST_Request $request ) {
		$page     = $request->get_param( 'page' );
		$per_page = $request->get_param( 'per_page' );

		try {
			$result = $this->aggregate_site_schema_command_handler->handle( new Aggregate_Site_Schema_Command( $page, $per_page ) );
		} catch ( Exception $exception ) {
			return new WP_Error(
				'wpseo_aggregate_site_schema_error',
				$exception->getMessage(),
				(object) []
			);
		}
		$output = \str_replace( "\n", \PHP_EOL . "\t", $result );
		return new WP_REST_Response(
			$output,
			( $result ) ? 200 : 400
		);
	}
}
