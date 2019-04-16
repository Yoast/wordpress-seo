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
	 * WPSEO_Schema_Breadcrumb constructor.
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
		$data      = array(
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
			$about_id = WPSEO_Schema_IDs::ORGANIZATION_HASH;
			if ( $this->context->site_represents === 'person' ) {
				$about_id = WPSEO_Schema_IDs::PERSON_HASH;
			}
			$data['about'] = array(
				'@id' => $this->context->site_url . $about_id,
			);
		}

		if ( is_singular() ) {
			$data = $this->add_featured_image( $data );

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
	 * Adds a featured image to the schema if there is one.
	 *
	 * @param array $data WebPage Schema.
	 *
	 * @return array $data WebPage Schema.
	 */
	private function add_featured_image( $data ) {
		if ( ! has_post_thumbnail( $this->context->id ) ) {
			return $data;
		}

		$id                         = $this->context->canonical . WPSEO_Schema_IDs::PRIMARY_IMAGE_HASH;
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
