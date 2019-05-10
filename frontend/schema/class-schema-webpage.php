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
			$data = $this->add_image( $data );

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
	 * Adds a featured image to the schema if there is one, if not falls back to the first image on the page.
	 *
	 * @param array $data WebPage Schema.
	 *
	 * @return array $data WebPage Schema.
	 */
	private function add_image( $data ) {
		$image_id = $this->context->canonical . WPSEO_Schema_IDs::PRIMARY_IMAGE_HASH;

		$image_schema = $this->get_featured_image( $this->context->id, $image_id );

		if ( $image_schema === null ) {
			$image_schema = $this->get_first_content_image( $this->context->id, $image_id );
		}

		if ( $image_schema === null ) {
			return $data;
		}

		$data['image']              = $image_schema;
		$data['primaryImageOfPage'] = array( '@id' => $image_id );

		return $data;
	}

	/**
	 * Gets the image schema for the web page based on the featured image.
	 *
	 * @param int    $post_id  The post id.
	 * @param string $image_id The image schema id.
	 *
	 * @return array|null The image schema object and null if there is no featured image.
	 */
	private function get_featured_image( $post_id, $image_id ) {
		if ( ! has_post_thumbnail( $post_id ) ) {
			return null;
		}

		$schema_image = new WPSEO_Schema_Image( $image_id );
		return $schema_image->generate_from_attachment_id( get_post_thumbnail_id() );
	}

	/**
	 * Gets the image schema for the web page based on the first content image image.
	 *
	 * @param int    $post_id  The post id.
	 * @param string $image_id The image schema id.
	 *
	 * @return array|null The image schema object and null if there is no image in the content.
	 */
	private function get_first_content_image( $post_id, $image_id ) {
		$image_url = WPSEO_Image_Utils::get_first_usable_content_image_for_post( $post_id );

		if ( $image_url === null ) {
			return null;
		}

		$schema_image = new WPSEO_Schema_Image( $image_id );
		return $schema_image->generate_from_url( $image_url );
	}
}
