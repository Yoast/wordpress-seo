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
class WPSEO_Author_Sitemap_Provider implements WPSEO_Sitemap_Provider {

	/**
	 * WPSEO_Author_Sitemap_Provider constructor.
	 */
	public function __construct() {
	}

	/**
	 * Check if provider supports given item type.
	 *
	 * @param string $type Type string to check for.
	 *
	 * @return boolean
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

		$users = $this->get_users( 0, 0 );
		$users = $this->exclude_users( $users );

		if ( empty( $users ) ) {
			return [];
		}

		$index      = [];
		$page       = 1;
		$user_pages = array_chunk( $users, $max_entries );

		if ( count( $user_pages ) === 1 ) {
			$page = '';
		}

		foreach ( $user_pages as $users_page ) {
			$max     = count( $users_page ) - 1;
			$index[] = [
				'loc'     => WPSEO_Sitemaps_Router::get_base_url( 'author-sitemap' . $page . '.xml' ),
				'lastmod' => $users_page[ $max ]->get( 'updated_at' )
			];

			$page ++;
		}

		return $index;
	}

	/**
	 * Retrieve users, taking account of all necessary exclusions.
	 *
	 * @param int $max_entries Maximum number of users to return.
	 * @param int $offset      The offset to start from.
	 *
	 * @return array An array of users.
	 */
	protected function get_users( $max_entries, $offset = 0 ) {
		$model = Yoast_Model::of_type( 'Indexable' )
							->select( 'permalink' )
							->select( 'updated_at' )
							->select( 'object_id' )
							->where( 'object_type', 'user' )
							->where( 'is_public', 1 )
							->order_by_desc( 'updated_at' );

		if ( $max_entries ) {
			$model->limit( $max_entries );
			$model->offset( $offset );
		}

		return $model->find_many();
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

		$links = [];

		if ( ! $this->handles_type( 'author' ) ) {
			return $links;
		}

		$offset = ( ( $current_page - 1 ) * $max_entries );
		$users  = $this->get_users( $max_entries, $offset );

		// Throw an exception when there are no users in the sitemap.
		if ( count( $users ) === 0 ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		$users = $this->exclude_users( $users );
		if ( empty( $users ) ) {
			$users = [];
		}

		foreach ( $users as $user ) {
			$url = [
				'loc' => $user->get( 'permalink' ),
				'mod' => $user->get( 'updated_at' ),
			];

			/** This filter is documented at inc/sitemaps/class-post-type-sitemap-provider.php */
			$url = apply_filters( 'wpseo_sitemap_entry', $url, 'user', $user );

			if ( ! empty( $url ) ) {
				$links[] = $url;
			}
		}

		return $links;
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
