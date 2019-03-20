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
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @return bool
	 */
	public function is_needed() {
		return true;
	}

	/**
	 * Outputs code to allow recognition of the internal search engine.
	 *
	 * @since 1.5.7
	 *
	 * @link  https://developers.google.com/structured-data/site-name
	 *
	 * @return array Website data blob.
	 */
	public function add_to_graph() {
		$data = array(
			'@type'     => 'WebSite',
			'@id'       => WPSEO_Utils::home_url() . '#website',
			'url'       => WPSEO_Utils::home_url(),
			'name'      => $this->get_website_name(),
			'publisher' => array(
				'@id' => $this->get_publisher(),
			),
		);

		$data = $this->add_alternate_name( $data );
		$data = $this->internal_search_section( $data );

		return $data;
	}

	/**
	 * Determine the ID based on Company Or Person settings.
	 *
	 * @return string
	 */
	private function get_publisher() {
		if ( WPSEO_Options::get( 'company_or_person', '' ) === 'person' ) {
			return WPSEO_Utils::home_url() . '#person';
		}

		return WPSEO_Utils::home_url() . '#organization';
	}

	/**
	 * Returns the website name either from Yoast SEO's options or from the site settings.
	 *
	 * @since 2.1
	 *
	 * @return string
	 */
	private function get_website_name() {
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
			$search_url = apply_filters( 'wpseo_json_ld_search_url', trailingslashit( WPSEO_Utils::get_home_url() ) . '?s={search_term_string}' );

			$data['potentialAction'] = array(
				'@type'       => 'SearchAction',
				'target'      => $search_url,
				'query-input' => 'required name=search_term_string',
			);
		}

		return $data;
	}
}
