<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Presentations\Generators\Schema
 */

namespace Yoast\WP\Free\Presentations\Generators\Schema;

/**
 * Returns schema WebPage data.
 *
 * @since 10.2
 */
class WebPage extends Abstract_Schema_Piece {
	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @return bool
	 */
	public function is_needed() {
		if ( $this->current_page_helper->is_error_page() ) {
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
			'@id'        => $this->context->canonical . $this->id_helper->webpage_hash,
			'url'        => $this->context->canonical,
			'inLanguage' => \get_bloginfo( 'language' ),
			'name'       => $this->context->title,
			'isPartOf'   => array(
				'@id' => $this->context->site_url . $this->id_helper->website_hash,
			),
		);

		if ( \is_front_page() ) {
			if ( $this->context->site_represents_reference ) {
				$data['about'] = $this->context->site_represents_reference;
			}
		}

		if ( \is_singular() ) {
			$this->add_image( $data );

			$post                  = \get_post( $this->context->id );
			$data['datePublished'] = \mysql2date( DATE_W3C, $post->post_date_gmt, false );
			$data['dateModified']  = \mysql2date( DATE_W3C, $post->post_modified_gmt, false );

			if ( \get_post_type( $post ) === 'post' ) {
				$data = $this->add_author( $data, $post );
			}
		}

		if ( ! empty( $this->context->description ) ) {
			$data['description'] = \strip_tags( $this->context->description, '<h1><h2><h3><h4><h5><h6><br><ol><ul><li><a><p><b><strong><i><em>' );
		}

		if ( $this->add_breadcrumbs() ) {
			$data['breadcrumb'] = array(
				'@id' => $this->context->canonical . $this->id_helper->breadcrumb_hash,
			);
		}

		return $data;
	}

	/**
	 * Adds an author property to the $data if the WebPage is not represented.
	 *
	 * @param array   $data The WebPage schema.
	 * @param \WP_Post $post The post the context is representing.
	 *
	 * @return array The WebPage schema.
	 */
	public function add_author( $data, $post ) {
		if ( $this->context->site_represents === false ) {
			$data['author'] = array( '@id' => $this->id_helper->get_user_schema_id( $post->post_author, $this->context ) );
		}
		return $data;
	}

	/**
	 * If we have an image, make it the primary image of the page.
	 *
	 * @param array $data WebPage schema data.
	 */
	public function add_image( &$data ) {
		if ( $this->context->has_image ) {
			$data['primaryImageOfPage'] = array( '@id' => $this->context->canonical . $this->id_helper->primary_image_hash );
		}
	}

	/**
	 * Determine if we should add a breadcrumb attribute.
	 *
	 * @return bool
	 */
	private function add_breadcrumbs() {
		if ( $this->current_page_helper->is_home_posts_page() || $this->current_page_helper->is_home_static_page() ) {
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
			case $this->current_page_helper->is_search_result():
				$type = 'SearchResultsPage';
				break;
			case $this->current_page_helper->is_author_archive():
				$type = 'ProfilePage';
				break;
			case $this->current_page_helper->is_posts_page():
			case $this->current_page_helper->is_home_posts_page():
			case $this->current_page_helper->is_date_archive():
			case $this->current_page_helper->is_term_archive():
			case $this->current_page_helper->is_post_type_archive():
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
		return \apply_filters( 'wpseo_schema_webpage_type', $type );
	}
}
