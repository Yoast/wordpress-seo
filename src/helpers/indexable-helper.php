<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Models\Indexable;

/**
 * A helper object for indexables.
 */
class Indexable_Helper {

	/**
	 * The environment helper.
	 *
	 * @var Environment_Helper
	 */
	protected $environment_helper;

	/**
	 * Indexable_Helper constructor.
	 *
	 * @param Environment_Helper $environment_helper The environment helper.
	 */
	public function __construct( Environment_Helper $environment_helper ) {
		$this->environment_helper = $environment_helper;
	}

	/**
	 * Retrieves the permalink for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string|null The permalink.
	 */
	public function get_permalink_for_indexable( $indexable ) {
		switch ( true ) {
			case $indexable->object_type === 'post':
			case $indexable->object_type === 'home-page':
				if ( $indexable->object_sub_type === 'attachment' ) {
					return \wp_get_attachment_url( $indexable->object_id );
				}

				return \get_permalink( $indexable->object_id );

			case $indexable->object_type === 'term':
				$term = \get_term( $indexable->object_id );

				if ( $term === null || \is_wp_error( $term ) ) {
					return null;
				}

				return \get_term_link( $term, $term->taxonomy );

			case $indexable->object_type === 'system-page' && $indexable->object_sub_type === 'search-page':
				return \get_search_link();

			case $indexable->object_type === 'post-type-archive':
				return \get_post_type_archive_link( $indexable->object_sub_type );

			case $indexable->object_type === 'user':
				return \get_author_posts_url( $indexable->object_id );
		}

		return null;
	}

	/**
	 * Returns the page type of an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string|false The page type. False if it could not be determined.
	 */
	public function get_page_type_for_indexable( $indexable ) {
		switch ( $indexable->object_type ) {
			case 'post':
				$front_page_id = (int) \get_option( 'page_on_front' );
				if ( $indexable->object_id === $front_page_id ) {
					return 'Static_Home_Page';
				}
				$posts_page_id = (int) \get_option( 'page_for_posts' );
				if ( $indexable->object_id === $posts_page_id ) {
					return 'Static_Posts_Page';
				}

				return 'Post_Type';
			case 'term':
				return 'Term_Archive';
			case 'user':
				return 'Author_Archive';
			case 'home-page':
				return 'Home_Page';
			case 'post-type-archive':
				return 'Post_Type_Archive';
			case 'date-archive':
				return 'Date_Archive';
			case 'system-page':
				if ( $indexable->object_sub_type === 'search-result' ) {
					return 'Search_Result_Page';
				}
				if ( $indexable->object_sub_type === '404' ) {
					return 'Error_Page';
				}
		}

		return false;
	}

	/**
	 * Determines whether indexing indexables is appropriate at this time.
	 *
	 * @return bool Whether or not the indexables should be indexed.
	 */
	public function should_index_indexables() {
		// Currently the only reason to index is when we're on a production website.
		if ( $this->environment_helper->is_production_mode() ) {
			return true;
		}

		$yoast_mode = $this->environment_helper->get_yoast_environment();
		if ( isset( $yoast_mode ) ) {
			// Always allow Yoast SEO developers to index, regardless of their test environment.
			return true;
		}

		// We are not running a production site.
		return false;
	}
}
