<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

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

		$query = $this->repository
			->query_where_noindex( false, 'user' )
			->select_many( 'id', 'permalink', 'object_last_modified' )
			->order_by_asc( 'object_last_modified' );

		$users_to_exclude = $this->exclude_users();
		if ( count( $users_to_exclude ) > 0 ) {
			$query->where_not_in( 'object_id', $users_to_exclude );
		}

		$indexables = $query->find_many();
		$user_pages = array_chunk( $indexables, $max_entries );

		$page = 1;
		if ( count( $user_pages ) === 1 ) {
			$page = '';
		}

		$index_links = [];
		foreach ( $user_pages as $users_page ) {
			$index_links[] = [
				'loc'     => WPSEO_Sitemaps_Router::get_base_url( 'author-sitemap' . $page . '.xml' ),
				'lastmod' => $users_page[0]->object_last_modified,
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
			return [];
		}

		$offset = ( ( $current_page - 1 ) * $max_entries );

		$query = $this->repository
			->query_where_noindex( false, 'user' )
			->select_many( 'id', 'object_id', 'permalink', 'object_last_modified' )
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
