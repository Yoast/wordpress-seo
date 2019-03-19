<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Class WPSEO_Schema_Website
 *
 * Outputs schema Website code.
 *
 * @since 10.1
 */
class WPSEO_Schema_Website implements WPSEO_Graph_Piece {
	/**
	 * Outputs code to allow recognition of the internal search engine.
	 *
	 * @since 1.5.7
	 *
	 * @link  https://developers.google.com/structured-data/site-name
	 *
	 * @return bool|array Website data blob on success, false on failure.
	 */
	public function add_to_graph() {
		if ( ! is_front_page() ) {
			return false;
		}

		$data = array(
			'@type'    => 'WebSite',
			'@id'      => WPSEO_Utils::home_url() . '#website',
			'url'      => WPSEO_Utils::home_url(),
			'name'     => $this->get_website_name(),
		);

		$data = $this->add_alternate_name( $data );
		$data = $this->internal_search_section( $data );

		return $data;
	}

	/**
	 * Returns the website name either from Yoast SEO's options or from the site settings.
	 *
	 * @since 2.1
	 *
	 * @return string
	 */
	protected function get_website_name() {
		if ( '' !== WPSEO_Options::get( 'website_name', '' ) ) {
			return WPSEO_Options::get( 'website_name' );
		}

		return get_bloginfo( 'name' );
	}

	/**
	 * Returns an alternate name if one was specified in the Yoast SEO settings.
	 *
	 * @param array $data The website data array.
	 *
	 * @return array $data
	 */
	private function add_alternate_name( $data ) {
		if ( '' !== WPSEO_Options::get( 'alternate_website_name', '' ) ) {
			$data['alternateName'] = WPSEO_Options::get( 'alternate_website_name' );
		}

		return $data;
	}

	/**
	 * Adds the internal search JSON LD code to the homepage if it's not disabled.
	 *
	 * @link https://developers.google.com/structured-data/slsb-overview
	 *
	 * @param array $data The website data array.
	 *
	 * @return array $data
	 */
	private function internal_search_section( $data ) {
		/**
		 * Filter: 'disable_wpseo_json_ld_search' - Allow disabling of the json+ld output.
		 *
		 * @api bool $display_search Whether or not to display json+ld search on the frontend.
		 */
		if ( ! apply_filters( 'disable_wpseo_json_ld_search', false ) ) {
			/**
			 * Filter: 'wpseo_json_ld_search_url' - Allows filtering of the search URL for Yoast SEO.
			 *
			 * @api string $search_url The search URL for this site with a `{search_term_string}` variable.
			 */
			$search_url = apply_filters( 'wpseo_json_ld_search_url', WPSEO_Utils::get_home_url() . '?s={search_term_string}' );

			$data['potentialAction'] = array(
				'@type'       => 'SearchAction',
				'target'      => $search_url,
				'query-input' => 'required name=search_term_string',
			);
		}

		return $data;
	}
}