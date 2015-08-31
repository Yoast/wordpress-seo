<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Sitemap provider for author archives.
 */
class WPSEO_Post_Type_Sitemap_Provider implements WPSEO_Sitemap_Provider {

	/**
	 * Check if provider supports given item type.
	 *
	 * @param string $type Type string to check for.
	 *
	 * @return boolean
	 */
	public function handles_type( $type ) {

		return post_type_exists( $type );
	}

	/**
	 * @param int $max_entries Entries per sitemap.
	 *
	 * @return array
	 */
	public function get_index_links( $max_entries) {

		global $wpdb;

		$options    = WPSEO_Options::get_all();
		$post_types = get_post_types( array( 'public' => true ) );

		$index = array();

		foreach ( $post_types as $post_type ) {

			if ( ! empty( $options[ "post_types-{$post_type}-not_in_sitemap" ] ) ) {
				continue;
			}

			// TODO document filter. R.
			if ( apply_filters( 'wpseo_sitemap_exclude_post_type', false, $post_type ) ) {
				continue;
			}

			// Using same filters for filtering join and where parts of the query.
			$join_filter  = apply_filters( 'wpseo_typecount_join', '', $post_type );
			$where_filter = apply_filters( 'wpseo_typecount_where', '', $post_type );

			// Using the same query with build_post_type_map($post_type) function to count number of posts.
			$sql   = "
				SELECT COUNT(ID)
				FROM $wpdb->posts
				{$join_filter}
				WHERE post_status IN ('publish','inherit')
					AND post_password = ''
					AND post_date != '0000-00-00 00:00:00'
					AND post_type = %s
					{$where_filter}
			";
			$count = $wpdb->get_var( $wpdb->prepare( $sql, $post_type ) );

			if ( $count === 0 ) {
				continue;
			}

			$max_pages = ( $count > $max_entries ) ? (int) ceil( $count / $max_entries ) : 1;

			for ( $i = 0; $i < $max_pages; $i++ ) {
				$count = ( $max_pages > 1 ) ? ( $i + 1 ) : '';

				if ( empty( $count ) || $count === $max_pages ) {
					$date = WPSEO_Sitemaps::get_last_modified_gmt( $post_type );
				}
				else {
					$sql       = "
						SELECT post_modified_gmt
						FROM (
							SELECT @rownum:=@rownum+1 rownum, $wpdb->posts.post_modified_gmt
							FROM (SELECT @rownum:=0) r, $wpdb->posts
							WHERE post_status IN ('publish','inherit')
								AND post_type = %s
							ORDER BY post_modified_gmt ASC
						) x
						WHERE rownum %%%d=0
					";
					$all_dates = $wpdb->get_col( $wpdb->prepare( $sql, $post_type, $max_entries ) );
					$date      = $all_dates[ $i ];
				}

				$index[] = array(
					'loc'     => wpseo_xml_sitemaps_base_url( $post_type . '-sitemap' . $count . '.xml' ),
					'lastmod' => $date,
				);
			}
		}

		return $index;
	}
}
