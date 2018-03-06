<?php
/**
 * @package    WPSEO
 * @subpackage Internal
 */

/**
 * This code handles the option upgrades
 */
class WPSEO_Upgrade {
	/**
	 * Class constructor
	 */
	public function __construct() {
		$version = WPSEO_Options::get( 'version' );

		WPSEO_Options::maybe_set_multisite_defaults( false );

		if ( version_compare( $version, '1.5.0', '<' ) ) {
			$this->upgrade_15( $version );
		}

		if ( version_compare( $version, '2.0', '<' ) ) {
			$this->upgrade_20();
		}

		if ( version_compare( $version, '2.1', '<' ) ) {
			$this->upgrade_21();
		}

		if ( version_compare( $version, '2.2', '<' ) ) {
			$this->upgrade_22();
		}

		if ( version_compare( $version, '2.3', '<' ) ) {
			$this->upgrade_23();
		}

		if ( version_compare( $version, '3.0', '<' ) ) {
			$this->upgrade_30();
		}

		if ( version_compare( $version, '3.3', '<' ) ) {
			$this->upgrade_33();
		}

		if ( version_compare( $version, '3.6', '<' ) ) {
			$this->upgrade_36();
		}

		if ( version_compare( $version, '4.0', '<' ) ) {
			$this->upgrade_40();
		}

		if ( version_compare( $version, '4.4', '<' ) ) {
			$this->upgrade_44();
		}

		if ( version_compare( $version, '4.7', '<' ) ) {
			$this->upgrade_47();
		}

		if ( version_compare( $version, '4.9', '<' ) ) {
			$this->upgrade_49();
		}

		if ( version_compare( $version, '5.0', '<' ) ) {
			$this->upgrade_50();
		}

		if ( version_compare( $version, '5.0', '>=' )
			&& version_compare( $version, '5.1', '<' )
		) {
			$this->upgrade_50_51();
		}

		if ( version_compare( $version, '5.5', '<' ) ) {
			$this->upgrade_55();
		}

		if ( version_compare( $version, '5.6', '<' ) ) {
			$this->upgrade_56();
		}

		if ( version_compare( $version, '6.1', '<' ) ) {
			$this->upgrade_61();
		}

		if ( version_compare( $version, '6.3', '<' ) ) {
			$this->upgrade_63();
		}

		if ( version_compare( $version, '7.0-RC0', '<' ) ) {
			$this->upgrade_70();
		}

		// Since 3.7.
		$upsell_notice = new WPSEO_Product_Upsell_Notice();
		$upsell_notice->set_upgrade_notice();

		/**
		 * Filter: 'wpseo_run_upgrade' - Runs the upgrade hook which are dependent on Yoast SEO
		 *
		 * @api        string - The current version of Yoast SEO
		 */
		do_action( 'wpseo_run_upgrade', $version );

		$this->finish_up();
	}

	/**
	 * Helper function to remove keys from options.
	 *
	 * @param string       $option The option to remove the keys from.
	 * @param string|array $keys   The key or keys to remove.
	 */
	private function remove_key_from_option( $option, $keys ) {
		$options = WPSEO_Options::get_option( $option );

		if ( ! is_array( $keys ) ) {
			$keys = array( $keys );
		}
		foreach ( $keys as $key ) {
			unset( $options[ $key ] );
		}

		update_option( $option, $options );
	}

	/**
	 * Helper function to move a key from one option to another.
	 *
	 * @param array       $old_options The option containing the value to be migrated.
	 * @param string      $new_option  Name of the "to" option.
	 * @param string      $old_key     Name of the key in the "from" option.
	 * @param string|null $new_key     Name of the key in the "to" option.
	 */
	private function move_key_to_other_option( $old_options, $new_option, $old_key, $new_key = null ) {
		if ( $new_key === null ) {
			$new_key = $old_key;
		}

		$new_options = WPSEO_Options::get_option( $new_option );

		if ( isset( $old_options[ $old_key ] ) ) {
			$new_options[ $new_key ] = $old_options[ $old_key ];

			update_option( $new_option, $new_options );
		}
	}

	/**
	 * Runs the needed cleanup after an update, setting the DB version to latest version, flushing caches etc.
	 */
	private function finish_up() {
		WPSEO_Options::set( 'version', WPSEO_VERSION );

		add_action( 'shutdown', 'flush_rewrite_rules' );                     // Just flush rewrites, always, to at least make them work after an upgrade.
		WPSEO_Sitemaps_Cache::clear();                                       // Flush the sitemap cache.

		WPSEO_Options::ensure_options_exist();                               // Make sure all our options always exist - issue #1245.
	}

	/**
	 * Run the Yoast SEO 1.5 upgrade routine
	 *
	 * @param string $version Current plugin version.
	 */
	private function upgrade_15( $version ) {
		// Clean up options and meta.
		WPSEO_Options::clean_up( null, $version );
		WPSEO_Meta::clean_up();
	}

