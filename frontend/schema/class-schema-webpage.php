<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Class WPSEO_Schema_WebPage
 *
 * Outputs schema WebPage code.
 *
 * @since 10.1
 */
class WPSEO_Schema_WebPage implements WPSEO_Graph_Piece {
	/**
	 * Returns a WebPage JSON+LD blob.
	 *
	 * @return array WebPage data blob.
	 */
	public function add_to_graph() {
		$front     = WPSEO_Frontend::get_instance();
		$canonical = $front->canonical( false );
		$data      = array(
			'@type'      => $this->determine_page_type(),
			'@id'        => $canonical . '#webpage',
			'url'        => $canonical,
			'inLanguage' => get_bloginfo( 'language' ),
			'name'       => $front->title( '' ),
			'isPartOf'   => array(
				'@id' => WPSEO_Utils::home_url() . '#website',
			),
		);

		if ( $front->metadesc( false ) !== '' ) {
			$data['description'] = $front->metadesc( false );
		}

		if ( $this->add_breadcrumbs() ) {
			$data['breadcrumb'] = array(
				'@id' => $canonical . '#breadcrumb'
			);
		}

		return $data;
	}

	/**
	 * Determine if we should add a breadcrumb attribute.
	 *
	 * @return bool
	 */
	private function add_breadcrumbs() {
		if ( is_front_page() ) {
			return false;
		}

		$breadcrumbs_enabled = current_theme_supports( 'yoast-seo-breadcrumbs' );
		if ( ! $breadcrumbs_enabled ) {
			$breadcrumbs_enabled = WPSEO_Options::get( 'breadcrumbs-enable', false );
		}
		if ( $breadcrumbs_enabled ) {
			return true;
		}

		return false;
	}

	/**
	 * Determine the page type for the current page.
	 *
	 * @return string
	 */
	private function determine_page_type() {
		$type = 'WebPage';
		if ( is_search() ) {
			$type = 'SearchResultsPage';
		}

		/**
		 * Filter: 'wpseo_schema_webpage_type' - Allow changing the WebPage type.
		 *
		 * @api string $type The WebPage type.
		 */
		return apply_filters( 'wpseo_schema_webpage_type', $type );
	}
}
