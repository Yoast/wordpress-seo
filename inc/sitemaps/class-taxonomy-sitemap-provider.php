<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Sitemap provider for author archives.
 */
class WPSEO_Taxonomy_Sitemap_Provider extends WPSEO_Indexable_Sitemap_Provider implements WPSEO_Sitemap_Provider {

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
	 * Returns the object type for this sitemap.
	 *
	 * @return string The object type.
	 */
	protected function get_object_type() {
		return 'term';
	}

	/**
	 * Whether or not a specific object sub type should be excluded.
	 *
	 * @param string $object_sub_type The object sub type.
	 *
	 * @return boolean Whether or not it should be excluded.
	 */
	protected function should_exclude_object_sub_type( $object_sub_type ) {
		/**
		 * Filter to exclude the taxonomy from the XML sitemap.
		 *
		 * @param bool   $exclude       Defaults to false.
		 * @param string $taxonomy_name Name of the taxonomy to exclude.
		 */
		if ( apply_filters( 'wpseo_sitemap_exclude_taxonomy', false, $object_sub_type ) ) {
			return true;
		}

		return ! $this->handles_type( $object_sub_type );
	}

	/**
	 * Returns a list of all object IDs that should be excluded.
	 *
	 * @return int[]
	 */
	protected function get_excluded_object_ids() {
		/**
		 * Filter: 'wpseo_exclude_from_sitemap_by_term_ids' - Allow excluding terms by ID.
		 *
		 * @api array $terms_to_exclude The terms to exclude.
		 */
		$excluded_term_ids = apply_filters( 'wpseo_exclude_from_sitemap_by_term_ids', [] );

		if ( ! is_array( $excluded_term_ids ) ) {
			return [];
		}

		$excluded_term_ids = array_map( 'intval', $excluded_term_ids );

		return array_unique( $excluded_term_ids );
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
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		$steps  = $max_entries;
		$offset = ( $current_page > 1 ) ? ( ( $current_page - 1 ) * $max_entries ) : 0;

		$query = $this->repository
			->query_where_noindex( false, 'term', $type )
			->select_many( 'id', 'object_id', 'permalink', 'object_last_modified' )
			->where_raw( '( `canonical` IS NULL OR `canonical` = `permalink` )' )
			->order_by_asc( 'object_last_modified' )
			->offset( $offset )
			->limit( $steps );

		$terms_to_exclude = $this->get_excluded_object_ids();
		if ( is_array( $terms_to_exclude ) && count( $terms_to_exclude ) > 0 ) {
			$query->where_not_in( 'object_id', $terms_to_exclude );
		}

		$indexables = $query->find_many();

		// If total post type count is lower than the offset, an invalid page is requested.
		if ( count( $indexables ) === 0 ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		return $this->xml_sitemap_helper->convert_indexables_to_sitemap_links( $indexables, 'term' );
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
