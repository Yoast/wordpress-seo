<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\User_Interface;

use Exception;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Command;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Command_Handler;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;

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
	public const ROUTE_PREFIX = 'schema-aggregator';

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
	 * The cache manager instance.
	 *
	 * @var Manager
	 */
	private $cache_manager;

	/**
	 * Returns the conditional for this route.
	 *
	 * @return array<string> The conditionals that must be met to load this.
	 */
	public static function get_conditionals() {
		return [ Schema_Aggregator_Conditional::class ];
	}

	/**
	 * Site_Schema_Aggregator_Route constructor.
	 *
	 * @param Config                                $config                                The config object.
	 * @param Capability_Helper                     $capability_helper                     The capability helper.
	 * @param Aggregate_Site_Schema_Command_Handler $aggregate_site_schema_command_handler The command handler.
	 * @param Manager                               $cache_manager                         The cache manager.
	 */
	public function __construct(
		Config $config,
		Capability_Helper $capability_helper,
		Aggregate_Site_Schema_Command_Handler $aggregate_site_schema_command_handler,
		Manager $cache_manager
	) {
		$this->config                                = $config;
		$this->capability_helper                     = $capability_helper;
		$this->aggregate_site_schema_command_handler = $aggregate_site_schema_command_handler;
		$this->cache_manager                         = $cache_manager;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		$base_route_config = [
			'methods'             => 'GET',
			'callback'            => [ $this, 'aggregate_site_schema' ],
			'permission_callback' => [ $this, 'get_permission_callback' ],
			'args'                => [
				'post_type' => [
					'required'          => true,
					'validate_callback' => static function ( $param ) {
						return \is_string( $param ) && \preg_match( '/^[a-z0-9_-]+$/', $param ) && \post_type_exists( $param );
					},
					'sanitize_callback' => 'sanitize_key',
				],
			],
		];

		$schema_aggregator_route_page                 = $base_route_config;
		$schema_aggregator_route_page['args']['page'] = [
			'default'           => 1,
			'validate_callback' => static function ( $param ) {
				return \is_numeric( $param ) && $param > 0 && $param < \PHP_INT_MAX;
			},
			'sanitize_callback' => 'absint',
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::GET_SCHEMA_ROUTE . '/(?P<post_type>[a-z0-9_-]+)', $base_route_config );
		\register_rest_route( Main::API_V1_NAMESPACE, self::GET_SCHEMA_ROUTE . '/(?P<post_type>[a-z0-9_-]+)/(?P<page>\d+)', $schema_aggregator_route_page );
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
		$post_type = $request->get_param( 'post_type' );
		$page      = ( $request->get_param( 'page' ) ?? 1 );
		$per_page  = $this->config->get_per_page( $post_type );

		$output = $this->cache_manager->get( $post_type, $page, $per_page );
		if ( $output === null ) {
			try {
				$output = $this->aggregate_site_schema_command_handler->handle( new Aggregate_Site_Schema_Command( $page, $per_page, $post_type ) );
				$this->cache_manager->set( $post_type, $page, $per_page, $output );

			} catch ( Exception $exception ) {
				return new WP_Error(
					'wpseo_aggregate_site_schema_error',
					$exception->getMessage(),
					(object) []
				);
			}
		}
		$response = \rest_ensure_response( $output );

		$response->header( 'Cache-Control', 'public, max-age=300' );

		return $response;
	}
}
