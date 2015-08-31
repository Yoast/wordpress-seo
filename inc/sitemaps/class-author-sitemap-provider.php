<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Sitemap provider for author archives.
 */
class WPSEO_Author_Sitemap_Provider implements WPSEO_Sitemap_Provider {

	/**
	 * Check if provider supports given item type.
	 *
	 * @param string $type Type string to check for.
	 *
	 * @return boolean
	 */
	public function handles_type( $type ) {

		return $type === 'author';
	}

	/**
	 * @param int $max_entries Entries per sitemap.
	 *
	 * @return array
	 */
	public function get_index_links( $max_entries) {

		global $wpdb;

		$options = WPSEO_Options::get_all();

		if ( $options['disable-author'] || $options['disable_author_sitemap'] ) {
			return array();
		}

		$users = get_users( array( 'who' => 'authors' ) );
		$users = apply_filters( 'wpseo_sitemap_exclude_author', $users );
		$users = wp_list_pluck( $users, 'ID' );

		$count     = count( $users );
		$max_pages = ( $count > 0 ) ? 1 : 0;

		if ( $count > $max_entries ) {
			$max_pages = (int) ceil( $count / $max_entries );
		};

		// Must use custom raw query because WP User Query does not support ordering by usermeta.
		// Retrieve the newest updated profile timestamp overall.
		// TODO order by usermeta supported since WP 3.7, update implementation? R.
		$date_query = "
			SELECT mt1.meta_value
			FROM $wpdb->users
				INNER JOIN $wpdb->usermeta ON ($wpdb->users.ID = $wpdb->usermeta.user_id)
				INNER JOIN $wpdb->usermeta AS mt1 ON ($wpdb->users.ID = mt1.user_id)
			WHERE 1=1
				AND (
					($wpdb->usermeta.meta_key = %s AND CAST($wpdb->usermeta.meta_value AS CHAR) != '0')
					AND mt1.meta_key = '_yoast_wpseo_profile_updated'
				)
			ORDER BY mt1.meta_value
		";

		$index = array();

		for ( $i = 0; $i < $max_pages; $i++ ) {

			$count = ( $max_pages > 1 ) ? ( $i + 1 ) : '';

			if ( empty( $count ) || $count == $max_pages ) {
				$sql = $wpdb->prepare(
					$date_query . ' ASC LIMIT 1',
					$wpdb->get_blog_prefix() . 'user_level'
				);
				// Retrieve the newest updated profile timestamp by an offset.
			}
			else {
				$sql = $wpdb->prepare(
					$date_query . ' DESC LIMIT 1 OFFSET %d',
					$wpdb->get_blog_prefix() . 'user_level',
					( ( $max_entries * ( $i + 1 ) ) - 1 )
				);
			}

			$date = $wpdb->get_var( $sql );

			$index[] = array(
				'loc'     => wpseo_xml_sitemaps_base_url( 'author-sitemap' . $count . '.xml' ),
				'lastmod' => '@' . $date, // @ for explicit timestamp format
			);
		}

		return $index;
	}
}
