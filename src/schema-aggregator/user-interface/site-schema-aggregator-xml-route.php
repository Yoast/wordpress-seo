<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\User_Interface;

use WP_Error;
use WP_REST_Response;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command_Handler;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Aggregator_Config;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;

/**
 * Handles the route to represent all indexable post types as XML.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Site_Schema_Aggregator_Xml_Route implements Route_Interface {
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
	public const GET_SCHEMA_ROUTE = self::ROUTE_PREFIX . '/get-xml';

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
	 * @var Aggregate_Site_Schema_Map_Command_Handler
	 */
	private $aggregate_site_schema_map_command_handler;

	/**
	 * The XML cache manager instance.
	 *
	 * @var Xml_Manager
	 */
	private $xml_cache_manager;

	/**
	 * The aggregator configuration instance.
	 *
	 * @var Aggregator_Config
	 */
	private $aggregator_config;

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
	 * @param Config                                    $config                                    The config object.
	 * @param Capability_Helper                         $capability_helper                         The capability
	 *                                                                                             helper.
	 * @param Aggregate_Site_Schema_Map_Command_Handler $aggregate_site_schema_map_command_handler The command handler.
	 * @param Xml_Manager                               $xml_cache_manager                         The XML cache
	 *                                                                                             manager.
	 * @param Aggregator_Config                         $aggregator_config                         The aggregator
	 *                                                                                             configuration.
	 */
	public function __construct(
		Config $config,
		Capability_Helper $capability_helper,
		Aggregate_Site_Schema_Map_Command_Handler $aggregate_site_schema_map_command_handler,
		Xml_Manager $xml_cache_manager,
		Aggregator_Config $aggregator_config
	) {
		$this->config                                    = $config;
		$this->capability_helper                         = $capability_helper;
		$this->aggregate_site_schema_map_command_handler = $aggregate_site_schema_map_command_handler;
		$this->xml_cache_manager                         = $xml_cache_manager;
		$this->aggregator_config                         = $aggregator_config;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		$schema_aggregator_xml_route = [
			'methods'             => 'GET',
			'callback'            => [ $this, 'render_schema_xml' ],
			'permission_callback' => [ $this, 'get_permission_callback' ],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::GET_SCHEMA_ROUTE, $schema_aggregator_xml_route );
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
	 * Returns a XML representation of the possible post types that can be used for schema.
	 *
	 * @return WP_REST_Response|WP_Error The success or failure response.
	 */
	public function render_schema_xml() {
		$cached_xml = $this->xml_cache_manager->get();
		if ( $cached_xml !== null ) {
			$xml = $cached_xml;
		}
		else {

			$post_types = $this->aggregator_config->get_allowed_post_types();

			$command = new Aggregate_Site_Schema_Map_Command( $post_types );
			$xml     = $this->aggregate_site_schema_map_command_handler->handle( $command );

			$this->xml_cache_manager->set( $xml );
		}
		$response = new WP_REST_Response( $xml, 200 );
		$response->header( 'Content-Type', 'application/xml; charset=UTF-8' );
		$response->header( 'Cache-Control', 'public, max-age=300' );

		return $response;
	}
}
