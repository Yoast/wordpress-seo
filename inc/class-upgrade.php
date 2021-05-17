<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internal
 */

use Yoast\WP\Lib\Model;

/**
 * This code handles the option upgrades.
 */
class WPSEO_Upgrade {

	/**
	 * The taxonomy helper.
	 *
	 * @var \Yoast\WP\SEO\Helpers\Taxonomy_Helper
	 */
	private $taxonomy_helper;

	/**
	 * Class constructor.
	 */
	public function __construct() {
		$this->taxonomy_helper = YoastSEO()->helpers->taxonomy;

		$version = WPSEO_Options::get( 'version' );

		WPSEO_Options::maybe_set_multisite_defaults( false );

		$routines = [
			'1.5.0'      => 'upgrade_15',
			'2.0'        => 'upgrade_20',
			'2.1'        => 'upgrade_21',
			'2.2'        => 'upgrade_22',
			'2.3'        => 'upgrade_23',
			'3.0'        => 'upgrade_30',
			'3.3'        => 'upgrade_33',
			'3.6'        => 'upgrade_36',
			'4.0'        => 'upgrade_40',
			'4.4'        => 'upgrade_44',
			'4.7'        => 'upgrade_47',
			'4.9'        => 'upgrade_49',
			'5.0'        => 'upgrade_50',
			'5.5'        => 'upgrade_55',
			'6.3'        => 'upgrade_63',
			'7.0-RC0'    => 'upgrade_70',
			'7.1-RC0'    => 'upgrade_71',
			'7.3-RC0'    => 'upgrade_73',
			'7.4-RC0'    => 'upgrade_74',
			'7.5.3'      => 'upgrade_753',
			'7.7-RC0'    => 'upgrade_77',
			'7.7.2-RC0'  => 'upgrade_772',
			'9.0-RC0'    => 'upgrade_90',
			'10.0-RC0'   => 'upgrade_100',
			'11.1-RC0'   => 'upgrade_111',
			// Reset notifications because we removed the AMP Glue plugin notification.
			'12.1-RC0'   => 'clean_all_notifications',
			'12.3-RC0'   => 'upgrade_123',
			'12.4-RC0'   => 'upgrade_124',
			'12.8-RC0'   => 'upgrade_128',
			'13.2-RC0'   => 'upgrade_132',
			'14.0.3-RC0' => 'upgrade_1403',
			'14.1-RC0'   => 'upgrade_141',
			'14.2-RC0'   => 'upgrade_142',
			'14.5-RC0'   => 'upgrade_145',
			'14.9-RC0'   => 'upgrade_149',
			'15.1-RC0'   => 'upgrade_151',
			'15.3-RC0'   => 'upgrade_153',
			'15.5-RC0'   => 'upgrade_155',
			'15.7-RC0'   => 'upgrade_157',
			'15.9.1-RC0' => 'upgrade_1591',
			'16.2-RC0'   => 'upgrade_162',
		];

		array_walk( $routines, [ $this, 'run_upgrade_routine' ], $version );

		if ( version_compare( $version, '12.5-RC0', '<' ) ) {
			/*
			 * We have to run this by hook, because otherwise:
			 * - the theme support check isn't available.
			 * - the notification center notifications are not filled yet.
			 */
			add_action( 'init', [ $this, 'upgrade_125' ] );
		}

		// Since 3.7.
		$upsell_notice = new WPSEO_Product_Upsell_Notice();
		$upsell_notice->set_upgrade_notice();

		/**
		 * Filter: 'wpseo_run_upgrade' - Runs the upgrade hook which are dependent on Yoast SEO.
		 *
		 * @api string - The current version of Yoast SEO
		 */
		do_action( 'wpseo_run_upgrade', $version );

		$this->finish_up( $version );
	}

