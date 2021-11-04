<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Sitemap provider for author archives.
 */
class WPSEO_Taxonomy_Sitemap_Provider implements WPSEO_Sitemap_Provider {

	/**
	 * Holds image parser instance.
	 *
	 * @var WPSEO_Sitemap_Image_Parser
	 */
	protected static $image_parser;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $repository;

	/**
	 * Set up object properties for data reuse.
	 */
	public function __construct() {
		$this->repository = YoastSEO()->classes->get( 'Yoast\WP\SEO\Repositories\Indexable_Repository' );
	}

	/**
	 * Check if provider supports given item type.
	 *
	 * @param string $type Type string to check for.
	 *
	 * @return bool
	 */
	public function handles_type( $type ) {

		$taxonomy = get_taxonomy( $type );

		if ( $taxonomy === false || ! $this->is_valid_taxonomy( $taxonomy->name ) || ! $taxonomy->public ) {
			return false;
		}

		return true;
	}

	/**
	 * Retrieves the links for the sitemap.
	 *
	 * @param int $max_entries Entries per sitemap.
	 *
	 * @return array
	 */
	public function get_index_links( $max_entries ) {
		$index = [];

		$taxonomies = $this->repository->query()
									   ->select( 'object_sub_type' )
									   ->select_expr( 'MAX( `object_last_modified` ) AS max_object_last_modified' )
									   ->select_expr( 'COUNT(*) AS count' )
									   ->where( 'object_type', 'term' )
									   ->where_raw( '( `is_robots_noindex` = 0 OR `is_robots_noindex` IS NULL )' )
									   ->group_by( 'object_sub_type' )
									   ->find_many();

		foreach ( $taxonomies as $taxonomy ) {
			/**
			 * Filter to exclude the taxonomy from the XML sitemap.
			 *
			 * @param bool   $exclude       Defaults to false.
			 * @param string $taxonomy_name Name of the taxonomy to exclude..
			 */
			if ( apply_filters( 'wpseo_sitemap_exclude_taxonomy', false, $taxonomy->object_sub_type ) ) {
				continue;
			}

			$max_pages = 1;

			if ( $taxonomy->count > $max_entries ) {
				$max_pages = (int) ceil( $taxonomy->count / $max_entries );
			}

			if ( $max_pages > 1 ) {
				global $wpdb;
				$sql = 'SELECT object_last_modified
				    FROM ( SELECT @rownum:=0 ) init
				    JOIN ' . Model::get_table_name( 'Indexable' ) . '
				    WHERE `object_type` = "term"
				      AND `object_sub_type` = %s
				      AND ( `is_robots_noindex` = 0 OR `is_robots_noindex` IS NULL )
				      AND ( @rownum:=@rownum+1 ) %% %d = 0
				    ORDER BY object_last_modified ASC';

				// phpcs:ignore WordPress.DB
				$all_dates    = array_merge( $wpdb->get_col( $wpdb->prepare( $sql, $taxonomy->object_sub_type, $max_entries ) ), [ $taxonomy->max_object_last_modified ] );
				$page_counter = 1;
				foreach ( $all_dates as $date ) {
					$index[] = [
						'loc'     => WPSEO_Sitemaps_Router::get_base_url( $taxonomy->object_sub_type . '-sitemap' . $page_counter . '.xml' ),
						'lastmod' => $date,
					];
					$page_counter ++;
				}
			} else {
				$index[] = [
					'loc'     => WPSEO_Sitemaps_Router::get_base_url( $taxonomy->object_sub_type . '-sitemap.xml' ),
					'lastmod' => $taxonomy->max_object_last_modified,
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
	 *
	 * @throws OutOfBoundsException When an invalid page is requested.
	 */
	public function get_sitemap_links( $type, $max_entries, $current_page ) {
		if ( ! $this->handles_type( $type ) ) {
			return [];
		}

		$steps  = $max_entries;
		$offset = ( $current_page > 1 ) ? ( ( $current_page - 1 ) * $max_entries ) : 0;

		$query = $this->repository
			->query()
			->select_many( 'id', 'permalink', 'object_last_modified' )
			->where( 'object_sub_type', $type )
			->where_raw( '( is_robots_noindex = 0 OR is_robots_noindex IS NULL )' )
			->order_by_desc( 'object_last_modified' )
			->offset( $offset )
			->limit( $steps );

		/**
		 * Filter: 'wpseo_exclude_from_sitemap_by_term_ids' - Allow excluding terms by ID.
		 *
		 * @api array $terms_to_exclude The terms to exclude.
		 */
		$terms_to_exclude = apply_filters( 'wpseo_exclude_from_sitemap_by_term_ids', [] );

		if ( count( $terms_to_exclude ) > 0 ) {
			$query->where_not_in( 'object_id', $terms_to_exclude );
		}

		$indexables = $query->find_many();

		return YoastSEO()->helpers->xml_sitemap->convert_indexables_to_sitemap_links( $indexables );
	}

	/**
	 * Check if taxonomy by name is valid to appear in sitemaps.
	 *
	 * @param string $taxonomy_name Taxonomy name to check.
	 *
	 * @return bool
	 */
	public function is_valid_taxonomy( $taxonomy_name ) {

		if ( WPSEO_Options::get( "noindex-tax-{$taxonomy_name}" ) === true ) {
			return false;
		}

		if ( in_array( $taxonomy_name, [ 'link_category', 'nav_menu' ], true ) ) {
			return false;
		}

		if ( $taxonomy_name === 'post_format' && WPSEO_Options::get( 'disable-post_format', false ) ) {
			return false;
		}

		/**
		 * Filter to exclude the taxonomy from the XML sitemap.
		 *
		 * @param bool   $exclude       Defaults to false.
		 * @param string $taxonomy_name Name of the taxonomy to exclude.
		 */
		if ( apply_filters( 'wpseo_sitemap_exclude_taxonomy', false, $taxonomy_name ) ) {
			return false;
		}

		return true;
	}
}
