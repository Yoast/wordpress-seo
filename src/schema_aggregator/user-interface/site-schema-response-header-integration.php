<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\User_Interface;

use WP_REST_Request;
use WP_REST_Response;
use WPSEO_Utils;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Integration to set proper response headers for Site Schema endpoints.
 */
class Site_Schema_Response_Header_Integration implements Integration_Interface {

	use No_Conditionals;

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
	 */
	public function serve_custom_response( $served, $result, $request ): bool {
		if ( \strpos( $request->get_route(), '/yoast/v1/schema-aggregator' ) !== 0 ) {
			return $served;
		}

		if ( ! $result instanceof WP_REST_Response || $result->is_error() ) {
			return $served;
		}

		$data = $result->get_data();

		foreach ( $result->get_headers() as $key => $value ) {
			\header( \sprintf( '%s: %s', $key, $value ) );
		}

		$headers      = $result->get_headers();
		$content_type = ( $headers['Content-Type'] ?? 'application/json; charset=UTF-8' );

		if ( \strpos( $content_type, 'application/xml' ) !== false ) {
			\header( 'Content-Type: application/xml; charset=UTF-8' );
			echo $data; //@phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $data should already be escaped here since this just adds headers to the request.
		}
		else {
			// For JSON responses, encode with unescaped slashes for cleaner URLs.
			$json = WPSEO_Utils::format_json_encode( $data );

			\header( 'Content-Type: application/json; charset=UTF-8' );
			echo $json; //@phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $json should already be escaped here since this just adds headers to the request.
		}

		return true;
	}
}
