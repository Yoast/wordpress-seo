<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Returns schema WebPage data.
 *
 * @since 10.2
 */
class WPSEO_Schema_WebPage implements WPSEO_Graph_Piece {

	/**
	 * A value object with context variables.
	 *
	 * @var WPSEO_Schema_Context
	 */
	private $context;

	/**
	 * WPSEO_Schema_WebPage constructor.
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
		if ( is_404() ) {
			return false;
		}

		return true;
	}

	/**
	 * Returns WebPage schema data.
	 *
	 * @return array WebPage schema data.
	 */
	public function generate() {
		$data = array(
			'@type'      => $this->determine_page_type(),
			'@id'        => $this->context->canonical . WPSEO_Schema_IDs::WEBPAGE_HASH,
			'url'        => $this->context->canonical,
			'inLanguage' => get_bloginfo( 'language' ),
			'name'       => $this->context->title,
			'isPartOf'   => array(
				'@id' => $this->context->site_url . WPSEO_Schema_IDs::WEBSITE_HASH,
			),
		);

		if ( is_front_page() ) {
			if ( $this->context->site_represents_reference ) {
				$data['about'] = $this->context->site_represents_reference;
			}
		}

		if ( is_singular() ) {
			$this->add_image( $data );

			$post                  = get_post( $this->context->id );
			$data['datePublished'] = mysql2date( DATE_W3C, $post->post_date_gmt, false );
			$data['dateModified']  = mysql2date( DATE_W3C, $post->post_modified_gmt, false );
		}

		if ( ! empty( $this->context->description ) ) {
			$data['description'] = $this->context->description;
		}

		if ( $this->add_breadcrumbs() ) {
			$data['breadcrumb'] = array(
				'@id' => $this->context->canonical . WPSEO_Schema_IDs::BREADCRUMB_HASH,
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

		if ( $this->context->breadcrumbs_enabled ) {
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
				$type = 'SearchResultsPage';
				break;
			case is_author():
				$type = 'ProfilePage';
				break;
			case is_archive():
				$type = 'CollectionPage';
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
	 * If we have an image, make it the primary image of the page.
	 *
	 * @param array $data WebPage schema data.
	 */
	public function add_image( &$data ) {
		if ( $this->context->has_image ) {
			$data['primaryImageOfPage'] = array( '@id' => $this->context->canonical . WPSEO_Schema_IDs::PRIMARY_IMAGE_HASH );
		}
	}
}