	/**
	 * Runs the upgrade routine.
	 *
	 * @param string $routine         The method to call.
	 * @param string $version         The new version.
	 * @param string $current_version The current set version.
	 *
	 * @return void
	 */
	protected function run_upgrade_routine( $routine, $version, $current_version ) {
		if ( version_compare( $current_version, $version, '<' ) ) {
			$this->$routine( $current_version );
		}
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
	 *
	 * @param string|null $previous_version The previous version.
	 *
	 * @return void
	 */
	protected function finish_up( $previous_version = null ) {
		if ( $previous_version ) {
			WPSEO_Options::set( 'previous_version', $previous_version );
		}
		WPSEO_Options::set( 'version', WPSEO_VERSION );

		// Just flush rewrites, always, to at least make them work after an upgrade.
		add_action( 'shutdown', 'flush_rewrite_rules' );

		// Flush the sitemap cache.
		WPSEO_Sitemaps_Cache::clear();

		// Make sure all our options always exist - issue #1245.
		WPSEO_Options::ensure_options_exist();
	}

	/**
	 * Run the Yoast SEO 1.5 upgrade routine.
	 *
	 * @param string $version Current plugin version.
	 */
	private function upgrade_15( $version ) {
		// Clean up options and meta.
		WPSEO_Options::clean_up( null, $version );
		WPSEO_Meta::clean_up();
	}

	/**
	 * Moves options that moved position in WPSEO 2.0.
	 */
	private function upgrade_20() {
		/**
		 * Clean up stray wpseo_ms options from the options table, option should only exist in the sitemeta table.
		 * This could have been caused in many version of Yoast SEO, so deleting it for everything below 2.0.
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
		$taxonomies = get_option( 'wpseo_taxonomy_meta', [] );

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
	 * Performs upgrade functions to Yoast SEO 2.2.
	 */
	private function upgrade_22() {
		// Unschedule our tracking.
		wp_clear_scheduled_hook( 'yoast_tracking' );

		$this->cleanup_option_data( 'wpseo' );
	}

	/**
	 * Schedules upgrade function to Yoast SEO 2.3.
	 */
	private function upgrade_23() {
		add_action( 'wp', [ $this, 'upgrade_23_query' ], 90 );
		add_action( 'admin_head', [ $this, 'upgrade_23_query' ], 90 );
	}

	/**
	 * Performs upgrade query to Yoast SEO 2.3.
	 */
	public function upgrade_23_query() {
		$wp_query = new WP_Query( 'post_type=any&meta_key=_yoast_wpseo_sitemap-include&meta_value=never&order=ASC' );

		if ( ! empty( $wp_query->posts ) ) {
			$options = get_option( 'wpseo_xml' );

			$excluded_posts = [];
			if ( $options['excluded-posts'] !== '' ) {
				$excluded_posts = explode( ',', $options['excluded-posts'] );
			}

			foreach ( $wp_query->posts as $post ) {
				if ( ! in_array( (string) $post->ID, $excluded_posts, true ) ) {
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
		add_filter( 'yoast_notifications_before_storage', [ $this, 'remove_about_notice' ] );

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

		// Deletes the post meta value, which might created in the RC.
		$wpdb->query( 'DELETE FROM ' . $wpdb->postmeta . ' WHERE meta_key = "_yst_content_links_processed"' );
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
		if ( YoastSEO()->helpers->woocommerce->is_active() ) {
			$this->migrate_woocommerce_archive_setting_to_shop_page();
		}
	}

	/**
	 * Performs the 9.0 upgrade.
	 *
	 * @return void
	 */
	private function upgrade_90() {
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
	 * Performs the 11.1 upgrade.
	 *
	 * @return void
	 */
	private function upgrade_111() {
		// Set company_or_person to company when it's an invalid value.
		$company_or_person = WPSEO_Options::get( 'company_or_person', '' );

		if ( ! in_array( $company_or_person, [ 'company', 'person' ], true ) ) {
			WPSEO_Options::set( 'company_or_person', 'company' );
		}
	}

	/**
	 * Performs the 12.3 upgrade.
	 *
	 * Removes the about notice when its still in the database.
	 */
	private function upgrade_123() {
		$plugins = [
			'yoast-seo-premium',
			'video-seo-for-wordpress-seo-by-yoast',
			'yoast-news-seo',
			'local-seo-for-yoast-seo',
			'yoast-woocommerce-seo',
			'yoast-acf-analysis',
		];

		$center = Yoast_Notification_Center::get();
		foreach ( $plugins as $plugin ) {
			$center->remove_notification_by_id( 'wpseo-outdated-yoast-seo-plugin-' . $plugin );
		}
	}

	/**
	 * Performs the 12.4 upgrade.
	 *
	 * Removes the Google plus defaults from the database.
	 */
	private function upgrade_124() {
		$this->cleanup_option_data( 'wpseo_social' );
	}

	/**
	 * Performs the 12.5 upgrade.
	 */
	public function upgrade_125() {
		// Disables the force rewrite title when the theme supports it through WordPress.
		if ( WPSEO_Options::get( 'forcerewritetitle', false ) && current_theme_supports( 'title-tag' ) ) {
			WPSEO_Options::set( 'forcerewritetitle', false );
		}

		global $wpdb;
		$wpdb->query( "DELETE FROM $wpdb->usermeta WHERE meta_key = 'wp_yoast_promo_hide_premium_upsell_admin_block'" );

		// Removes the WordPress update notification, because it is no longer necessary when WordPress 5.3 is released.
		$center = Yoast_Notification_Center::get();
		$center->remove_notification_by_id( 'wpseo-dismiss-wordpress-upgrade' );
	}

	/**
	 * Performs the 12.8 upgrade.
	 */
	private function upgrade_128() {
		// Re-save wpseo to make sure bf_banner_2019_dismissed key is gone.
		$this->cleanup_option_data( 'wpseo' );

		Yoast_Notification_Center::get()->remove_notification_by_id( 'wpseo-dismiss-page_comments-notice' );
		Yoast_Notification_Center::get()->remove_notification_by_id( 'wpseo-dismiss-wordpress-upgrade' );
	}

	/**
	 * Performs the 13.2 upgrade.
	 */
	private function upgrade_132() {
		Yoast_Notification_Center::get()->remove_notification_by_id( 'wpseo-dismiss-tagline-notice' );
		Yoast_Notification_Center::get()->remove_notification_by_id( 'wpseo-dismiss-permalink-notice' );
		Yoast_Notification_Center::get()->remove_notification_by_id( 'wpseo-dismiss-onpageorg' );

		// Transfers the onpage option value to the ryte option.
		$ryte_option   = get_option( 'wpseo_ryte' );
		$onpage_option = get_option( 'wpseo_onpage' );
		if ( ! $ryte_option && $onpage_option ) {
			update_option( 'wpseo_ryte', $onpage_option );
			delete_option( 'wpseo_onpage' );
		}

		// Changes onpage_indexability to ryte_indexability.
		$wpseo_option = get_option( 'wpseo' );
		if ( isset( $wpseo_option['onpage_indexability'] ) && ! isset( $wpseo_option['ryte_indexability'] ) ) {
			$wpseo_option['ryte_indexability'] = $wpseo_option['onpage_indexability'];
			unset( $wpseo_option['onpage_indexability'] );
			update_option( 'wpseo', $wpseo_option );
		}

		if ( wp_next_scheduled( 'wpseo_ryte_fetch' ) ) {
			wp_clear_scheduled_hook( 'wpseo_ryte_fetch' );
		}

		/*
		 * Re-register capabilities to add the new `view_site_health_checks`
		 * capability to the SEO Manager role.
		 */
		do_action( 'wpseo_register_capabilities' );
		WPSEO_Capability_Manager_Factory::get()->add();
	}

	/**
	 * Perform the 14.0.3 upgrade.
	 */
	private function upgrade_1403() {
		WPSEO_Options::set( 'ignore_indexation_warning', false );
	}

	/**
	 * Performs the 14.1 upgrade.
	 */
	private function upgrade_141() {
		/*
		 * These notifications are retrieved from storage on the `init` hook with
		 * priority 1. We need to remove them after they're retrieved.
		 */
		add_action( 'init', [ $this, 'remove_notifications_for_141' ] );
		add_action( 'init', [ $this, 'clean_up_private_taxonomies_for_141' ] );

		$this->reset_permalinks_of_attachments_for_141();
	}

	/**
	 * Performs the 14.2 upgrade.
	 *
	 * Removes the yoast-acf-analysis notice when it's still in the database.
	 */
	private function upgrade_142() {
		add_action( 'init', [ $this, 'remove_acf_notification_for_142' ] );
	}

	/**
	 * Performs the 14.5 upgrade.
	 */
	private function upgrade_145() {
		add_action( 'init', [ $this, 'set_indexation_completed_option_for_145' ] );
	}

	/**
	 * Performs the 14.9 upgrade.
	 */
	private function upgrade_149() {
		$version = get_option( 'wpseo_license_server_version', 2 );
		WPSEO_Options::set( 'license_server_version', $version );
		delete_option( 'wpseo_license_server_version' );
	}

	/**
	 * Performs the 15.1 upgrade.
	 *
	 * @return void
	 */
	private function upgrade_151() {
		$this->set_home_url_for_151();
		$this->move_indexables_indexation_reason_for_151();

		add_action( 'init', [ $this, 'set_permalink_structure_option_for_151' ] );
		add_action( 'init', [ $this, 'store_custom_taxonomy_slugs_for_151' ] );
	}

	/**
	 * Performs the 15.3 upgrade.
	 *
	 * @return void
	 */
	private function upgrade_153() {
		WPSEO_Options::set( 'category_base_url', get_option( 'category_base' ) );
		WPSEO_Options::set( 'tag_base_url', get_option( 'tag_base' ) );

		// Rename a couple of options.
		$indexation_started_value = WPSEO_Options::get( 'indexation_started' );
		WPSEO_Options::set( 'indexing_started', $indexation_started_value );

		$indexables_indexing_completed_value = WPSEO_Options::get( 'indexables_indexation_completed' );
		WPSEO_Options::set( 'indexables_indexing_completed', $indexables_indexing_completed_value );
	}

	/**
	 * Performs the 15.5 upgrade.
	 *
	 * @return void
	 */
	private function upgrade_155() {
		// Unset the fbadminapp value in the wpseo_social option.
		$wpseo_social_option = get_option( 'wpseo_social' );

		if ( isset( $wpseo_social_option['fbadminapp'] ) ) {
			unset( $wpseo_social_option['fbadminapp'] );
			update_option( 'wpseo_social', $wpseo_social_option );
		}
	}

	/**
	 * Performs the 15.7 upgrade.
	 *
	 * @return void
	 */
	private function upgrade_157() {
		add_action( 'init', [ $this, 'remove_plugin_updated_notification_for_157' ] );
	}

	/**
	 * Performs the 15.9.1 upgrade routine.
	 */
	private function upgrade_1591() {
		$enabled_auto_updates = \get_option( 'auto_update_plugins' );
		$addon_update_watcher = YoastSEO()->classes->get( \Yoast\WP\SEO\Integrations\Watchers\Addon_Update_Watcher::class );
		$addon_update_watcher->toggle_auto_updates_for_add_ons( 'auto_update_plugins', [], $enabled_auto_updates );
	}

	/**
	 * Performs the 16.2 upgrade routine.
	 */
	private function upgrade_162() {
		$enabled_auto_updates = \get_site_option( 'auto_update_plugins' );
		$addon_update_watcher = YoastSEO()->classes->get( \Yoast\WP\SEO\Integrations\Watchers\Addon_Update_Watcher::class );
		$addon_update_watcher->toggle_auto_updates_for_add_ons( 'auto_update_plugins', $enabled_auto_updates, [] );
	}

	/**
	 * Sets the home_url option for the 15.1 upgrade routine.
	 *
	 * @return void
	 */
	protected function set_home_url_for_151() {
		$home_url = WPSEO_Options::get( 'home_url' );

		if ( empty( $home_url ) ) {
			WPSEO_Options::set( 'home_url', get_home_url() );
		}
	}

	/**
	 * Moves the `indexables_indexation_reason` option to the
	 * renamed `indexing_reason` option.
	 *
	 * @return void
	 */
	protected function move_indexables_indexation_reason_for_151() {
		$reason = WPSEO_Options::get( 'indexables_indexation_reason', '' );
		WPSEO_Options::set( 'indexing_reason', $reason );
	}

	/**
	 * Checks if the indexable indexation is completed.
	 * If so, sets the `indexables_indexation_completed` option to `true`,
	 * else to `false`.
	 */
	public function set_indexation_completed_option_for_145() {
		WPSEO_Options::set( 'indexables_indexation_completed', YoastSEO()->helpers->indexing->get_unindexed_count() === 0 );
	}

	/**
	 * Cleans up the private taxonomies from the indexables table for the upgrade routine to 14.1.
	 */
	public function clean_up_private_taxonomies_for_141() {
		global $wpdb;

		// If migrations haven't been completed successfully the following may give false errors. So suppress them.
		$show_errors       = $wpdb->show_errors;
		$wpdb->show_errors = false;

		// Clean up indexables of private taxonomies.
		$private_taxonomies = \get_taxonomies( [ 'public' => false ], 'names' );

		if ( empty( $private_taxonomies ) ) {
			return;
		}

		$indexable_table = Model::get_table_name( 'Indexable' );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Reason: Is it prepared already.
		$query = $wpdb->prepare(
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: Too hard to fix.
			"DELETE FROM $indexable_table
			WHERE object_type = 'term'
			AND object_sub_type IN ("
				. \implode( ', ', \array_fill( 0, \count( $private_taxonomies ), '%s' ) )
				. ')',
			$private_taxonomies
		);
		$wpdb->query( $query ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Reason: Is it prepared already.

		$wpdb->show_errors = $show_errors;
	}

	/**
	 * Resets the permalinks of attachments to `null` in the indexable table for the upgrade routine to 14.1.
	 */
	private function reset_permalinks_of_attachments_for_141() {
		global $wpdb;

		// If migrations haven't been completed succesfully the following may give false errors. So suppress them.
		$show_errors       = $wpdb->show_errors;
		$wpdb->show_errors = false;

		// Reset the permalinks of the attachments in the indexable table.
		$indexable_table = Model::get_table_name( 'Indexable' );
		$query           = "UPDATE $indexable_table SET permalink = NULL WHERE object_type = 'post' AND object_sub_type = 'attachment'";
		$wpdb->query( $query ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Reason: There is no user input.

		$wpdb->show_errors = $show_errors;
	}

	/**
	 * Removes notifications from the Notification center for the 14.1 upgrade.
	 *
	 * @return void
	 */
	public function remove_notifications_for_141() {
		Yoast_Notification_Center::get()->remove_notification_by_id( 'wpseo-dismiss-recalculate' );
		Yoast_Notification_Center::get()->remove_notification_by_id( 'wpseo-dismiss-blog-public-notice' );
		Yoast_Notification_Center::get()->remove_notification_by_id( 'wpseo-links-table-not-accessible' );
		Yoast_Notification_Center::get()->remove_notification_by_id( 'wpseo-post-type-archive-notification' );
	}

	/**
	 * Removes the wpseo-suggested-plugin-yoast-acf-analysis notification from the Notification center for the 14.2 upgrade.
	 *
	 * @return void
	 */
	public function remove_acf_notification_for_142() {
		Yoast_Notification_Center::get()->remove_notification_by_id( 'wpseo-suggested-plugin-yoast-acf-analysis' );
	}

	/**
	 * Removes the wpseo-plugin-updated notification from the Notification center for the 15.7 upgrade.
	 *
	 * @return void
	 */
	public function remove_plugin_updated_notification_for_157() {
		Yoast_Notification_Center::get()->remove_notification_by_id( 'wpseo-plugin-updated' );
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
		$deleted = $wpdb->delete( $wpdb->postmeta, [ 'meta_key' => $meta_key ], [ '%s' ] );

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
		$results = $wpdb->get_results( $sql, ARRAY_A ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Reason: Is is already prepared.
		if ( ! empty( $results ) ) {
			return maybe_unserialize( $results[0]['option_value'] );
		}

		return [];
	}

	/**
	 * Cleans the option to make sure only relevant settings are there.
	 *
	 * @param string $option_name Option name save.
	 *
	 * @return void
	 */
	protected function cleanup_option_data( $option_name ) {
		$data = get_option( $option_name, [] );
		if ( ! is_array( $data ) || $data === [] ) {
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

	/**
	 * Stores the initial `permalink_structure` option.
	 *
	 * @return void
	 */
	public function set_permalink_structure_option_for_151() {
		WPSEO_Options::set( 'permalink_structure', get_option( 'permalink_structure' ) );
	}

	/**
	 * Stores the initial slugs of custom taxonomies.
	 *
	 * @return void
	 */
	public function store_custom_taxonomy_slugs_for_151() {
		$taxonomies = $this->taxonomy_helper->get_custom_taxonomies();

		$custom_taxonomies = [];

		foreach ( $taxonomies as $taxonomy ) {
			$slug = $this->taxonomy_helper->get_taxonomy_slug( $taxonomy );

			$custom_taxonomies[ $taxonomy ] = $slug;
		}

		WPSEO_Options::set( 'custom_taxonomy_slugs', $custom_taxonomies );
	}
}
