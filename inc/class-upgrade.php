<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internal
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

		if ( version_compare( $version, '7.1-RC0', '<' ) ) {
			$this->upgrade_71();
		}

		if ( version_compare( $version, '7.3-RC0', '<' ) ) {
			$this->upgrade_73();
		}

		if ( version_compare( $version, '7.4-RC0', '<' ) ) {
			$this->upgrade_74();
		}

		if ( version_compare( $version, '7.5.3', '<' ) ) {
			$this->upgrade_753();
		}

		if ( version_compare( $version, '7.7-RC0', '<' ) ) {
			$this->upgrade_77();
		}

		if ( version_compare( $version, '7.7.2-RC0', '<' ) ) {
			$this->upgrade_772();
		}

		if ( version_compare( $version, '9.0-RC0', '<' ) ) {
			$this->upgrade90();
		}

		if ( version_compare( $version, '10.0-RC0', '<' ) ) {
			$this->upgrade_100();
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
	 * Adds a new upgrade history entry.
	 *
	 * @param string $current_version The old version from which we are upgrading.
	 * @param string $new_version     The version we are upgrading to.
	 */
	protected function add_upgrade_history( $current_version, $new_version ) {
		$upgrade_history = new WPSEO_Upgrade_History();
		$upgrade_history->add( $current_version, $new_version, array_keys( WPSEO_Options::$options ) );
	}

	/**
	 * Runs the needed cleanup after an update, setting the DB version to latest version, flushing caches etc.
	 */
	protected function finish_up() {
		WPSEO_Options::set( 'version', WPSEO_VERSION );

		// Just flush rewrites, always, to at least make them work after an upgrade.
		add_action( 'shutdown', 'flush_rewrite_rules' );

		// Flush the sitemap cache.
		WPSEO_Sitemaps_Cache::clear();

		// Make sure all our options always exist - issue #1245.
		WPSEO_Options::ensure_options_exist();
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

		$wpseo = $this->get_option_from_database( 'wpseo' );
		$this->save_option_setting( $wpseo, 'pinterestverify' );

		// Re-save option to trigger sanitization.
		$this->cleanup_option_data( 'wpseo' );
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

		$this->cleanup_option_data( 'wpseo' );
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
		$center = Yoast_Notification_Center::get();
		$center->remove_notification_by_id( 'wpseo-dismiss-about' );
	}

	/**
	 * Moves the content-analysis-active and keyword-analysis-acive options from wpseo-titles to wpseo.
	 */
	private function upgrade_44() {
		$wpseo_titles = $this->get_option_from_database( 'wpseo_titles' );

		$this->save_option_setting( $wpseo_titles, 'content-analysis-active', 'content_analysis_active' );
		$this->save_option_setting( $wpseo_titles, 'keyword-analysis-active', 'keyword_analysis_active' );

		// Remove irrelevant content from the option.
		$this->cleanup_option_data( 'wpseo_titles' );
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
				WPSEO_Cornerstone_Filter::META_NAME
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
			$wpdb->prepare(
				'
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
		$this->cleanup_option_data( 'wpseo_titles' );
	}

	/**
	 * Perform the 7.0 upgrade, moves settings around, deletes several options.
	 *
	 * @return void
	 */
	private function upgrade_70() {

		$wpseo_permalinks    = $this->get_option_from_database( 'wpseo_permalinks' );
		$wpseo_xml           = $this->get_option_from_database( 'wpseo_xml' );
		$wpseo_rss           = $this->get_option_from_database( 'wpseo_rss' );
		$wpseo               = $this->get_option_from_database( 'wpseo' );
		$wpseo_internallinks = $this->get_option_from_database( 'wpseo_internallinks' );

		// Move some permalink settings, then delete the option.
		$this->save_option_setting( $wpseo_permalinks, 'redirectattachment', 'disable-attachment' );
		$this->save_option_setting( $wpseo_permalinks, 'stripcategorybase' );

		// Move one XML sitemap setting, then delete the option.
		$this->save_option_setting( $wpseo_xml, 'enablexmlsitemap', 'enable_xml_sitemap' );


		// Move the RSS settings to the search appearance settings, then delete the RSS option.
		$this->save_option_setting( $wpseo_rss, 'rssbefore' );
		$this->save_option_setting( $wpseo_rss, 'rssafter' );

		$this->save_option_setting( $wpseo, 'company_logo' );
		$this->save_option_setting( $wpseo, 'company_name' );
		$this->save_option_setting( $wpseo, 'company_or_person' );
		$this->save_option_setting( $wpseo, 'person_name' );

		// Remove the website name and altername name as we no longer need them.
		$this->cleanup_option_data( 'wpseo' );

		// All the breadcrumbs settings have moved to the search appearance settings.
		foreach ( array_keys( $wpseo_internallinks ) as $key ) {
			$this->save_option_setting( $wpseo_internallinks, $key );
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

	/**
	 * Perform the 7.1 upgrade.
	 *
	 * @return void
	 */
	private function upgrade_71() {
		$this->cleanup_option_data( 'wpseo_social' );

		// Move the breadcrumbs setting and invert it.
		$title_options = $this->get_option_from_database( 'wpseo_titles' );

		if ( array_key_exists( 'breadcrumbs-blog-remove', $title_options ) ) {
			WPSEO_Options::set( 'breadcrumbs-display-blog-page', ! $title_options['breadcrumbs-blog-remove'] );

			$this->cleanup_option_data( 'wpseo_titles' );
		}
	}

	/**
	 * Perform the 7.3 upgrade.
	 *
	 * @return void
	 */
	private function upgrade_73() {
		global $wpdb;
		// We've moved the cornerstone checkbox to our proper namespace.
		$wpdb->query( "UPDATE $wpdb->postmeta SET meta_key = '_yoast_wpseo_is_cornerstone' WHERE meta_key = '_yst_is_cornerstone'" );

		// Remove the previous Whip dismissed message, as this is a new one regarding PHP 5.2.
		delete_option( 'whip_dismiss_timestamp' );
	}

	/**
	 * Performs the 7.4 upgrade.
	 *
	 * @return void
	 */
	private function upgrade_74() {
		$this->remove_sitemap_validators();
	}

	/**
	 * Performs the 7.5.3 upgrade.
	 *
	 * When upgrading purging media is potentially relevant.
	 *
	 * @return void
	 */
	private function upgrade_753() {
		// Only when attachments are not disabled.
		if ( WPSEO_Options::get( 'disable-attachment' ) === true ) {
			return;
		}

		// Only when attachments are not no-indexed.
		if ( WPSEO_Options::get( 'noindex-attachment' ) === true ) {
			return;
		}

		// Set purging relevancy.
		WPSEO_Options::set( 'is-media-purge-relevant', true );
	}

	/**
	 * Performs the 7.7 upgrade.
	 *
	 * @return void
	 */
	private function upgrade_77() {
		// Remove all OpenGraph content image cache.
		$this->delete_post_meta( '_yoast_wpseo_post_image_cache' );
	}

	/**
	 * Performs the 7.7.2 upgrade.
	 *
	 * @return void
	 */
	private function upgrade_772() {
		if ( WPSEO_Utils::is_woocommerce_active() ) {
			$this->migrate_woocommerce_archive_setting_to_shop_page();
		}
	}

	/**
	 * Performs the 9.0 upgrade.
	 *
	 * @return void
	 */
	private function upgrade90() {
		global $wpdb;

		// Invalidate all sitemap cache transients.
		WPSEO_Sitemaps_Cache_Validator::cleanup_database();

		// Removes all scheduled tasks for hitting the sitemap index.
		wp_clear_scheduled_hook( 'wpseo_hit_sitemap_index' );

		$wpdb->query( 'DELETE FROM ' . $wpdb->options . ' WHERE option_name LIKE "wpseo_sitemap_%"' );
	}

	/**
	 * Performs the 10.0 upgrade.
	 *
	 * @return void
	 */
	private function upgrade_100() {
		// Removes recalibration notifications.
		$this->clean_all_notifications();

		// Removes recalibration options.
		WPSEO_Options::clean_up( 'wpseo' );
		delete_option( 'wpseo_recalibration_beta_mailinglist_subscription' );
	}

	/**
	 * Removes all notifications saved in the database under 'wp_yoast_notifications'.
	 *
	 * @return void
	 */
	private function clean_all_notifications() {
		global $wpdb;
		delete_metadata( 'user', 0, $wpdb->get_blog_prefix() . Yoast_Notification_Center::STORAGE_KEY, '', true );
	}

	/**
	 * Removes the post meta fields for a given meta key.
	 *
	 * @param string $meta_key The meta key.
	 *
	 * @return void
	 */
	private function delete_post_meta( $meta_key ) {
		global $wpdb;
		$deleted = $wpdb->delete( $wpdb->postmeta, array( 'meta_key' => $meta_key ), array( '%s' ) );

		if ( $deleted ) {
			wp_cache_set( 'last_changed', microtime(), 'posts' );
		}
	}

	/**
	 * Removes all sitemap validators.
	 *
	 * This should be executed on every upgrade routine until we have removed the sitemap caching in the database.
	 *
	 * @return void
	 */
	private function remove_sitemap_validators() {
		global $wpdb;

		// Remove all sitemap validators.
		$wpdb->query( "DELETE FROM $wpdb->options WHERE option_name LIKE 'wpseo_sitemap%validator%'" );
	}

	/**
	 * Retrieves the option value directly from the database.
	 *
	 * @param string $option_name Option to retrieve.
	 *
	 * @return array|mixed The content of the option if exists, otherwise an empty array.
	 */
	protected function get_option_from_database( $option_name ) {
		global $wpdb;

		// Load option directly from the database, to avoid filtering and sanitization.
		$sql     = $wpdb->prepare( 'SELECT option_value FROM ' . $wpdb->options . ' WHERE option_name = %s', $option_name );
		$results = $wpdb->get_results( $sql, ARRAY_A );
		if ( ! empty( $results ) ) {
			return maybe_unserialize( $results[0]['option_value'] );
		}

		return array();
	}

	/**
	 * Cleans the option to make sure only relevant settings are there.
	 *
	 * @param string $option_name Option name save.
	 *
	 * @return void
	 */
	protected function cleanup_option_data( $option_name ) {
		$data = get_option( $option_name, array() );
		if ( ! is_array( $data ) || $data === array() ) {
			return;
		}

		/*
		 * Clean up the option by re-saving it.
		 *
		 * The option framework will remove any settings that are not configured
		 * for this option, removing any migrated settings.
		 */
		update_option( $option_name, $data );
	}

	/**
	 * Saves an option setting to where it should be stored.
	 *
	 * @param array       $source_data    The option containing the value to be migrated.
	 * @param string      $source_setting Name of the key in the "from" option.
	 * @param string|null $target_setting Name of the key in the "to" option.
	 *
	 * @return void
	 */
	protected function save_option_setting( $source_data, $source_setting, $target_setting = null ) {
		if ( $target_setting === null ) {
			$target_setting = $source_setting;
		}

		if ( isset( $source_data[ $source_setting ] ) ) {
			WPSEO_Options::set( $target_setting, $source_data[ $source_setting ] );
		}
	}

	/**
	 * Migrates WooCommerce archive settings to the WooCommerce Shop page meta-data settings.
	 *
	 * If no Shop page is defined, nothing will be migrated.
	 *
	 * @return void
	 */
	private function migrate_woocommerce_archive_setting_to_shop_page() {
		$shop_page_id = wc_get_page_id( 'shop' );

		if ( $shop_page_id === -1 ) {
			return;
		}

		$title = WPSEO_Meta::get_value( 'title', $shop_page_id );

		if ( empty( $title ) ) {
			$option_title = WPSEO_Options::get( 'title-ptarchive-product' );

			WPSEO_Meta::set_value(
				'title',
				$option_title,
				$shop_page_id
			);

			WPSEO_Options::set( 'title-ptarchive-product', '' );
		}

		$meta_description = WPSEO_Meta::get_value( 'metadesc', $shop_page_id );

		if ( empty( $meta_description ) ) {
			$option_metadesc = WPSEO_Options::get( 'metadesc-ptarchive-product' );

			WPSEO_Meta::set_value(
				'metadesc',
				$option_metadesc,
				$shop_page_id
			);

			WPSEO_Options::set( 'metadesc-ptarchive-product', '' );
		}

		$bc_title = WPSEO_Meta::get_value( 'bctitle', $shop_page_id );

		if ( empty( $bc_title ) ) {
			$option_bctitle = WPSEO_Options::get( 'bctitle-ptarchive-product' );

			WPSEO_Meta::set_value(
				'bctitle',
				$option_bctitle,
				$shop_page_id
			);

			WPSEO_Options::set( 'bctitle-ptarchive-product', '' );
		}

		$noindex = WPSEO_Meta::get_value( 'meta-robots-noindex', $shop_page_id );

		if ( $noindex === '0' ) {
			$option_noindex = WPSEO_Options::get( 'noindex-ptarchive-product' );

			WPSEO_Meta::set_value(
				'meta-robots-noindex',
				$option_noindex,
				$shop_page_id
			);

			WPSEO_Options::set( 'noindex-ptarchive-product', false );
		}
	}
}
