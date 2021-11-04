<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

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

		$query = $this->repository
			->query()
			->select_many( 'id', 'permalink', 'object_last_modified' )
			->where( 'object_type', 'user' )
			->where_raw( '( is_robots_noindex = 0 OR is_robots_noindex IS NULL )' )
			->order_by_desc( 'object_last_modified' );

		$users_to_exclude = $this->exclude_users( [] );
		if ( count( $users_to_exclude ) > 0 ) {
			$query->where_not_in( 'object_id', $users_to_exclude );
		}

		$indexables = $query->find_many();
		$user_pages = array_chunk( $indexables, $max_entries );

		if ( count( $user_pages ) === 1 ) {
			$page = '';
		}

		foreach ( $user_pages as $users_page ) {
			array_shift( $users_page );

			$index[] = [
				'loc'     => WPSEO_Sitemaps_Router::get_base_url( 'author-sitemap' . $page . '.xml' ),
				'lastmod' => $users_page[0]->object_last_modified,
			];

			++$page;
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

		if ( ! $this->handles_type( 'author' ) ) {
			return [];
		}

		$offset = ( ( $current_page - 1 ) * $max_entries );

		$query = $this->repository
			->query()
			->select_many( 'id', 'permalink', 'object_last_modified' )
			->where( 'object_type', 'user' )
			->where_raw( '( is_robots_noindex = 0 OR is_robots_noindex IS NULL )' )
			->order_by_desc( 'object_last_modified' )
			->offset( $offset )
			->limit( $max_entries );

		$users_to_exclude = $this->exclude_users( [] );
		if ( count( $users_to_exclude ) > 0 ) {
			$query->where_not_in( 'object_id', $users_to_exclude );
		}

		$indexables = $query->find_many();

		// Throw an exception when there are no users in the sitemap.
		if ( count( $indexables ) === 0 ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		return YoastSEO()->helpers->xml_sitemap->convert_indexables_to_sitemap_links( $indexables );
	}

	/**
	 * Wrap legacy filter to deduplicate calls.
	 *
	 * @param array $users Array of user objects to filter.
	 *
	 * @return array
	 */
	protected function exclude_users( $users ) {
		/**
		 * Filter the authors, included in XML sitemap.
		 *
		 * @param array $users Array of user objects to filter.
		 */
		return apply_filters( 'wpseo_sitemap_exclude_author', $users );
	}
}
