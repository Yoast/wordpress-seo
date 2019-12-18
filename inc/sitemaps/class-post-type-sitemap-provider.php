<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

use Yoast\WP\Free\ORM\Yoast_Model;

/**
 * Sitemap provider for author archives.
 */
class WPSEO_Post_Type_Sitemap_Provider implements WPSEO_Sitemap_Provider {
	/**
	 * Holds instance of classifier for a link.
	 *
	 * @var object
	 */
	protected static $classifier;

	/**
	 * Determines whether images should be included in the XML sitemap.
	 *
	 * @var bool
	 */
	private $include_images;

	/**
	 * Check if provider supports given item type.
	 *
	 * @param string $type Type string to check for.
	 *
	 * @return boolean
	 */
	public function handles_type( $type ) {

		return post_type_exists( $type );
	}

	/**
	 * Retrieves the sitemap links.
	 *
	 * @param int $max_entries Entries per sitemap.
	 *
	 * @return array
	 */
	public function get_index_links( $max_entries ) {
		$post_types = WPSEO_Post_Type::get_accessible_post_types();
		$post_types = array_filter( $post_types, [ $this, 'is_valid_post_type' ] );

		return WPSEO_Sitemaps::get_index_links_for_object_type( 'post', $post_types, $max_entries );
	}

	/**
	 * Get set of sitemap link data.
	 *
	 * @param string $type         Sitemap type.
	 * @param int    $max_entries  Entries per sitemap.
	 * @param int    $current_page Current page of the sitemap.
	 *
	 * @return array
	 * @throws OutOfBoundsException When an invalid page is requested.
	 *
	 */
	public function get_sitemap_links( $type, $max_entries, $current_page ) {

		$links     = [];
		$post_type = $type;

		if ( ! $this->is_valid_post_type( $post_type ) ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		$steps  = min( 100, $max_entries );
		$offset = ( $current_page > 1 ) ? ( ( $current_page - 1 ) * $max_entries ) : 0;
		$total  = ( $offset + $max_entries );

		$post_type_entries = $this->get_post_type_count( $post_type );

		if ( $total > $post_type_entries ) {
			$total = $post_type_entries;
		}

		if ( $current_page === 1 ) {
			$links = array_merge( $links, $this->get_first_links( $post_type ) );
		}

		// If total post type count is lower than the offset, an invalid page is requested.
		if ( $post_type_entries < $offset ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		if ( $post_type_entries === 0 ) {
			return $links;
		}

		$excluded_posts = $this->get_excluded_posts( $post_type );

		while ( $total > $offset ) {

			$posts = $this->get_posts( $post_type, $steps, $offset );

			$offset += $steps;

			if ( empty( $posts ) ) {
				continue;
			}

			foreach ( $posts as $post ) {

				if ( in_array( $post->object_id, $excluded_posts ) ) {
					continue;
				}

				$url = [
					'mod' => $post->updated_at,
					'loc' => $post->permalink,
				];

				/**
				 * Filter URL entry before it gets added to the sitemap.
				 *
				 * @param array  $url  Array of URL parts.
				 * @param string $type URL type.
				 * @param object $post Data object for the URL.
				 */
				$url = apply_filters( 'wpseo_sitemap_entry', $url, 'post', $post );

				if ( ! empty( $url ) ) {
					$links[] = $url;
				}
			}

			unset( $post, $url );
		}

		return $links;
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
	 * @param string $post_type Post type.
	 *
	 * @return array Array with post ids to exclude.
	 */
	protected function get_excluded_posts( $post_type ) {
		/**
		 * Filter: 'wpseo_exclude_from_sitemap_by_post_ids' - Allow extending and modifying the posts to exclude.
		 *
		 * @param string $post_type The post type we're excluding posts for.
		 *
		 * @api array $posts_to_exclude The posts to exclude.
		 */
		$excluded_posts_ids = apply_filters( 'wpseo_exclude_from_sitemap_by_post_ids', [], $post_type );

		return array_unique( $excluded_posts_ids );
	}

	/**
	 * Produces set of links to prepend at start of first sitemap page.
	 *
	 * @param string $post_type Post type to produce links for.
	 *
	 * @return array
	 */
	protected function get_first_links( $post_type ) {
		if ( $post_type !== 'page' && $post_type !== 'post' ) {
			$link = $this->get_post_type_archive_link( $post_type );
			if ( $link ) {
				return [ $link ];
			}
		}

		return [];
	}

	/**
	 * Returns a post type archive link array for use in XML sitemaps.
	 *
	 * @param string $post_type The post type to retrieve the archive for.
	 *
	 * @return array|bool The array on success, false on failure.
	 */
	private function get_post_type_archive_link( $post_type ) {
		$result = Yoast_Model::of_type( 'Indexable' )
							 ->select( 'permalink' )
							 ->select( 'updated_at' )
							 ->where( 'object_type', 'post-type-archive' )
							 ->where( 'object_sub_type', $post_type )
							 ->where( 'is_public', 1 )
							 ->find_one();

		if ( $result ) {
			return [
				'loc' => $result->get( 'permalink' ),
				'mod' => $result->get( 'updated_at' ),
			];
		}

		return false;
	}

	/**
	 * Retrieve set of posts with optimized query routine.
	 *
	 * @param string $post_type Post type to retrieve.
	 * @param int    $count     Count of posts to retrieve.
	 * @param int    $offset    Starting offset.
	 *
	 * @return object[]
	 */
	protected function get_posts( $post_type, $count, $offset ) {
		return Yoast_Model::of_type( 'Indexable' )
						  ->select( 'permalink' )
						  ->select( 'updated_at' )
						  ->select( 'object_id' )
						  ->where( 'object_type', 'post' )
						  ->where( 'object_sub_type', $post_type )
						  ->where( 'is_public', 1 )
						  ->where_null( 'canonical' )
						  ->limit( $count )
						  ->offset( $offset )
						  ->order_by_desc( 'updated_at' )
						  ->order_by_desc( 'object_id' )
						  ->find_many();
	}

	/**
	 * Retrieves a count of the number of posts for a post type.
	 *
	 * @param string $post_type Post type to retrieve.
	 *
	 * @return int
	 */
	private function get_post_type_count( $post_type ) {
		return Yoast_Model::of_type( 'Indexable' )
						  ->where( 'object_type', 'post' )
						  ->where( 'object_sub_type', $post_type )
						  ->where( 'is_public', 1 )
						  ->count();
	}

}
