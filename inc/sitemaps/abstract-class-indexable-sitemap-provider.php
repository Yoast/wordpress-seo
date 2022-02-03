<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Helpers\XML_Sitemap_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * WPSEO_Indexable_Sitemap_Provider abstract class
 */
abstract class WPSEO_Indexable_Sitemap_Provider implements WPSEO_Sitemap_Provider {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The XML sitemap helper.
	 *
	 * @var XML_Sitemap_Helper
	 */
	protected $xml_sitemap_helper;

	/**
	 * Set up object properties for data reuse.
	 */
	public function __construct() {
		$this->repository         = YoastSEO()->classes->get( Indexable_Repository::class );
		$this->xml_sitemap_helper = YoastSEO()->helpers->xml_sitemap;
	}

	/**
	 * Retrieves the links for the sitemap.
	 *
	 * @param int $max_entries Entries per sitemap.
	 *
	 * @return array
	 */
	public function get_index_links( $max_entries ) {
		$last_object_per_page = $this->get_last_object_per_page( $max_entries );

		$links              = [];
		$page               = 1;
		$present_page_types = [];
		foreach ( $last_object_per_page as $index => $object ) {
			if ( $this->should_exclude_object_sub_type( $object->object_sub_type ) ) {
				continue;
			}

			$present_page_types[] = $object->object_sub_type;

			$next_object_is_not_same_sub_type = ! isset( $last_object_per_page[ ( $index + 1 ) ] ) || $last_object_per_page[ ( $index + 1 ) ]->object_sub_type !== $object->object_sub_type;
			if ( $page === 1 && $next_object_is_not_same_sub_type ) {
				$page = '';
			}

			$links[] = [
				'loc'     => WPSEO_Sitemaps_Router::get_base_url( $object->object_sub_type . '-sitemap' . ( $page ) . '.xml' ),
				'lastmod' => $object->object_last_modified,
			];

			if ( is_int( $page ) ) {
				++$page;
			}

			if ( $next_object_is_not_same_sub_type ) {
				$page = 1;
			}
		}

		foreach ( $this->get_non_empty_types() as $object_sub_type ) {
			if ( ! in_array( $object_sub_type, $present_page_types, true ) ) {
				$links[] = [
					'loc'     => WPSEO_Sitemaps_Router::get_base_url( $object_sub_type . '-sitemap.xml' ),
					'lastmod' => null,
				];
			}
		}

		return $links;
	}

	/**
	 * Gets a list of sitemap objects that represent the last entry on an individual sitemap page.
	 *
	 * @param int $max_entries_per_page The maximum allowed number of objects on a single page.
	 *
	 * @return array A list of sitemap objects that represent the last entry on an individual sitemap page.
	 */
	protected function get_last_object_per_page( $max_entries_per_page ) {
		global $wpdb;

		$query = $this->repository
			->query_where_noindex( false, $this->get_object_type() )
			->select_many( 'id', 'object_sub_type' )
			->where_raw( '( `canonical` IS NULL OR `canonical` = `permalink` )' )
			->order_by_asc( 'object_sub_type' )
			->order_by_asc( 'object_last_modified' );

		$excluded_object_ids = $this->get_excluded_object_ids();
		if ( is_array( $excluded_object_ids ) && count( $excluded_object_ids ) > 0 ) {
			$query->where_not_in( 'object_id', $excluded_object_ids );
		}

		$table_name = Model::get_table_name( 'Indexable' );
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Query is prepared by our ORM.
		$raw_query = $wpdb->prepare( $query->get_sql(), $query->get_values() );

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- Complex query is not possible without a direct query.
		$last_object_per_page = $wpdb->get_results(
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Variables are secure.
			$wpdb->prepare(
			// This query pulls only every Nth last_modified from the database, resetting row counts when the sub type changes.
				"
					SELECT i.object_sub_type, i.object_last_modified
					FROM $table_name AS i
					INNER JOIN (
						SELECT id
						FROM (
							SELECT 
								IF( @previous_sub_type = object_sub_type, @row:=@row+1, @row:=0) AS rownum, 
								@previous_sub_type:=object_sub_type AS previous_sub_type,
								id
							FROM ( $raw_query ) AS sorted, ( SELECT @row:=-1, @previous_sub_type:=null ) AS init
						) AS ranked
						WHERE rownum MOD %d = (%d-1) -- Get the last entry of all full pages.
					) AS subset
					ON subset.id = i.id
				",
				$max_entries_per_page,
				$max_entries_per_page
			)
		// phpcs:enable
		);

		if ( ! $last_object_per_page ) {
			$last_object_per_page = [];
		}

		// Ensure that pages with fewer objects than the max_entries get a link.
		$post_type_aggregate_query = $this->repository
			->query_where_noindex( false, $this->get_object_type() )
			->select( 'object_sub_type' )
			->select_expr( 'MAX(`object_last_modified`)', 'post_type_last_modified' )
			->select_expr( 'COUNT(`id`)', 'number_of_posts' )
			->where_raw( '( `canonical` IS NULL OR `canonical` = `permalink` )' )
			->having_gt( 'number_of_posts', 0 )
			->group_by( 'object_sub_type' );

		if ( is_array( $excluded_object_ids ) && count( $excluded_object_ids ) > 0 ) {
			$post_type_aggregate_query->where_not_in( 'object_id', $excluded_object_ids );
		}
		$post_type_aggregates = (array) $post_type_aggregate_query->find_array();

		foreach ( $post_type_aggregates as $post_type_aggregate ) {
			if ( isset( $post_type_aggregate['number_of_posts'] ) && ( $post_type_aggregate['number_of_posts'] % $max_entries_per_page !== 0 ) ) {
				$half_page_object   = (object) [
					'object_sub_type'      => $post_type_aggregate['object_sub_type'],
					'object_last_modified' => $post_type_aggregate['post_type_last_modified'],
				];
				$last_subtype_index = 0;
				foreach ( $last_object_per_page as $index => $object ) {
					if ( $object->object_sub_type === $post_type_aggregate['object_sub_type'] ) {
						$last_subtype_index = $index;
					}
				}

				// Insert after the last complete page of the same type.
				$last_object_per_page = array_merge(
					array_splice( $last_object_per_page, 0, ( $last_subtype_index + 1 ) ),
					[ $half_page_object ],
					$last_object_per_page
				);
			}
		}

		return $last_object_per_page;
	}

	/**
	 * Gets a list of object subtypes that should have at least one link on the sitemap index.
	 * This is needed for sitemaps that add links to the first page of the sitemap. If there are no posts,
	 * there would not be a link on the sitemap index, unless if the object subtype is defined here.
	 *
	 * @return string[] A list of indexable subtypes that should get at least one link on the sitemap index.
	 */
	protected function get_non_empty_types() {
		return [];
	}

	/**
	 * Returns the object type for this sitemap.
	 *
	 * @return string The object type.
	 */
	abstract protected function get_object_type();

	/**
	 * Returns a list of all object IDs that should be excluded.
	 *
	 * @return int[]
	 */
	abstract protected function get_excluded_object_ids();

	/**
	 * Whether or not a specific object sub type should be excluded.
	 *
	 * @param string $object_sub_type The object sub type.
	 *
	 * @return boolean Whether or not it should be excluded.
	 */
	abstract protected function should_exclude_object_sub_type( $object_sub_type );
}
