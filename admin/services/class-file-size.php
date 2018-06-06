<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Services
 */

/**
 * Represents the file size service.
 */
class WPSEO_File_Size_Service {

	/**
	 * Retrieves an indexable.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function get( WP_REST_Request $request ) {
		$file_url = rawurldecode( $request->get_param( 'url' ) );

		if ( $this->is_externally_hosted( $file_url ) ) {
			return new WP_REST_Response(
				array(
					'type'     => 'failure',
					'response' => sprintf(
						/* translators: %1$s expands to the requested url */
						__( 'Cannot get the size of %1$s because it is hosted externally.', 'wordpress-seo' ),
						$file_url
					)
				),
				404
			);
		}

		$file_size = $this->get_file_size( $file_url );

		if ( ! $file_size ) {
			return new WP_REST_Response(
				array(
					'type'     => 'failure',
					'response' => sprintf(
						/* translators: %1$s expands to the requested url */
						__( 'Cannot get the size of %1$s because of unknown reasons.', 'wordpress-seo' ),
						$file_url
					)
				),
				404
			);
		}

		return new WP_REST_Response(
			array(
				'type'     => 'success',
				'response' => $file_size
			),
			404
		);
	}

	/**
	 * Checks if the file is hosted externally.
	 *
	 * @param string $file_url The file url.
	 *
	 * @return bool True if it is hosted externally.
	 */
	protected function is_externally_hosted( $file_url ) {
		return wp_parse_url( home_url(), PHP_URL_HOST ) !== wp_parse_url( $file_url, PHP_URL_HOST );
	}

	/**
	 * Returns the file size.
	 *
	 * @param string $file_url The file url to get the size for.
	 *
	 * @return int The file size.
	 */
	protected function get_file_size( $file_url ) {
		$file_config = wp_upload_dir();
		$file_url    = str_replace( $file_config['baseurl'], '', $file_url );
		$file        = array( 'path' => $file_url );

		return WPSEO_Image_Utils::get_file_size( $file );
	}

}
