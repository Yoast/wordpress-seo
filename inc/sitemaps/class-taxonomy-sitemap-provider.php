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
class WPSEO_Taxonomy_Sitemap_Provider implements WPSEO_Sitemap_Provider {
	/**
	 * Determines whether images should be included in the XML sitemap.
	 *
	 * @var bool
	 */
	private $include_images;

	/**
	 * Set up object properties for data reuse.
	 */
	public function __construct() {
		/**
		 * Filter - Allows excluding images from the XML sitemap.
		 *
		 * @param bool unsigned True to include, false to exclude.
		 */
		$this->include_images = apply_filters( 'wpseo_xml_sitemap_include_images', true );
	}

	/**
	 * Check if provider supports given item type.
	 *
	 * @param string $type Type string to check for.
	 *
	 * @return boolean
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
		$taxonomies     = get_taxonomies( [ 'public' => true ], 'objects' );
		$taxonomy_names = array_filter( array_keys( $taxonomies ), [ $this, 'is_valid_taxonomy' ] );

		return WPSEO_Sitemaps::get_index_links_for_object_type( 'term', $taxonomy_names, $max_entries );
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
		if ( ! $this->handles_type( $type ) ) {
			return $links;
		}

		$taxonomy = get_taxonomy( $type );

		$offset = ( $current_page > 1 ) ? ( ( $current_page - 1 ) * $max_entries ) : 0;

		$term_links = Yoast_Model::of_type( 'Indexable' )
								 ->select( 'object_id' )
								 ->select( 'permalink' )
								 ->select( 'updated_at' )
								 ->where( 'object_type', 'term' )
								 ->where( 'object_sub_type', $taxonomy->name )
								 ->where( 'is_public', 1 )
								 ->order_by_desc( 'updated_at' )
								 ->order_by_desc( 'object_id' )
								 ->limit( $max_entries )
								 ->offset( $offset )
								 ->find_many();

		// If the total term count is lower than the offset, we are on an invalid page.
		if ( count( $term_links ) < $offset ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		/**
		 * Filter: 'wpseo_exclude_from_sitemap_by_term_ids' - Allow excluding terms by ID.
		 *
		 * @api array $terms_to_exclude The terms to exclude.
		 */
		$terms_to_exclude = apply_filters( 'wpseo_exclude_from_sitemap_by_term_ids', [] );

		foreach ( $term_links as $link ) {

			if ( in_array( $link->get( 'object_id' ), $terms_to_exclude, true ) ) {
				continue;
			}

			$url = [
				'loc' => $link->get( 'permalink' ),
				'mod' => $link->get( 'updated_at' ),
			];

			if ( $this->include_images ) {
				// @todo Including images needs fixing.
			}

			/** This filter is documented at inc/sitemaps/class-post-type-sitemap-provider.php */
			$url = apply_filters( 'wpseo_sitemap_entry', $url, 'term', $link );

			if ( ! empty( $url ) ) {
				$links[] = $url;
			}
		}

		return $links;
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

		if ( 'post_format' === $taxonomy_name && WPSEO_Options::get( 'disable-post_format', false ) ) {
			return false;
		}

		/**
		 * Filter to exclude the taxonomy from the XML sitemap.
		 *
		 * @param boolean $exclude       Defaults to false.
		 * @param string  $taxonomy_name Name of the taxonomy to exclude..
		 */
		if ( apply_filters( 'wpseo_sitemap_exclude_taxonomy', false, $taxonomy_name ) ) {
			return false;
		}

		return true;
	}

}
