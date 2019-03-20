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
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @return bool
	 */
	public function is_needed() {
		if ( is_404() ) {
			return false;
		}

		return true;
	}

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

		$data = $this->add_featured_image( $data );

		if ( $front->metadesc( false ) !== '' ) {
			$data['description'] = $front->metadesc( false );
		}

		if ( $this->add_breadcrumbs() ) {
			$data['breadcrumb'] = array(
				'@id' => $canonical . '#breadcrumb',
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
		switch ( true ) {
			case is_search():
				$type = array( 'SearchResultsPage', 'WebPage' );
				break;
			case is_author():
				$type = array( 'ProfilePage', 'CollectionPage', 'WebPage' );
				break;
			case is_archive():
				$type = array( 'CollectionPage', 'WebPage' );
				break;
			default:
				$type = 'WebPage';
		}

		/**
		 * Filter: 'wpseo_schema_webpage_type' - Allow changing the WebPage type.
		 *
		 * @api string $type The WebPage type.
		 */
		return apply_filters( 'wpseo_schema_webpage_type', $type );
	}

	/**
	 * Adds a featured image to the schema if there is one.
	 *
	 * @param array $data WebPage Schema.
	 *
	 * @return array $data WebPage Schema.
	 */
	private function add_featured_image( $data ) {
		if ( ! has_post_thumbnail( get_queried_object_id() ) ) {
			return $data;
		}

		$id                         = WPSEO_Frontend::get_instance()->canonical( false ) . '#primaryimage';
		$data['image']              = array(
			'@type'   => 'ImageObject',
			'@id'     => $id,
			'url'     => get_the_post_thumbnail_url(),
			'caption' => get_the_post_thumbnail_caption(),
		);
		$data['primaryImageOfPage'] = array(
			'@id' => $id,
		);

		return $data;
	}
}
