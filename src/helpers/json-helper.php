<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for JSON operations.
 */
class Json_Helper {

	/**
	 * Holds the environment helper instance.
	 *
	 * @var Environment_Helper
	 */
	protected $environment_helper;

	/**
	 * Constructs a JSON helper instance.
	 *
	 * @param Environment_Helper $environment_helper The environment helper.
	 */
	public function __construct( Environment_Helper $environment_helper ) {
		$this->environment_helper = $environment_helper;
	}

	/**
	 * Prepares data for outputting as JSON.
	 *
	 * @param array $data The data to format.
	 *
	 * @return false|string The prepared JSON string.
	 */
	public function format_encode( $data ) {
		$flags = ( JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );

		if ( $this->environment_helper->is_yoast_seo_in_development_mode() ) {
			$flags |= JSON_PRETTY_PRINT;

			/**
			 * Allows filtering of the JSON data for debug purposes.
			 *
			 * @api array $data Allows filtering of the JSON data for debug purposes.
			 */
			$data = \apply_filters( 'wpseo_debug_json_data', $data );
		}

		// phpcs:ignore Yoast.Yoast.AlternativeFunctions.json_encode_wp_json_encodeWithAdditionalParams -- This is the definition of format_json_encode.
		return \wp_json_encode( $data, $flags );
	}
}
