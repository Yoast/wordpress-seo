<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map;

use WP_REST_Response;

/**
 * Adapter to set proper response headers for Schema Map responses.
 */
class Schema_Map_Header_Adapter {

	/**
	 * Set proper headers for Schema Map responses.
	 *
	 * @param WP_REST_Response $response The REST response object.
	 *
	 * @return void
	 */
	public function set_header_for_request( WP_REST_Response $response ) {
		$data = $response->get_data();

		foreach ( $response->get_headers() as $key => $value ) {
			\header( \sprintf( '%s: %s', $key, $value ) );
		}

		$headers      = $response->get_headers();
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
	}
}
