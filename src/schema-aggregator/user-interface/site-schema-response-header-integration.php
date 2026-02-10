<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\User_Interface;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Header_Adapter;

/**
 * Integration to set proper response headers for Site Schema endpoints.
 */
class Site_Schema_Response_Header_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The schema map header adapter.
	 *
	 * @var Schema_Map_Header_Adapter
	 */
	private $schema_map_header_adapter;

	/**
	 * Constructor.
	 *
	 * @param Schema_Map_Header_Adapter $schema_map_header_adapter The schema map header adapter.
	 */
	public function __construct( Schema_Map_Header_Adapter $schema_map_header_adapter ) {
		$this->schema_map_header_adapter = $schema_map_header_adapter;
	}

	/**
	 * Registers the hooks for the integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'rest_pre_serve_request', [ $this, 'serve_custom_response' ], 10, 4 );
	}

	/**
	 * Serve custom responses (XML or JSON) for schemamap endpoints
	 *
	 * Intercepts schemamap index endpoints to serve either XML or JSON with
	 * proper content types and formatting. For XML responses (from /schema),
	 * outputs raw XML. For JSON responses (from /schema.json or post-type endpoints),
	 * outputs JSON with unescaped slashes for cleaner URLs.
	 *
	 * Only affects /yoast/v1/schema-aggregator endpoints. Other endpoints are unaffected.
	 *
	 * @param bool             $served  Whether the request has already been served.
	 * @param WP_REST_Response $result  Result to send to the client.
	 * @param WP_REST_Request  $request Request object.
	 *
	 * @return bool True if we served the request, false otherwise.
	 * @codeCoverageIgnore ignore this since its needs to rely on headers being sent. Which does not work in integration tests.
	 */
	public function serve_custom_response( $served, $result, $request ): bool {
		if ( \strpos( $request->get_route(), '/yoast/v1/schema-aggregator' ) !== 0 ) {
			return $served;
		}

		if ( ! $result instanceof WP_REST_Response || $result->is_error() ) {
			return $served;
		}

		$this->schema_map_header_adapter->set_header_for_request( $result );

		return true;
	}
}
