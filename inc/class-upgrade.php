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
	 * Holds the Yoast SEO options
	 *
	 * @var array
	 */
	private $options = array();

	/**
	 * Class constructor
	 */
	public function __construct() {
		$this->options = WPSEO_Options::get_option( 'wpseo' );

		WPSEO_Options::maybe_set_multisite_defaults( false );

		if ( version_compare( $this->options['version'], '1.5.0', '<' ) ) {
			$this->upgrade_15( $this->options['version'] );
		}

		if ( version_compare( $this->options['version'], '2.0', '<' ) ) {
			$this->upgrade_20();
		}

		if ( version_compare( $this->options['version'], '2.1', '<' ) ) {
			$this->upgrade_21();
		}

		if ( version_compare( $this->options['version'], '2.2', '<' ) ) {
			$this->upgrade_22();
		}

		if ( version_compare( $this->options['version'], '2.3', '<' ) ) {
			$this->upgrade_23();
		}

		if ( version_compare( $this->options['version'], '3.0', '<' ) ) {
			$this->upgrade_30();
		}

		if ( version_compare( $this->options['version'], '3.3', '<' ) ) {
			$this->upgrade_33();
		}

		if ( version_compare( $this->options['version'], '3.6', '<' ) ) {
			$this->upgrade_36();
		}

		if ( version_compare( $this->options['version'], '4.0', '<' ) ) {
			$this->upgrade_40();
		}

		if ( version_compare( $this->options['version'], '4.4', '<' ) ) {
			$this->upgrade_44();
		}

		if ( version_compare( $this->options['version'], '4.7', '<' ) ) {
			$this->upgrade_47();
		}

		if ( version_compare( $this->options['version'], '4.9', '<' ) ) {
			$this->upgrade_49();
		}

		if ( version_compare( $this->options['version'], '5.0', '<' ) ) {
			$this->upgrade_50();
		}

		if ( version_compare( $this->options['version'], '5.0', '>=' )
			 && version_compare( $this->options['version'], '5.1', '<' ) ) {
			$this->upgrade_50_51();
		}

		if ( version_compare( $this->options['version'], '5.5', '<' ) ) {
			$this->upgrade_55();
		}

		// Since 3.7.
		$upsell_notice = new WPSEO_Product_Upsell_Notice();
		$upsell_notice->set_upgrade_notice();

		/**
		 * Filter: 'wpseo_run_upgrade' - Runs the upgrade hook which are dependent on Yoast SEO
		 *
		 * @api        string - The current version of Yoast SEO
		 */
		do_action( 'wpseo_run_upgrade', $this->options['version'] );

		$this->finish_up();
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

		$this->move_pinterest_option();
	}

	/**
	 * Detects if taxonomy terms were split and updates the corresponding taxonomy meta's accordingly.
	 */
	private function upgrade_21() {
		$taxonomies = get_option( 'wpseo_taxonomy_meta', array() );

		if ( ! empty( $taxonomies ) ) {
			foreach ( $taxonomies as $taxonomy => $tax_metas ) {
				foreach ( $tax_metas as $term_id => $tax_meta ) {
					if ( function_exists( 'wp_get_split_term' ) && $new_term_id = wp_get_split_term( $term_id, $taxonomy ) ) {
						$taxonomies[ $taxonomy ][ $new_term_id ] = $taxonomies[ $taxonomy ][ $term_id ];
						unset( $taxonomies[ $taxonomy ][ $term_id ] );
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
		$options = get_option( 'wpseo' );
		unset( $options['tracking_popup_done'], $options['yoast_tracking'], $options['seen_about'], $options['ignore_tour'] );
		update_option( 'wpseo', $options );
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
	 * Performs upgrade functions to Yoast SEO 3.0
	 */
	private function upgrade_30() {
		// Remove the meta fields for sitemap prio.
		delete_post_meta_by_key( '_yoast_wpseo_sitemap-prio' );
	}

	/**
	 * Performs upgrade functions to Yoast SEO 3.3
	 */
	private function upgrade_33() {
		// Notification dismissals have been moved to User Meta instead of global option.
		delete_option( Yoast_Notification_Center::STORAGE_KEY );
	}

	/**
	 * Performs upgrade functions to Yoast SEO 3.6
	 */
	private function upgrade_36() {
		global $wpdb;

		// Between 3.2 and 3.4 the sitemap options were saved with autoloading enabled.
		$wpdb->query( 'DELETE FROM ' . $wpdb->options . ' WHERE option_name LIKE "wpseo_sitemap_%" AND autoload = "yes"' );
	}

	/**
	 * Move the pinterest verification option from the wpseo option to the wpseo_social option
	 */
	private function move_pinterest_option() {
		$options_social = get_option( 'wpseo_social' );

		if ( isset( $option_wpseo['pinterestverify'] ) ) {
			$options_social['pinterestverify'] = $option_wpseo['pinterestverify'];
			unset( $option_wpseo['pinterestverify'] );
			update_option( 'wpseo_social', $options_social );
			update_option( 'wpseo', $option_wpseo );
		}
	}

	/**
	 * Runs the needed cleanup after an update, setting the DB version to latest version, flushing caches etc.
	 */
	private function finish_up() {
		$this->options = WPSEO_Options::get_option( 'wpseo' );              // Re-get to make sure we have the latest version.
		update_option( 'wpseo', $this->options );                           // This also ensures the DB version is equal to WPSEO_VERSION.

		add_action( 'shutdown', 'flush_rewrite_rules' );                    // Just flush rewrites, always, to at least make them work after an upgrade.
		WPSEO_Sitemaps_Cache::clear();                                 // Flush the sitemap cache.

		WPSEO_Options::ensure_options_exist();                              // Make sure all our options always exist - issue #1245.
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
		$option_titles = WPSEO_Options::get_option( 'wpseo_titles' );
		$option_wpseo = WPSEO_Options::get_option( 'wpseo' );

		if ( isset( $option_titles['content-analysis-active'] ) && isset( $option_titles['keyword-analysis-active'] ) ) {
			$option_wpseo['content_analysis_active'] = $option_titles['content-analysis-active'];
			unset( $option_titles['content-analysis-active'] );

			$option_wpseo['keyword_analysis_active'] = $option_titles['keyword-analysis-active'];
			unset( $option_titles['keyword-analysis-active'] );

			update_option( 'wpseo_titles', $option_titles );
			update_option( 'wpseo', $option_wpseo );
		}
	}

	/**
	 * Renames the meta name for the cornerstone content. It was a public meta field and it has to be private.
	 */
	private function upgrade_47() {
		global $wpdb;

		// The meta key has to be private, so prefix it.
		$wpdb->query(
			$wpdb->prepare(
				'UPDATE ' . $wpdb->postmeta . ' SET meta_key = "%s" WHERE meta_key = "yst_is_cornerstone"',
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
			$wpdb->prepare('
				SELECT user_id, meta_value
				FROM ' . $wpdb->usermeta . '
				WHERE meta_key = %s AND meta_value LIKE "%%wpseo-dismiss-about%%"
				', $meta_key ),
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
	 * Register new capabilities and roles
	 */
	private function upgrade_55() {
		// Register roles.
		do_action( 'wpseo_register_roles' );
		WPSEO_Role_Manager_Factory::get()->add();

		// Register capabilities.
		do_action( 'wpseo_register_capabilities' );
		WPSEO_Capability_Manager_Factory::get()->add();
	}
}
