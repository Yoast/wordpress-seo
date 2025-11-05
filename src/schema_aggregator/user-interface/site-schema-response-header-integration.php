<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\User_Interface;

use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Integrations\Integration_Interface;

class Site_Schema_Reponse_Header_Integration implements Integration_Interface {

	use No_Conditionals;

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
	 * @param WP_REST_Server   $server  Server instance.
	 *
	 * @return bool True if we served the request, false otherwise.
	 */
	public function serve_custom_response( $served, $result, $request, $server ): bool {
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
			// For XML responses, data is already an XML string
			\header( 'Content-Type: application/xml; charset=UTF-8' );
			echo $data;
		}
		else {
			// For JSON responses, encode with unescaped slashes for cleaner URLs.
			$json = \json_encode(
				$data,
				( \JSON_UNESCAPED_SLASHES | \JSON_UNESCAPED_UNICODE )
			);

			\header( 'Content-Type: application/json; charset=UTF-8' );
			echo $json;
		}

		return true;
	}
}
