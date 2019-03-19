<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Class WPSEO_JSON_LD
 *
 * Helper class for outputting schema.org JSON+LD code.
 *
 * @since 1.8
 */
class WPSEO_JSON_LD {
	/**
	 * Outputs the JSON LD code in a valid JSON+LD wrapper.
	 *
	 * @since 1.8
	 *
	 * @param array $data The data to put out.
	 * @param string $context The context of the output, useful for filtering.
	 */
	protected function output( $data, $context ) {
		/**
		 * Filter: 'wpseo_json_ld_output' - Allows filtering of the JSON+LD output.
		 *
		 * @api array $output The output array, before its JSON encoded.
		 *
		 * @param string $context The context of the output, useful to determine whether to filter or not.
		 */
		$data = apply_filters( 'wpseo_json_ld_output', $data, $context );

		if ( is_array( $data ) && ! empty( $data ) ) {
			echo "<script type='application/ld+json'>", $this->format_data( $data ), '</script>', "\n";
		}
	}

	/**
	 * Prepares the data for outputting.
	 *
	 * @param array $data The data to format.
	 *
	 * @return false|string The prepared string.
	 */
	public function format_data( $data ) {
		if ( version_compare( PHP_VERSION, '5.4', '>=' ) ) {
			// @codingStandardsIgnoreLine
			return wp_json_encode( $data, JSON_UNESCAPED_SLASHES ); // phpcs:ignore PHPCompatibility.Constants.NewConstants.json_unescaped_slashesFound -- Version check present.
		}

		return wp_json_encode( $data );
	}

	/**
	 * Retrieves the home URL.
	 *
	 * @return string
	 */
	protected function get_home_url() {
		/**
		 * Filter: 'wpseo_json_home_url' - Allows filtering of the home URL for Yoast SEO's JSON+LD output.
		 *
		 * @api unsigned string
		 */
		return apply_filters( 'wpseo_json_home_url', WPSEO_Utils::home_url() );
	}
}
