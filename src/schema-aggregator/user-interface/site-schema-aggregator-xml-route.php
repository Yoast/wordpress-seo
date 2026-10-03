<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\User_Interface;

use WP_REST_Response;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Provider;
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
	 * The schema map XML provider.
	 *
	 * @var Schema_Map_Xml_Provider
	 */
	private $schema_map_xml_provider;

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
	 * @param Schema_Map_Xml_Provider $schema_map_xml_provider The schema map XML provider.
	 */
	public function __construct( Schema_Map_Xml_Provider $schema_map_xml_provider ) {
		$this->schema_map_xml_provider = $schema_map_xml_provider;
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
	 * @codeCoverageIgnore -- No sensible tests can be written for this.
	 *
	 * @return bool True if the user has permission, false otherwise.
	 */
	public function get_permission_callback(): bool {
		return true;
	}

	/**
	 * Returns a XML representation of the post types that are used for schema.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function render_schema_xml() {
		$response = new WP_REST_Response( $this->schema_map_xml_provider->get_xml(), 200 );
		$response->header( 'Content-Type', 'application/xml; charset=UTF-8' );
		$response->header( 'Cache-Control', 'public, max-age=300' );

		return $response;
	}
}
