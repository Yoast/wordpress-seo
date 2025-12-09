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
			\header( 'X-Accel-Buffering: no' );
			\header( 'Content-Type: application/json; charset=UTF-8' );
			foreach ( $data as $schema_piece ) {
				// @phpcs:disable Yoast.Yoast.JsonEncodeAlternative.FoundWithAdditionalParams -- The pretty print option breaks the JSONL format.
				echo \wp_json_encode( $schema_piece, ( \JSON_UNESCAPED_SLASHES | \JSON_UNESCAPED_UNICODE ) ) . \PHP_EOL; // @phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $data should already be escaped here since this just adds headers to the request.
				\ob_flush();
				\flush();
				// @phpcs:enable
			}
		}
	}
}
