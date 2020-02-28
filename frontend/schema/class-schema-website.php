<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Returns schema Website data.
 *
 * @since 10.2
 */
class WPSEO_Schema_Website implements WPSEO_Graph_Piece {

	/**
	 * A value object with context variables.
	 *
	 * @var WPSEO_Schema_Context
	 */
	private $context;

	/**
	 * WPSEO_Schema_Website constructor.
	 *
	 * @param WPSEO_Schema_Context $context A value object with context variables.
	 */
	public function __construct( WPSEO_Schema_Context $context ) {
		$this->context = $context;
	}

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
	public function generate() {
		$data = [
			'@type' => 'WebSite',
			'@id'   => $this->context->site_url . WPSEO_Schema_IDs::WEBSITE_HASH,
			'url'   => $this->context->site_url,
			'name'  => $this->context->site_name,
		];

		$data = WPSEO_Schema_Utils::add_piece_language( $data );

		if ( $this->context->site_description ) {
			$data['description'] = $this->context->site_description;
		}

		if ( $this->context->site_represents_reference ) {
			$data['publisher'] = $this->context->site_represents_reference;
		}

		$data = $this->add_alternate_name( $data );
		$data = $this->internal_search_section( $data );

		return $data;
	}

	/**
	 * Returns an alternate name if one was specified in the Yoast SEO settings.
	 *
	 * @param array $data The website data array.
	 *
	 * @return array $data
	 */
	private function add_alternate_name( $data ) {
		if ( WPSEO_Options::get( 'alternate_website_name', '' ) !== '' ) {
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
			$search_url = apply_filters( 'wpseo_json_ld_search_url', $this->context->site_url . '?s={search_term_string}' );

			$data['potentialAction'][] = [
				'@type'       => 'SearchAction',
				'target'      => $search_url,
				'query-input' => 'required name=search_term_string',
			];
		}

		return $data;
	}
}
