<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Sitemap provider for author archives.
 */
class WPSEO_Taxonomy_Sitemap_Provider implements WPSEO_Sitemap_Provider {

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
	public function get_index_links( $max_entries) {

		global $wpdb;

		$options    = WPSEO_Options::get_all();
		$taxonomies = get_taxonomies( array( 'public' => true ), 'objects' );

		if ( empty( $taxonomies ) ) {
			return array();
		}

		$taxonomy_names = array_keys( $taxonomies );

		foreach ( $taxonomy_names as $tax ) {

			if ( in_array( $tax, array( 'link_category', 'nav_menu', 'post_format' ) ) ) {
				unset( $taxonomy_names[ $tax ], $taxonomies[ $tax ] );
				continue;
			}

			if ( apply_filters( 'wpseo_sitemap_exclude_taxonomy', false, $tax ) ) {
				unset( $taxonomy_names[ $tax ], $taxonomies[ $tax ] );
				continue;
			}

			if ( isset( $options[ 'taxonomies-' . $tax . '-not_in_sitemap' ] ) && $options[ 'taxonomies-' . $tax . '-not_in_sitemap' ] === true ) {
				unset( $taxonomy_names[ $tax ], $taxonomies[ $tax ] );
				continue;
			}
		}
		unset( $tax );

		// Retrieve all the taxonomies and their terms so we can do a proper count on them.
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

			$steps = $max_entries;
			$count = ( isset( $all_taxonomies[ $tax_name ] ) ) ? count( $all_taxonomies[ $tax_name ] ) : 1;
			$n     = ( $count > $max_entries ) ? (int) ceil( $count / $max_entries ) : 1;

			for ( $i = 0; $i < $n; $i++ ) {

				$count = ( $n > 1 ) ? ( $i + 1 ) : '';

				if ( ! is_array( $tax->object_type ) || count( $tax->object_type ) == 0 ) {
					continue;
				}

				if ( ( empty( $count ) || $count == $n ) ) {
					$date = WPSEO_Sitemaps::get_last_modified_gmt( $tax->object_type );
				}
				else {
					$terms = array_splice( $all_taxonomies[ $tax_name ], 0, $steps );

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
					'loc'     => wpseo_xml_sitemaps_base_url( $tax_name . '-sitemap' . $count . '.xml' ),
					'lastmod' => $date,
				);
			}
		}

		return $index;
	}
}