	/**
	 * Moves options that moved position in WPSEO 2.0
	 */
	private function upgrade_20() {
		/**
		 * Clean up stray wpseo_ms options from the options table, option should only exist in the sitemeta table.
		 * This could have been caused in many version of Yoast SEO, so deleting it for everything below 2.0
		 */
		delete_option( 'wpseo_ms' );

		$this->move_key_to_other_option( 'wpseo', 'wpseo_social', 'pinterestverify' );
	}

	/**
	 * Detects if taxonomy terms were split and updates the corresponding taxonomy meta's accordingly.
	 */
	private function upgrade_21() {
		$taxonomies = get_option( 'wpseo_taxonomy_meta', array() );

		if ( ! empty( $taxonomies ) ) {
			foreach ( $taxonomies as $taxonomy => $tax_metas ) {
				foreach ( $tax_metas as $term_id => $tax_meta ) {
					if ( function_exists( 'wp_get_split_term' ) ) {
						$new_term_id = wp_get_split_term( $term_id, $taxonomy );
						if ( $new_term_id !== false ) {
							$taxonomies[ $taxonomy ][ $new_term_id ] = $taxonomies[ $taxonomy ][ $term_id ];
							unset( $taxonomies[ $taxonomy ][ $term_id ] );
						}
					}
				}
			}

			update_option( 'wpseo_taxonomy_meta', $taxonomies );
		}
	}

	/**
	 * Performs upgrade functions to Yoast SEO 2.2
	 */
	private function upgrade_22() {
		// Unschedule our tracking.
		wp_clear_scheduled_hook( 'yoast_tracking' );

		// Clear the tracking settings, the seen about setting and the ignore tour setting.
		$this->remove_key_from_option( 'wpseo', array(
			'tracking_popup_done',
			'yoast_tracking',
			'seen_about',
			'ignore_tour',
		) );
	}

	/**
	 * Schedules upgrade function to Yoast SEO 2.3
	 */
	private function upgrade_23() {
		add_action( 'wp', array( $this, 'upgrade_23_query' ), 90 );
		add_action( 'admin_head', array( $this, 'upgrade_23_query' ), 90 );
	}

	/**
	 * Performs upgrade query to Yoast SEO 2.3
	 */
	public function upgrade_23_query() {
		$wp_query = new WP_Query( 'post_type=any&meta_key=_yoast_wpseo_sitemap-include&meta_value=never&order=ASC' );

		if ( ! empty( $wp_query->posts ) ) {
			$options = get_option( 'wpseo_xml' );

			$excluded_posts = array();
			if ( $options['excluded-posts'] !== '' ) {
				$excluded_posts = explode( ',', $options['excluded-posts'] );
			}

			foreach ( $wp_query->posts as $post ) {
				if ( ! in_array( $post->ID, $excluded_posts ) ) {
					$excluded_posts[] = $post->ID;
				}
			}

			// Updates the meta value.
			$options['excluded-posts'] = implode( ',', $excluded_posts );

			// Update the option.
			update_option( 'wpseo_xml', $options );
		}

		// Remove the meta fields.
		delete_post_meta_by_key( '_yoast_wpseo_sitemap-include' );
	}

	/**
	 * Performs upgrade functions to Yoast SEO 3.0.
	 */
	private function upgrade_30() {
		// Remove the meta fields for sitemap prio.
		delete_post_meta_by_key( '_yoast_wpseo_sitemap-prio' );
	}

	/**
	 * Performs upgrade functions to Yoast SEO 3.3.
	 */
	private function upgrade_33() {
		// Notification dismissals have been moved to User Meta instead of global option.
		delete_option( Yoast_Notification_Center::STORAGE_KEY );
	}

	/**
	 * Performs upgrade functions to Yoast SEO 3.6.
	 */
	private function upgrade_36() {
		global $wpdb;

		// Between 3.2 and 3.4 the sitemap options were saved with autoloading enabled.
		$wpdb->query( 'DELETE FROM ' . $wpdb->options . ' WHERE option_name LIKE "wpseo_sitemap_%" AND autoload = "yes"' );
	}

	/**
	 * Removes the about notice when its still in the database.
	 */
	private function upgrade_40() {
		$center       = Yoast_Notification_Center::get();
		$notification = $center->get_notification_by_id( 'wpseo-dismiss-about' );

		if ( $notification ) {
			$center->remove_notification( $notification );
		}
	}

	/**
	 * Moves the content-analysis-active and keyword-analysis-acive options from wpseo-titles to wpseo.
	 */
	private function upgrade_44() {
		$this->move_key_to_other_option( 'wpseo_titles', 'wpseo', 'content-analysis-active', 'content_analysis_active' );
		$this->move_key_to_other_option( 'wpseo_titles', 'wpseo', 'keyword-analysis-active', 'keyword_analysis_active' );
	}

