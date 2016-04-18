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

		global $wp_version;

		// TODO Remove after plugin requirements raised to WP 4.4. R.
		if ( version_compare( $wp_version, '4.4', '<' ) ) {
			add_filter( 'wpseo_sitemap_exclude_author', array( $this, 'user_sitemap_remove_excluded_authors' ), 8 );
		}
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

		$options = WPSEO_Options::get_all();

		if ( $options['disable-author'] || $options['disable_author_sitemap'] ) {
			return array();
		}

		// TODO Consider doing this less often / when necessary. R.
		$this->update_user_meta();

		$has_exclude_filter = has_filter( 'wpseo_sitemap_exclude_author' );

		$query_arguments = array();

		if ( ! $has_exclude_filter ) {
			$query_arguments['fields'] = 'ID';
		}

		$users = $this->get_users( $query_arguments );

		if ( $has_exclude_filter ) {
			$users = $this->exclude_users( $users );
			$users = wp_list_pluck( $users, 'ID' );
		}

		if ( empty( $users ) ) {
			return array();
		}

		$index = array();
		$page  = 1;
		$users = array_chunk( $users, $max_entries );

		foreach ( $users as $users_page ) {

			$user_id = array_shift( $users_page ); // Time descending, first user on page is least recently updated.
			$user    = get_user_by( 'id', $user_id );
			$index[] = array(
				'loc'     => WPSEO_Sitemaps_Router::get_base_url( 'author-sitemap' . $page . '.xml' ),
				'lastmod' => '@' . $user->_yoast_wpseo_profile_updated, // @ for explicit timestamp format
			);

			$page++;
		}

		return $index;
	}

	/**
	 * Retrieve users, taking account of all necessary exclusions.
	 *
	 * @param array $arguments Arguments to add.
	 *
	 * @return array
	 */
	protected function get_users( $arguments = array() ) {

		global $wp_version;

		$options = WPSEO_Options::get_all();

		$defaults = array(
			'who'        => 'authors',
			'meta_key'   => '_yoast_wpseo_profile_updated',
			'orderby'    => 'meta_value_num',
			'order'      => 'DESC',
			'meta_query' => array(
				'relation' => 'OR',
				array(
					'key'     => 'wpseo_excludeauthorsitemap',
					'value'   => 'on',
					'compare' => '!=',
				),
				array(
					'key'     => 'wpseo_excludeauthorsitemap',
					'compare' => 'NOT EXISTS',
				),
			),
		);

		// TODO Remove version condition after plugin requirements raised to WP 4.3. R.
		if ( $options['disable_author_noposts'] === true && version_compare( $wp_version, '4.3', '>=' ) ) {
			$defaults['who']                 = ''; // Otherwise it cancels out next argument.
			$defaults['has_published_posts'] = true;
		}

		// TODO Remove version condition after plugin requirements raised to WP 4.4. R.
		if ( version_compare( $wp_version, '4.4', '>=' ) ) {

			$excluded_roles = $this->get_excluded_roles();

			if ( ! empty( $excluded_roles ) ) {
				$defaults['who']          = ''; // Otherwise it cancels out next argument.
				$defaults['role__not_in'] = $excluded_roles;
			}
		}

		return get_users( array_merge( $defaults, $arguments ) );
	}

	/**
	 * Retrieve array of roles, excluded in settings.
	 *
	 * @return array
	 */
	protected function get_excluded_roles() {

		static $excluded_roles;

		if ( isset( $excluded_roles ) ) {
			return $excluded_roles;
		}

		$options = WPSEO_Options::get_all();
		$roles   = WPSEO_Utils::get_roles();

		foreach ( $roles as $role_slug => $role_name ) {

			if ( ! empty( $options[ "user_role-{$role_slug}-not_in_sitemap" ] ) ) {
				$excluded_roles[] = $role_name;
			}
		}

		if ( ! empty( $excluded_roles ) ) { // Otherwise it's handled by who=>authors query.
			$excluded_roles[] = 'Subscriber';
		}

		return $excluded_roles;
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

		$users = $this->get_users( array(
			'offset' => ( $current_page - 1 ) * $max_entries,
			'number' => $max_entries,
		) );

		$users = $this->exclude_users( $users );

		if ( empty( $users ) ) {
			$users = array();
		}

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
	 * @deprecated The checks are problematic legacy code and don't run on WP core above 4.4.
	 *
	 * @param array $users Set of users to filter.
	 *
	 * @return array all the user that aren't excluded from the sitemap
	 */
	public function user_sitemap_remove_excluded_authors( $users ) {

		if ( empty( $users ) ) {
			return $users;
		}

		global $wp_version;

		$options = get_option( 'wpseo_xml' );

		foreach ( $users as $user_key => $user ) {

			$exclude_user = false;

			/**
			 * Cheapest condition first; we have all information already.
			 *
			 * @TODO Remove after plugin requirements raised to WP 4.4. R.
			 */
			if ( ! $exclude_user && version_compare( $wp_version, '4.4', '<' ) ) {
				$user_role    = $user->roles[0];
				$target_key   = "user_role-{$user_role}-not_in_sitemap";
				$exclude_user = isset( $options[ $target_key ] ) && true === $options[ $target_key ];
				unset( $user_role, $target_key );
			}

			/**
			 * If the author has been excluded by preference on profile.
			 *
			 * @TODO Remove after plugin requirements raised to WP 4.3. R.
			 */
			if ( ! $exclude_user && version_compare( $wp_version, '4.3', '<' ) ) {
				$is_exclude_on = get_the_author_meta( 'wpseo_excludeauthorsitemap', $user->ID );
				$exclude_user  = ( $is_exclude_on === 'on' );
			}

			/**
			 * If the author has been excluded by general settings because there are no posts.
			 *
			 * @TODO Remove after plugin requirements raised to WP 4.3. R.
			 */
			if ( ! $exclude_user && $options['disable_author_noposts'] === true && version_compare( $wp_version, '4.3', '<' ) ) {
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
	 * @deprecated 3.3 User meta sort can now be done by queries.
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
