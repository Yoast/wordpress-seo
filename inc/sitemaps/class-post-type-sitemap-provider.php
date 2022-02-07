<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Sitemap provider for author archives.
 */
class WPSEO_Post_Type_Sitemap_Provider extends WPSEO_Indexable_Sitemap_Provider implements WPSEO_Sitemap_Provider {

	/**
	 * Check if provider supports given item type.
	 *
	 * @param string $type Type string to check for.
	 *
	 * @return bool
	 */
	public function handles_type( $type ) {
		return post_type_exists( $type );
	}

	/**
	 * Returns the object type for this sitemap.
	 *
	 * @return string The object type.
	 */
	protected function get_object_type() {
		return 'post';
	}

	/**
	 * Gets a list of sitemap types that will always have at least one archive entry in the sitemap,
	 * even if there are no posts of that type.
	 *
	 * @return string[] A list of indexable subtypes that should get at least one link on the sitemap index.
	 */
	protected function get_non_empty_types() {
		$indexed_archives = $this->repository
			->query_where_noindex( false, 'post-type-archive' )
			->select_many( 'object_sub_type' )
			->find_array();
		$indexed_archives = wp_list_pluck( $indexed_archives, 'object_sub_type' );
		$indexed_archives = array_filter(
			$indexed_archives,
			function ( $post_type ) {
				return ! $this->should_exclude_object_sub_type( $post_type );
			}
		);

		// Post and page sitemaps always get a link to the homepage or posts page.
		return array_merge( $indexed_archives, [ 'post', 'page' ] );
	}

	/**
	 * Whether or not a specific object sub type should be excluded.
	 *
	 * @param string $object_sub_type The object sub type.
	 *
	 * @return boolean Whether or not it should be excluded.
	 */
	protected function should_exclude_object_sub_type( $object_sub_type ) {
		return ! $this->is_valid_post_type( $object_sub_type );
	}

	/**
	 * Get set of sitemap link data.
	 *
	 * @param string $type         Sitemap type.
	 * @param int    $max_entries  Entries per sitemap.
	 * @param int    $current_page Current page of the sitemap.
	 *
	 * @return array The links.
	 *
	 * @throws OutOfBoundsException When an invalid page is requested.
	 */
	public function get_sitemap_links( $type, $max_entries, $current_page ) {
		if ( ! $this->is_valid_post_type( $type ) ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		$offset = ( $current_page > 1 ) ? ( ( $current_page - 1 ) * $max_entries ) : 0;

		$query = $this->repository
			->query_where_noindex( false, 'post', $type )
			->select_many( 'id', 'object_id', 'permalink', 'object_last_modified' )
			->where_raw( '( `canonical` IS NULL OR `canonical` = `permalink` )' )
			->order_by_asc( 'object_last_modified' )
			->offset( $offset )
			->limit( $max_entries );

		$posts_to_exclude = $this->get_excluded_object_ids( $type );
		if ( count( $posts_to_exclude ) > 0 ) {
			$query->where_not_in( 'object_id', $posts_to_exclude );
		}

		$indexables = $query->find_many();

		// Add the home page or archive to the first page.
		if ( $current_page === 1 ) {
			if ( $type === 'page' ) {
				$home_page = $this->repository
					->query_where_noindex( false, 'home-page' )
					->select_many( 'id', 'object_id', 'permalink', 'object_last_modified' )
					->find_one();
				if ( $home_page ) {
					// Prepend homepage.
					array_unshift( $indexables, $home_page );
				}
			}
			elseif ( $type === 'post' ) {
				$posts_page     = null;
				$show_on_front  = \get_option( 'show_on_front' );
				$page_for_posts = \get_option( 'page_for_posts' );
				if ( $page_for_posts && $show_on_front === 'page' ) {
					$posts_page = $this->repository
						->query_where_noindex( false, 'post', 'page' )
						->select_many( 'id', 'object_id', 'permalink', 'object_last_modified' )
						->where( 'object_id', $page_for_posts )
						->find_one();
				}
				elseif ( $show_on_front === 'posts' ) {
					$posts_page = $this->repository
						->query_where_noindex( false, 'home-page' )
						->select_many( 'id', 'object_id', 'permalink', 'object_last_modified' )
						->find_one();
				}
				if ( $posts_page ) {
					// Prepend posts page.
					array_unshift( $indexables, $posts_page );
				}
			}
			else {
				$archive_page = $this->repository
					->query_where_noindex( false, 'post-type-archive', $type )
					->select_many( 'id', 'object_id', 'permalink', 'object_last_modified' )
					->find_one();
				if ( $archive_page ) {
					// Prepend archive.
					array_unshift( $indexables, $archive_page );
				}
			}
		}

		// If total post type count is lower than the offset, an invalid page is requested.
		if ( count( $indexables ) === 0 ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		return $this->xml_sitemap_helper->convert_indexables_to_sitemap_links( $indexables, 'post' );
	}

	/**
	 * Check if post type should be present in sitemaps.
	 *
	 * @param string $post_type Post type string to check for.
	 *
	 * @return bool
	 */
	public function is_valid_post_type( $post_type ) {
		if ( ! WPSEO_Post_Type::is_post_type_accessible( $post_type ) || ! WPSEO_Post_Type::is_post_type_indexable( $post_type ) ) {
			return false;
		}

		/**
		 * Filter decision if post type is excluded from the XML sitemap.
		 *
		 * @param bool   $exclude   Default false.
		 * @param string $post_type Post type name.
		 */
		if ( apply_filters( 'wpseo_sitemap_exclude_post_type', false, $post_type ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Retrieves a list with the excluded post ids.
	 *
	 * @return array Array with post ids to exclude.
	 */
	protected function get_excluded_object_ids() {
		$excluded_posts_ids = [];

		// The homepage is covered by the home-page indexable.
		$homepage_post_id = (int) get_option( 'page_on_front' );
		if ( ! empty( $homepage_post_id ) ) {
			$excluded_posts_ids[] = $homepage_post_id;
		}

		// The posts page is added to the posts sitemap after filtering. Prevent it from being duplicated in the page sitemap.
		$posts_page_id = (int) get_option( 'page_for_posts' );
		if ( ! empty( $posts_page_id ) ) {
			$excluded_posts_ids[] = $posts_page_id;
		}

		/**
		 * Filter: 'wpseo_exclude_from_sitemap_by_post_ids' - Allow extending and modifying the posts to exclude.
		 *
		 * @api array $posts_to_exclude The posts to exclude.
		 */
		$excluded_posts_ids = apply_filters( 'wpseo_exclude_from_sitemap_by_post_ids', $excluded_posts_ids );
		if ( ! is_array( $excluded_posts_ids ) ) {
			$excluded_posts_ids = [];
		}

		$excluded_posts_ids = array_map( 'intval', $excluded_posts_ids );

		return array_unique( $excluded_posts_ids );
	}
}