	/**
	 * Renames the meta name for the cornerstone content. It was a public meta field and it has to be private.
	 */
	private function upgrade_47() {
		global $wpdb;

		// The meta key has to be private, so prefix it.
		$wpdb->query(
			$wpdb->prepare(
				'UPDATE ' . $wpdb->postmeta . ' SET meta_key = %s WHERE meta_key = "yst_is_cornerstone"',
				WPSEO_Cornerstone::META_NAME
			)
		);
	}

	/**
	 * Removes the 'wpseo-dismiss-about' notice for every user that still has it.
	 */
	private function upgrade_49() {
		global $wpdb;

		/*
		 * Using a filter to remove the notification for the current logged in user. The notification center is
		 * initializing the notifications before the upgrade routine has been executedd and is saving the stored
		 * notifications on shutdown. This causes the returning notification. By adding this filter the shutdown
		 * routine on the notification center will remove the notification.
		 */
		add_filter( 'yoast_notifications_before_storage', array( $this, 'remove_about_notice' ) );

		$meta_key = $wpdb->get_blog_prefix() . Yoast_Notification_Center::STORAGE_KEY;

		$usermetas = $wpdb->get_results(
			$wpdb->prepare( '
				SELECT user_id, meta_value
				FROM ' . $wpdb->usermeta . '
				WHERE meta_key = %s AND meta_value LIKE %s
				',
				$meta_key,
				'%wpseo-dismiss-about%'
			),
			ARRAY_A
		);

		if ( empty( $usermetas ) ) {
			return;
		}

		foreach ( $usermetas as $usermeta ) {
			$notifications = maybe_unserialize( $usermeta['meta_value'] );

			foreach ( $notifications as $notification_key => $notification ) {
				if ( ! empty( $notification['options']['id'] ) && $notification['options']['id'] === 'wpseo-dismiss-about' ) {
					unset( $notifications[ $notification_key ] );
				}
			}

			update_user_option( $usermeta['user_id'], Yoast_Notification_Center::STORAGE_KEY, array_values( $notifications ) );
		}
	}

	/**
	 * Removes the wpseo-dismiss-about notice from a list of notifications.
	 *
	 * @param Yoast_Notification[] $notifications The notifications to filter.
	 *
	 * @return Yoast_Notification[] The filtered list of notifications. Excluding the wpseo-dismiss-about notification.
	 */
	public function remove_about_notice( $notifications ) {
		foreach ( $notifications as $notification_key => $notification ) {
			if ( $notification->get_id() === 'wpseo-dismiss-about' ) {
				unset( $notifications[ $notification_key ] );
			}
		}

		return $notifications;
	}

	/**
	 * Adds the yoast_seo_links table to the database.
	 */
	private function upgrade_50() {
		global $wpdb;

		$link_installer = new WPSEO_Link_Installer();
		$link_installer->install();

		// Trigger reindex notification.
		$notifier = new WPSEO_Link_Notifier();
		$notifier->manage_notification();

		// Deletes the post meta value, which might created in the RC.
		$wpdb->query( 'DELETE FROM ' . $wpdb->postmeta . ' WHERE meta_key = "_yst_content_links_processed"' );
	}

	/**
	 * Updates the internal_link_count column to support improved functionality.
	 */
	private function upgrade_50_51() {
		global $wpdb;

		$count_storage = new WPSEO_Meta_Storage();
		$wpdb->query( 'ALTER TABLE ' . $count_storage->get_table_name() . ' MODIFY internal_link_count int(10) UNSIGNED NULL DEFAULT NULL' );
	}

	/**
	 * Register new capabilities and roles.
	 */
	private function upgrade_55() {
		// Register roles.
		do_action( 'wpseo_register_roles' );
		WPSEO_Role_Manager_Factory::get()->add();

		// Register capabilities.
		do_action( 'wpseo_register_capabilities' );
		WPSEO_Capability_Manager_Factory::get()->add();
	}

	/**
	 * Updates legacy license page options to the latest version.
	 */
	private function upgrade_56() {
		global $wpdb;

		// Make sure License Server checks are on the latest server version by default.
		update_option( 'wpseo_license_server_version', WPSEO_License_Page_Manager::VERSION_BACKWARDS_COMPATIBILITY );

		// Make sure incoming link count entries are at least 0, not NULL.
		$count_storage = new WPSEO_Meta_Storage();
		$wpdb->query( 'UPDATE ' . $count_storage->get_table_name() . ' SET incoming_link_count = 0 WHERE incoming_link_count IS NULL' );
	}

