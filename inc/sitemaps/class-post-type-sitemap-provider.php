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
	 * Set up object properties for data reuse.
	 */
	public function __construct() {
	}

	/**
	 * Get the Classifier for a link.
	 *
	 * @return WPSEO_Link_Type_Classifier
	 */
	protected function get_classifier() {
		if ( ! isset( self::$classifier ) ) {
			self::$classifier = new WPSEO_Link_Type_Classifier( home_url() );
		}

		return self::$classifier;
	}

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
		global $table_prefix;

		$post_types          = WPSEO_Post_Type::get_accessible_post_types();
		$post_types          = array_filter( $post_types, [ $this, 'is_valid_post_type' ] );
		$last_modified_times = WPSEO_Sitemaps::get_last_modified_gmt( $post_types, true );
		$index               = [];

		foreach ( $post_types as $post_type ) {

			$total_count = $this->get_post_type_count( $post_type );

			$max_pages = 1;
			if ( $total_count > $max_entries ) {
				$max_pages = (int) ceil( $total_count / $max_entries );
			}

			$all_dates = [];

			if ( $max_pages > 1 ) {
				$sql = "SELECT `updated_at` FROM ( SELECT @rownum:=0 ) init 
					JOIN {$table_prefix}yoast_indexable
					WHERE `is_public` = 1
					AND `object_type` = 'post'
					AND `object_sub_type` = '{$post_type}'
					AND ( @rownum:=@rownum+1 ) % {$max_entries} = 0
					ORDER BY `updated_at` ASC";

				$all_dates = Yoast_Model::of_type( 'Indexable' )->rawQuery( $sql )->find_many();
			}

			for ( $page_counter = 0; $page_counter < $max_pages; $page_counter ++ ) {

				$current_page = ( $max_pages > 1 ) ? ( $page_counter + 1 ) : '';
				$date         = false;

				if ( empty( $current_page ) || $current_page === $max_pages ) {

					if ( ! empty( $last_modified_times[ $post_type ] ) ) {
						$date = $last_modified_times[ $post_type ];
					}
				}
				else {
					$date = $all_dates[ $page_counter ]->get( 'updated_at' );
				}

				$index[] = [
					'loc'     => WPSEO_Sitemaps_Router::get_base_url( $post_type . '-sitemap' . $current_page . '.xml' ),
					'lastmod' => $date,
				];
			}
		}

		return $index;
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

				if ( $this->get_classifier()->classify( $post->permalink ) === WPSEO_Link::TYPE_EXTERNAL ) {
					continue;
				}

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
		$excluded_posts_ids = [];

		$page_on_front_id = ( $post_type === 'page' ) ? (int) get_option( 'page_on_front' ) : 0;
		if ( $page_on_front_id > 0 ) {
			$excluded_posts_ids[] = $page_on_front_id;
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

		$page_for_posts_id = ( $post_type === 'page' ) ? (int) get_option( 'page_for_posts' ) : 0;
		if ( $page_for_posts_id > 0 ) {
			$excluded_posts_ids[] = $page_for_posts_id;
		}

		return array_unique( $excluded_posts_ids );
	}

	/**
	 * Get count of posts for post type.
	 *
	 * @param string $post_type Post type to retrieve count for.
	 *
	 * @return int
	 */
	protected function get_post_type_count( $post_type ) {
		return Yoast_Model::of_type( 'Indexable' )
						  ->where( 'object_type', 'post' )
						  ->where( 'object_sub_type', $post_type )
						  ->where( 'is_public', 1 )
						  ->count();
	}

	/**
	 * Produces set of links to prepend at start of first sitemap page.
	 *
	 * @param string $post_type Post type to produce links for.
	 *
	 * @return array
	 */
	protected function get_first_links( $post_type ) {

		$links       = [];
		$archive_url = false;

		if ( $post_type === 'page' ) {
			$page_on_front_id = (int) get_option( 'page_on_front' );
			if ( $page_on_front_id > 0 ) {
				$result     = Yoast_Model::of_type( 'Indexable' )
										 ->select( 'permalink' )
										 ->select( 'updated_at' )
										 ->select( 'object_id' )
										 ->where( 'object_type', 'home-page' )
										 ->where( 'is_public', 1 )
										 ->find_one();
				$front_page = [
					'loc' => $result->get( 'permalink' ),
					'mod' => $result->get( 'updated_at' ),
				];
			}

			if ( empty( $front_page ) ) {
				$front_page = [
					'loc' => WPSEO_Utils::home_url(),
				];
			}

			$links[] = $front_page;
		}
		elseif ( $post_type !== 'page' ) {
			/**
			 * Filter the URL Yoast SEO uses in the XML sitemap for this post type archive.
			 *
			 * @param string $archive_url The URL of this archive
			 * @param string $post_type   The post type this archive is for.
			 */
			$archive_url = apply_filters(
				'wpseo_sitemap_post_type_archive_link',
				$this->get_post_type_archive_link( $post_type ),
				$post_type
			);
		}

		if ( $archive_url ) {

			$links[] = [
				'loc' => $archive_url,
				'mod' => WPSEO_Sitemaps::get_last_modified_gmt( $post_type ),

				// Deprecated, kept for backwards data compat. R.
				'chf' => 'daily',
				'pri' => 1,
			];
		}

		return $links;
	}

	/**
	 * Get URL for a post type archive.
	 *
	 * @param string $post_type Post type.
	 *
	 * @return string|bool URL or false if it should be excluded.
	 * @since 5.3
	 *
	 */
	protected function get_post_type_archive_link( $post_type ) {

		$pt_archive_page_id = - 1;

		if ( $post_type === 'post' ) {
			return false;
		}

		if ( ! $this->is_post_type_archive_indexable( $post_type, $pt_archive_page_id ) ) {
			return false;
		}

		return get_post_type_archive_link( $post_type );
	}

	/**
	 * Determines whether a post type archive is indexable.
	 *
	 * @param string $post_type       Post type.
	 * @param int    $archive_page_id The page id.
	 *
	 * @return bool True when post type archive is indexable.
	 * @since 11.5
	 *
	 */
	protected function is_post_type_archive_indexable( $post_type, $archive_page_id = - 1 ) {

		if ( WPSEO_Options::get( 'noindex-ptarchive-' . $post_type, false ) ) {
			return false;
		}

		/**
		 * Filter the page which is dedicated to this post type archive.
		 *
		 * @param string $archive_page_id The post_id of the page.
		 * @param string $post_type       The post type this archive is for.
		 *
		 * @since 9.3
		 *
		 */
		$archive_page_id = (int) apply_filters( 'wpseo_sitemap_page_for_post_type_archive', $archive_page_id, $post_type );

		if ( $archive_page_id > 0 && WPSEO_Meta::get_value( 'meta-robots-noindex', $archive_page_id ) === '1' ) {
			return false;
		}

		return true;
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
						  ->limit( $count )
						  ->offset( $offset )
						  ->order_by_desc( 'updated_at' )
						  ->order_by_desc( 'object_id' )
						  ->find_many();
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Get all the options.
	 *
	 * @deprecated 7.0
	 * @codeCoverageIgnore
	 */
	protected function get_options() {
		_deprecated_function( __METHOD__, 'WPSEO 7.0', 'WPSEO_Options::get' );
	}

	/**
	 * Get Home URL.
	 *
	 * @return string
	 * @deprecated 11.5
	 * @codeCoverageIgnore
	 *
	 */
	protected function get_home_url() {
		_deprecated_function( __METHOD__, 'WPSEO 11.5', 'WPSEO_Utils::home_url' );

		return WPSEO_Utils::home_url();
	}

	/**
	 * Get front page ID.
	 *
	 * @return int
	 * @deprecated 11.5
	 * @codeCoverageIgnore
	 *
	 */
	protected function get_page_on_front_id() {
		_deprecated_function( __METHOD__, 'WPSEO 11.5' );

		return (int) get_option( 'page_on_front' );
	}

	/**
	 * Get page for posts ID.
	 *
	 * @return int
	 * @deprecated 11.5
	 * @codeCoverageIgnore
	 *
	 */
	protected function get_page_for_posts_id() {
		_deprecated_function( __METHOD__, 'WPSEO 11.5' );

		return (int) get_option( 'page_for_posts' );
	}
}
