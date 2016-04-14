<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Sitemap provider for author archives.
 */
class WPSEO_Author_Sitemap_Provider implements WPSEO_Sitemap_Provider {

	/**
	 * Set up filter for excluded authors.
	 */
	public function __construct() {

		add_filter( 'wpseo_sitemap_exclude_author', array( $this, 'user_sitemap_remove_excluded_authors' ), 8 );
	}

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
	public function get_index_links( $max_entries ) {

		global $wpdb;

		$options = WPSEO_Options::get_all();

		if ( $options['disable-author'] || $options['disable_author_sitemap'] ) {
			return array();
		}

		// TODO Consider doing this less often / when necessary. R.
		$this->update_user_meta();

		$users = get_users( array( 'who' => 'authors' ) );
		$users = $this->exclude_users( $users );
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

			if ( empty( $count ) || $count === $max_pages ) {
				$sql = $wpdb->prepare(
					$date_query . ' DESC LIMIT 1',
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
				'loc'     => WPSEO_Sitemaps_Router::get_base_url( 'author-sitemap' . $count . '.xml' ),
				'lastmod' => '@' . $date, // @ for explicit timestamp format
			);
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

		$options = WPSEO_Options::get_all();

		$links = array();

		if ( $options['disable-author'] === true || $options['disable_author_sitemap'] === true ) {
			return $links;
		}

		$offset = 0;

		if ( $current_page > 1 ) {
			$offset = ( ( $current_page - 1 ) * $max_entries );
		}

		// Query for users with this meta.
		$users = get_users( array(
			'who'      => 'authors',
			'offset'   => $offset,
			'number'   => $max_entries,
			'meta_key' => '_yoast_wpseo_profile_updated',
			'orderby'  => 'meta_value_num',
			'order'    => 'ASC',
		) );

		$users = $this->exclude_users( $users );

		if ( empty( $users ) ) {
			$users = array();
		}

		// Ascending sort.
		usort( $users, array( $this, 'user_map_sorter' ) );

		$time = time();

		foreach ( $users as $user ) {

			$author_link = get_author_posts_url( $user->ID );

			if ( empty( $author_link ) ) {
				continue;
			}

			$mod = $time;

			if ( isset( $user->_yoast_wpseo_profile_updated ) ) {
				$mod = $user->_yoast_wpseo_profile_updated;
			}

			$url = array(
				'loc' => $author_link,
				'pri' => 0.8,
				'chf' => WPSEO_Sitemaps::filter_frequency( 'author_archive', 'daily', $author_link ),
				'mod' => date( DATE_W3C, $mod ),
			);

			/** This filter is documented at inc/sitemaps/class-post-type-sitemap-provider.php */
			$url = apply_filters( 'wpseo_sitemap_entry', $url, 'user', $user );

			if ( ! empty( $url ) ) {
				$links[] = $url;
			}
		}

		return $links;
	}

	/**
	 * Update any users that don't have last profile update timestamp.
	 *
	 * @return int Count of users updated.
	 */
	protected function update_user_meta() {

		$users = get_users( array(
			'who'        => 'authors',
			'meta_query' => array(
				array(
					'key'     => '_yoast_wpseo_profile_updated',
					'value'   => 'needs-a-value-anyway', // This is ignored, but is necessary...
					'compare' => 'NOT EXISTS',
				),
			),
		) );

		$time = time();

		foreach ( $users as $user ) {
			update_user_meta( $user->ID, '_yoast_wpseo_profile_updated', $time );
		}

		return count( $users );
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

	/**
	 * Filter users that should be excluded from the sitemap (by author metatag: wpseo_excludeauthorsitemap).
	 *
	 * Also filtering users that should be exclude by excluded role.
	 *
	 * @param array $users Set of users to filter.
	 *
	 * @return array all the user that aren't excluded from the sitemap
	 */
	public function user_sitemap_remove_excluded_authors( $users ) {

		if ( empty( $users ) ) {
			return $users;
		}

		$options = get_option( 'wpseo_xml' );

		// TODO there are still bugs in this logic, issues on tracker. R.
		foreach ( $users as $user_key => $user ) {
			$exclude_user = false;

			/**
			 * Cheapest condition first; we have all information already.
			 */
			if ( ! $exclude_user ) {
				$user_role    = $user->roles[0];
				$target_key   = "user_role-{$user_role}-not_in_sitemap";
				$exclude_user = isset( $options[ $target_key ] ) && true === $options[ $target_key ];
				unset( $user_role, $target_key );
			}

			/**
			 * If the author has been excluded by preference on profile.
			 */
			if ( ! $exclude_user ) {
				$is_exclude_on = get_the_author_meta( 'wpseo_excludeauthorsitemap', $user->ID );
				$exclude_user = ( $is_exclude_on === 'on' );
			}

			/**
			 * If the author has been excluded by general settings because there are no posts.
			 */
			if ( ! $exclude_user && $options['disable_author_noposts'] === true ) {
				$count_posts  = (int) count_user_posts( $user->ID );
				$exclude_user = ( $count_posts === 0 );
				unset( $count_posts );
			}

			/*
			 * Remove the user from the list if excluded.
			 */
			if ( $exclude_user === true ) {
				unset( $users[ $user_key ] );
			}
		}

		return $users;
	}

	/**
	 * Sorts an array of WP_User by the _yoast_wpseo_profile_updated meta field.
	 *
	 * @since 1.6
	 *
	 * @param WP_User $first  The first WP user.
	 * @param WP_User $second The second WP user.
	 *
	 * @return int 0 if equal, 1 if $a is larger else or -1;
	 */
	public function user_map_sorter( $first, $second ) {

		if ( ! isset( $first->_yoast_wpseo_profile_updated ) ) {
			$first->_yoast_wpseo_profile_updated = time();
		}

		if ( ! isset( $second->_yoast_wpseo_profile_updated ) ) {
			$second->_yoast_wpseo_profile_updated = time();
		}

		if ( $first->_yoast_wpseo_profile_updated === $second->_yoast_wpseo_profile_updated ) {
			return 0;
		}

		return ( ( $first->_yoast_wpseo_profile_updated > $second->_yoast_wpseo_profile_updated ) ? 1 : -1 );
	}
}