	/**
	 * Updates the links for the link count when there is a difference between the site and home url. We've used the
	 * site url instead of the home url.
	 *
	 * @return void
	 */
	private function upgrade_61() {
		// When the home url is the same as the site url, just do nothing.
		if ( home_url() === site_url() ) {
			return;
		}

		global $wpdb;

		$link_storage = new WPSEO_Link_Storage();
		$wpdb->query( 'DELETE FROM ' . $link_storage->get_table_name() );

		$meta_storage = new WPSEO_Meta_Storage();
		$wpdb->query( 'DELETE FROM ' . $meta_storage->get_table_name() );
	}

	/**
	 * Removes some no longer used options for noindexing subpages and for meta keywords and its associated templates.
	 *
	 * @return void
	 */
	private function upgrade_63() {
		$this->remove_key_from_option( 'wpseo_titles', array( 'noindex-subpages-wpseo', 'usemetakeywords' ) );

		// Remove all the meta keyword template options we've stored.
		$option_titles = WPSEO_Options::get_option( 'wpseo_titles' );
		foreach ( array_keys( $option_titles ) as $key ) {
			if ( strpos( $key, 'metakey' ) === 0 ) {
				unset( $option_titles[ $key ] );
			}
		}
		update_option( 'wpseo_titles', $option_titles );
	}

	/**
	 * Perform the 7.0 upgrade, moves settings around, deletes several options.
	 */
	private function upgrade_70() {

		$wpseo_permalinks    = get_option( 'wpseo_permalinks' );
		$wpseo_xml           = get_option( 'wpseo_xml' );
		$wpseo_rss           = get_option( 'wpseo_rss' );
		$wpseo               = get_option( 'wpseo' );
		$wpseo_internallinks = (array) get_option( 'wpseo_internallinks' );

		// Move some permalink settings, then delete the option.
		$this->move_key_to_other_option( $wpseo_permalinks, 'wpseo_titles', 'redirectattachment', 'disable-attachment' );
		$this->move_key_to_other_option( $wpseo_permalinks, 'wpseo_titles', 'stripcategorybase' );


		// Move one XML sitemap setting, then delete the option.
		$this->move_key_to_other_option( $wpseo_xml, 'wpseo', 'enablexmlsitemap', 'enable_xml_sitemap' );


		// Move the RSS settings to the search appearance settings, then delete the RSS option.
		$this->move_key_to_other_option( $wpseo_rss, 'wpseo_titles', 'rssbefore' );
		$this->move_key_to_other_option( $wpseo_rss, 'wpseo_titles', 'rssafter' );

		$this->move_key_to_other_option( $wpseo, 'wpseo_titles', 'company_logo' );
		$this->move_key_to_other_option( $wpseo, 'wpseo_titles', 'company_name' );
		$this->move_key_to_other_option( $wpseo, 'wpseo_titles', 'company_or_person' );
		$this->move_key_to_other_option( $wpseo, 'wpseo_titles', 'person_name' );

		// Remove the website name and altername name as we no longer need them.
		$this->remove_key_from_option( 'wpseo', array( 'website_name', 'alternate_website_name', 'company_logo', 'company_name', 'company_or_person', 'person_name' ) );

		// All the breadcrumbs settings have moved to the search appearance settings.
		foreach ( array_keys( $wpseo_internallinks ) as $key ) {
			$this->move_key_to_other_option( $wpseo_internallinks, 'wpseo_titles', $key );
		}

		// Convert hidden metabox options to display metabox options.
		$title_options = get_option( 'wpseo_titles' );

		foreach ( $title_options as $key => $value ) {
			if ( strpos( $key, 'hideeditbox-tax-' ) === 0 ) {
				$taxonomy = substr( $key, strlen( 'hideeditbox-tax-' ) );
				WPSEO_Options::set( 'display-metabox-tax-' . $taxonomy, ! $value );
				continue;
			}

			if ( strpos( $key, 'hideeditbox-' ) === 0 ) {
				$post_type = substr( $key, strlen( 'hideeditbox-' ) );
				WPSEO_Options::set( 'display-metabox-pt-' . $post_type, ! $value );
				continue;
			}
		}

		// Cleanup removed options.
		delete_option( 'wpseo_xml' );
		delete_option( 'wpseo_permalinks' );
		delete_option( 'wpseo_rss' );
		delete_option( 'wpseo_internallinks' );

		// Remove possibly present plugin conflict notice for plugin that was removed from the list of conflicting plugins.
		$yoast_plugin_conflict = WPSEO_Plugin_Conflict::get_instance();
		$yoast_plugin_conflict->clear_error( 'header-footer/plugin.php' );

		// Moves the user meta for excluding from the XML sitemap to a noindex.
		global $wpdb;
		$wpdb->query( "UPDATE $wpdb->usermeta SET meta_key = 'wpseo_noindex_author' WHERE meta_key = 'wpseo_excludeauthorsitemap'" );
	}
}
