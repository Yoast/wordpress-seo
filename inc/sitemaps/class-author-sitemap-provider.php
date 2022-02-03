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
 * Sitemap provider for author archives.
 */
class WPSEO_Author_Sitemap_Provider implements WPSEO_Sitemap_Provider {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $repository;

	/**
	 * The XML sitemap helper.
	 *
	 * @var XML_Sitemap_Helper
	 */
	private $xml_sitemap_helper;

	/**
	 * Set up object properties for data reuse.
	 */
	public function __construct() {
		$this->repository         = YoastSEO()->classes->get( Indexable_Repository::class );
		$this->xml_sitemap_helper = YoastSEO()->helpers->xml_sitemap;
	}

	/**
	 * Check if provider supports given item type.
	 *
	 * @param string $type Type string to check for.
	 *
	 * @return bool
	 */
	public function handles_type( $type ) {
		// If the author archives have been disabled, we don't do anything.
		if ( WPSEO_Options::get( 'disable-author', false ) || WPSEO_Options::get( 'noindex-author-wpseo', false ) ) {
			return false;
		}

		return $type === 'author';
	}

	/**
	 * Get the links for the sitemap index.
	 *
	 * @param int $max_entries Entries per sitemap.
	 *
	 * @return array
	 */
	public function get_index_links( $max_entries ) {
		if ( ! $this->handles_type( 'author' ) ) {
			return [];
		}

		$last_object_per_page = $this->get_last_object_per_page( $max_entries );

		$page = 1;
		if ( count( $last_object_per_page ) === 1 ) {
			$page = '';
		}

		$index_links = [];
		foreach ( $last_object_per_page as $object ) {
			$index_links[] = [
				'loc'     => WPSEO_Sitemaps_Router::get_base_url( 'author-sitemap' . $page . '.xml' ),
				'lastmod' => $object->object_last_modified,
			];

			if ( is_int( $page ) ) {
				++$page;
			}
		}

		return $index_links;
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

		if ( ! $this->handles_type( 'author' ) ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		$offset = ( ( $current_page - 1 ) * $max_entries );

		$noindex_authors_with_no_posts = WPSEO_Options::get( 'noindex-author-noposts-wpseo' );
		$query                         = $this->repository
			->query_where_noindex( false, 'user', null, $noindex_authors_with_no_posts )
			->select_many( 'id', 'object_id', 'permalink', 'object_last_modified' )
			->where_raw( '( `canonical` IS NULL OR `canonical` = `permalink` )' )
			->order_by_asc( 'object_last_modified' )
			->offset( $offset )
			->limit( $max_entries );

		$users_to_exclude = $this->exclude_users();
		if ( count( $users_to_exclude ) > 0 ) {
			$query->where_not_in( 'object_id', $users_to_exclude );
		}

		$indexables = $query->find_many();

		// Throw an exception when there are no users in the sitemap.
		if ( count( $indexables ) === 0 ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		return $this->xml_sitemap_helper->convert_indexables_to_sitemap_links( $indexables, 'user' );
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

		$noindex_authors_with_no_posts = WPSEO_Options::get( 'noindex-author-noposts-wpseo' );

		$query = $this->repository
			->query_where_noindex( false, 'user', null, $noindex_authors_with_no_posts )
			->select( 'id' )
			->where_raw( '( `canonical` IS NULL OR `canonical` = `permalink` )' )
			->order_by_asc( 'object_last_modified' );

		$users_to_exclude = $this->exclude_users();
		if ( is_array( $users_to_exclude ) && count( $users_to_exclude ) > 0 ) {
			$query->where_not_in( 'object_id', $users_to_exclude );
		}

		$table_name = Model::get_table_name( 'Indexable' );
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Query is prepared by our ORM.
		$raw_query = $wpdb->prepare( $query->get_sql(), $query->get_values() );

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- Complex query is not possible without a direct query.
		$last_object_per_page = $wpdb->get_results(
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Variables are secure.
			$wpdb->prepare(
			// This query pulls only every Nth last_modified from the database.
				"
					SELECT i.object_last_modified
					FROM $table_name AS i
					INNER JOIN (
						SELECT id
						FROM (
							SELECT @row:=@row+1 AS rownum, id
							FROM ( $raw_query ) AS sorted, ( SELECT @row:=-1 ) AS init
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

		// Ensure that author pages with fewer objects than the max_entries get a link.
		$aggregate_query = $this->repository
			->query_where_noindex( false, 'user', null, $noindex_authors_with_no_posts )
			->select_expr( 'MAX(`object_last_modified`)', 'most_recently_modified' )
			->select_expr( 'COUNT(`id`)', 'number_of_authors' )
			->where_raw( '( `canonical` IS NULL OR `canonical` = `permalink` )' )
			->having_gt( 'number_of_authors', 0 );

		if ( is_array( $users_to_exclude ) && count( $users_to_exclude ) > 0 ) {
			$aggregate_query->where_not_in( 'object_id', $users_to_exclude );
		}

		// We must use find_array. Other functions will try to map the aggregates to the Indexable model.
		$aggregates = (array) $aggregate_query->find_array();

		if ( isset( $aggregates[0]['number_of_authors'] ) && ( $aggregates[0]['number_of_authors'] % $max_entries_per_page !== 0 ) ) {
			$last_object_per_page[] = (object) [
				'object_last_modified' => $aggregates[0]['most_recently_modified'],
			];
		}

		return $last_object_per_page;
	}

	/**
	 * Wrap legacy filter to deduplicate calls.
	 *
	 * @return array
	 */
	protected function exclude_users() {
		/**
		 * Filter the authors, included in XML sitemap.
		 *
		 * @param array $users Array of user objects to filter.
		 */
		return apply_filters( 'wpseo_sitemap_exclude_author', [ 0 ] );
	}
}
