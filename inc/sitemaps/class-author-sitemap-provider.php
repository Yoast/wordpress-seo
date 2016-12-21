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
	public function get_index_links( $max_entries ) {

		$options = WPSEO_Options::get_all();

		if ( $options['disable-author'] || $options['disable_author_sitemap'] ) {
			return array();
		}

		// TODO Consider doing this less often / when necessary. R.
		$this->update_user_meta();

		$has_exclude_filter = has_filter( 'wpseo_sitemap_exclude_author' );

		$query_arguments = array();

		if ( ! $has_exclude_filter ) { // We only need full users if legacy filter(s) hooked to exclusion logic. R.
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

		$index      = array();
		$page       = 1;
		$user_pages = array_chunk( $users, $max_entries );

		if ( count( $user_pages ) === 1 ) {
			$page = '';
		}

		foreach ( $user_pages as $users_page ) {

			$user_id = array_shift( $users_page ); // Time descending, first user on page is most recently updated.
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

		global $wpdb;

		$options = WPSEO_Options::get_all();

		$defaults = array(
			// TODO re-enable after plugin requirements raised to WP 4.6 with the fix.
			// 'who'        => 'authors', Breaks meta keys, see https://core.trac.wordpress.org/ticket/36724#ticket R.
			'meta_key'   => '_yoast_wpseo_profile_updated',
			'orderby'    => 'meta_value_num',
			'order'      => 'DESC',
			'meta_query' => array(
				'relation' => 'AND',
				array(
					'key'     => $wpdb->get_blog_prefix() . 'user_level',
					'value'   => '0',
					'compare' => '!=',
				),
				array(
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
			),
		);

		if ( $options['disable_author_noposts'] === true ) {
			// $defaults['who']                 = ''; // Otherwise it cancels out next argument.
			$defaults['has_published_posts'] = true;
		}

		$excluded_roles = $this->get_excluded_roles();

		if ( ! empty( $excluded_roles ) ) {
			// $defaults['who']          = ''; // Otherwise it cancels out next argument.
			$defaults['role__not_in'] = $excluded_roles;
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
				'mod' => date( DATE_W3C, $mod ),

				// Deprecated, kept for backwards data compat. R.
				'chf' => 'daily',
				'pri' => 1,
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
		_deprecated_function( __METHOD__, 'WPSEO 3.3', __( 'Use queries instead', 'wordpress-seo' ) );

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
