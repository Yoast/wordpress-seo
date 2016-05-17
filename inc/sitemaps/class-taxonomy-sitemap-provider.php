<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Sitemap provider for author archives.
 */
class WPSEO_Taxonomy_Sitemap_Provider implements WPSEO_Sitemap_Provider {

	/** @var array $options All of plugin options. */
	protected $options;

	/** @var WPSEO_Sitemap_Image_Parser $image_parser Holds image parser instance. */
	protected $image_parser;

	/**
	 * Set up object properties for data reuse.
	 */
	public function __construct() {

		$this->options      = WPSEO_Options::get_all();
		$this->image_parser = new WPSEO_Sitemap_Image_Parser();
	}

	/**
	 * Check if provider supports given item type.
	 *
	 * @param string $type Type string to check for.
	 *
	 * @return boolean
	 */
	public function handles_type( $type ) {

		return taxonomy_exists( $type );
	}

	/**
	 * @param int $max_entries Entries per sitemap.
	 *
	 * @return array
	 */
	public function get_index_links( $max_entries ) {

		global $wpdb;

		$taxonomies = get_taxonomies( array( 'public' => true ), 'objects' );

		if ( empty( $taxonomies ) ) {
			return array();
		}

		$taxonomy_names = array_filter( array_keys( $taxonomies ), array( $this, 'is_valid_taxonomy' ) );
		$taxonomies     = array_intersect_key( $taxonomies, array_flip( $taxonomy_names ) );

		// Retrieve all the taxonomies and their terms so we can do a proper count on them.
		/**
		 * Filter the setting of excluding empty terms from the XML sitemap.
		 *
		 * @param boolean $exclude        Defaults to true.
		 * @param array   $taxonomy_names Array of names for the taxonomies being processed.
		 */
		$hide_empty         = ( apply_filters( 'wpseo_sitemap_exclude_empty_terms', true, $taxonomy_names ) ) ? 'count != 0 AND' : '';
		$sql                = "
			SELECT taxonomy, term_id
			FROM $wpdb->term_taxonomy
			WHERE $hide_empty taxonomy IN ('" . implode( "','", $taxonomy_names ) . "');
		";
		$all_taxonomy_terms = $wpdb->get_results( $sql );
		$all_taxonomies     = array();

		foreach ( $all_taxonomy_terms as $obj ) {
			$all_taxonomies[ $obj->taxonomy ][] = $obj->term_id;
		}
		unset( $hide_empty, $sql, $all_taxonomy_terms, $obj );

		$index = array();

		foreach ( $taxonomies as $tax_name => $tax ) {

			if ( ! isset( $all_taxonomies[ $tax_name ] ) ) { // No eligible terms found.
				continue;
			}

			$total_count = ( isset( $all_taxonomies[ $tax_name ] ) ) ? count( $all_taxonomies[ $tax_name ] ) : 1;
			$max_pages   = 1;

			if ( $total_count > $max_entries ) {
				$max_pages = (int) ceil( $total_count / $max_entries );
			}

			$last_modified_gmt = WPSEO_Sitemaps::get_last_modified_gmt( $tax->object_type );

			for ( $page_counter = 0; $page_counter < $max_pages; $page_counter++ ) {

				$current_page = ( $max_pages > 1 ) ? ( $page_counter + 1 ) : '';

				if ( ! is_array( $tax->object_type ) || count( $tax->object_type ) == 0 ) {
					continue;
				}

				if ( ( empty( $current_page ) || $current_page == $max_pages ) ) {
					$date = $last_modified_gmt;
				}
				else {
					$terms = array_splice( $all_taxonomies[ $tax_name ], 0, $max_entries );

					if ( ! $terms ) {
						continue;
					}

					$args  = array(
						'post_type' => $tax->object_type,
						'tax_query' => array(
							array(
								'taxonomy' => $tax_name,
								'terms'    => $terms,
							),
						),
						'orderby'   => 'modified',
						'order'     => 'DESC',
					);
					$query = new WP_Query( $args );

					$date = '';

					if ( $query->have_posts() ) {
						$date = $query->posts[0]->post_modified_gmt;
					}
					else {
						$date = WPSEO_Sitemaps::get_last_modified_gmt( $tax->object_type );
					}
					unset( $terms, $args, $query );
				}

				$index[] = array(
					'loc'     => WPSEO_Sitemaps_Router::get_base_url( $tax_name . '-sitemap' . $current_page . '.xml' ),
					'lastmod' => $date,
				);
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
	 */
	public function get_sitemap_links( $type, $max_entries, $current_page ) {

		global $wpdb;

		$links    = array();
		$taxonomy = get_taxonomy( $type );

		if ( $taxonomy === false || ! $this->is_valid_taxonomy( $taxonomy->name ) || ! $taxonomy->public ) {
			return $links;
		}

		$steps  = $max_entries;
		$offset = ( $current_page > 1 ) ? ( ( $current_page - 1 ) * $max_entries ) : 0;

		/** This filter is documented in inc/sitemaps/class-taxonomy-sitemap-provider.php */
		$hide_empty = apply_filters( 'wpseo_sitemap_exclude_empty_terms', true, $taxonomy );
		$terms      = get_terms( $taxonomy->name, array( 'hide_empty' => $hide_empty ) );
		$terms      = array_splice( $terms, $offset, $steps );

		if ( empty( $terms ) ) {
			$terms = array();
		}

		// Grab last modified date.
		$sql = "
			SELECT MAX(p.post_modified_gmt) AS lastmod
			FROM	$wpdb->posts AS p
			INNER JOIN $wpdb->term_relationships AS term_rel
				ON		term_rel.object_id = p.ID
			INNER JOIN $wpdb->term_taxonomy AS term_tax
				ON		term_tax.term_taxonomy_id = term_rel.term_taxonomy_id
				AND		term_tax.taxonomy = %s
				AND		term_tax.term_id = %d
			WHERE	p.post_status IN ('publish','inherit')
				AND		p.post_password = ''
		";

		foreach ( $terms as $term ) {

			$url = array();

			$tax_noindex     = WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'noindex' );
			$tax_sitemap_inc = WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'sitemap_include' );

			if ( $tax_noindex === 'noindex' && $tax_sitemap_inc !== 'always' ) {
				continue;
			}

			if ( $tax_sitemap_inc === 'never' ) {
				continue;
			}

			$url['loc'] = WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'canonical' );

			if ( ! is_string( $url['loc'] ) || $url['loc'] === '' ) {

				$url['loc'] = get_term_link( $term, $term->taxonomy );

				if ( $this->options['trailingslash'] === true ) {

					$url['loc'] = trailingslashit( $url['loc'] );
				}
			}

			if ( $term->count > 10 ) {
				$url['pri'] = 0.6;
			}
			elseif ( $term->count > 3 ) {
				$url['pri'] = 0.4;
			}
			else {
				$url['pri'] = 0.2;
			}

			$url['mod']    = $wpdb->get_var( $wpdb->prepare( $sql, $term->taxonomy, $term->term_id ) );
			$url['chf']    = WPSEO_Sitemaps::filter_frequency( $term->taxonomy . '_term', 'weekly', $url['loc'] );
			$url['images'] = $this->image_parser->get_term_images( $term );

			/** This filter is documented at inc/sitemaps/class-post-type-sitemap-provider.php */
			$url = apply_filters( 'wpseo_sitemap_entry', $url, 'term', $term );

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

		if ( ! empty( $this->options[ "taxonomies-{$taxonomy_name}-not_in_sitemap" ] ) ) {
			return false;
		}

		if ( in_array( $taxonomy_name, array( 'link_category', 'nav_menu', 'post_format' ) ) ) {
			return false;
		}

		/**
		 * Filter to exclude the taxonomy from the XML sitemap.
		 *
		 * @param boolean $exclude        Defaults to false.
		 * @param string  $taxonomy_name  Name of the taxonomy to exclude..
		 */
		if ( apply_filters( 'wpseo_sitemap_exclude_taxonomy', false, $taxonomy_name ) ) {
			return false;
		}

		return true;
	}
}
