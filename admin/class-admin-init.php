<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Performs the load on admin side.
 */
class WPSEO_Admin_Init {

	/**
	 * Holds the global `$pagenow` variable's value.
	 *
	 * @var string
	 */
	private $pagenow;

	/**
	 * Holds the asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Class constructor.
	 */
	public function __construct() {
		$GLOBALS['wpseo_admin'] = new WPSEO_Admin();

		$this->pagenow = $GLOBALS['pagenow'];

		$this->asset_manager = new WPSEO_Admin_Asset_Manager();

		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_dismissible' ] );
		add_action( 'admin_init', [ $this, 'yoast_plugin_suggestions_notification' ], 15 );
		add_action( 'admin_init', [ $this, 'yoast_plugin_update_notification' ] );
		add_action( 'admin_init', [ $this, 'unsupported_php_notice' ], 15 );
		add_action( 'admin_init', [ $this->asset_manager, 'register_assets' ] );
		add_action( 'admin_init', [ $this, 'show_hook_deprecation_warnings' ] );
		add_action( 'admin_init', [ 'WPSEO_Plugin_Conflict', 'hook_check_for_plugin_conflicts' ] );
		add_action( 'admin_notices', [ $this, 'permalink_settings_notice' ] );

		/*
		 * The `admin_notices` hook fires on single site admin pages vs.
		 * `network_admin_notices` which fires on multisite admin pages and
		 * `user_admin_notices` which fires on multisite user admin pagss.
		 */
		add_action( 'admin_notices', [ $this, 'search_engines_discouraged_notice' ] );

		$health_checks = [
			new WPSEO_Health_Check_Page_Comments(),
			new WPSEO_Health_Check_Ryte(),
			new WPSEO_Health_Check_Default_Tagline(),
			new WPSEO_Health_Check_Postname_Permalink(),
			new WPSEO_Health_Check_Curl_Version(),
			new WPSEO_Health_Check_Link_Table_Not_Accessible(),
		];

		foreach ( $health_checks as $health_check ) {
			$health_check->register_test();
		}

		$this->load_meta_boxes();
		$this->load_taxonomy_class();
		$this->load_admin_page_class();
		$this->load_admin_user_class();
		$this->load_xml_sitemaps_admin();
		$this->load_plugin_suggestions();
	}

	/**
	 * Enqueue our styling for dismissible yoast notifications.
	 */
	public function enqueue_dismissible() {
		$this->asset_manager->enqueue_style( 'dismissible' );
	}

	/**
	 * Determines whether a suggested plugins notification needs to be displayed.
	 *
	 * @return void
	 */
	public function yoast_plugin_suggestions_notification() {
		$checker             = new WPSEO_Plugin_Availability();
		$notification_center = Yoast_Notification_Center::get();

		// Get all Yoast plugins that have dependencies.
		$plugins = $checker->get_plugins_with_dependencies();

		foreach ( $plugins as $plugin_name => $plugin ) {
			$dependency_names = $checker->get_dependency_names( $plugin );
			$notification     = $this->get_yoast_seo_suggested_plugins_notification( $plugin_name, $plugin, $dependency_names[0] );

			if ( $checker->dependencies_are_satisfied( $plugin ) && ! $checker->is_installed( $plugin ) ) {
				$notification_center->add_notification( $notification );

				continue;
			}

			$notification_center->remove_notification( $notification );
		}
	}

	/**
	 * Build Yoast SEO suggested plugins notification.
	 *
	 * @param string $name            The plugin name to use for the unique ID.
	 * @param array  $plugin          The plugin to retrieve the data from.
	 * @param string $dependency_name The name of the dependency.
	 *
	 * @return Yoast_Notification The notification containing the suggested plugin.
	 */
	private function get_yoast_seo_suggested_plugins_notification( $name, $plugin, $dependency_name ) {
		$info_message = sprintf(
			/* translators: %1$s expands to Yoast SEO, %2$s expands to the plugin version, %3$s expands to the plugin name */
			__( '%1$s and %2$s can work together a lot better by adding a helper plugin. Please install %3$s to make your life better.', 'wordpress-seo' ),
			'Yoast SEO',
			$dependency_name,
			sprintf( '<a href="%s">%s</a>', $plugin['url'], $plugin['title'] )
		);

		return new Yoast_Notification(
			$info_message,
			[
				'id'   => 'wpseo-suggested-plugin-' . $name,
				'type' => Yoast_Notification::WARNING,
			]
		);
	}

	/**
	 * Determines whether a update notification needs to be displayed.
	 *
	 * @return void
	 */
	public function yoast_plugin_update_notification() {
		$notification_center   = Yoast_Notification_Center::get();
		$current_minor_version = $this->get_major_minor_version( WPSEO_Options::get( 'version', WPSEO_VERSION ) );
		$file = plugin_dir_path( WPSEO_FILE ) . 'release-info.json';

		// Remove if file is not present.
		if ( ! file_exists( $file ) ) {
			$notification_center->remove_notification_by_id( 'wpseo-plugin-updated' );
			return;
		}

		$release_json = file_get_contents( $file );
		/**
		 * Filter: 'wpseo_update_notice_content' - Allow filtering of the content
		 * of the update notice read from the release-info.json file.
		 *
		 * @api object The object from the release-info.json file.
		 */
		$release_info = apply_filters( 'wpseo_update_notice_content', json_decode( $release_json ) );

		// Remove if file is malformed or for a different version.
		if ( is_null( $release_info )
			|| empty( $release_info->version )
			|| version_compare( $this->get_major_minor_version( $release_info->version ), $current_minor_version, '!=' )
		 	|| empty( $release_info->release_description )
		) {
			$notification_center->remove_notification_by_id( 'wpseo-plugin-updated' );
			return;
		}

		$notification = $this->get_yoast_seo_update_notification( $release_info );

		// Restore notification if it was dismissed in a previous minor version.
		$last_dismissed_version = get_user_option( $notification->get_dismissal_key() );
		if ( ! $last_dismissed_version
			 || version_compare( $this->get_major_minor_version( $last_dismissed_version ), $current_minor_version, '<' )
		) {
			Yoast_Notification_Center::restore_notification( $notification );
		}
		$notification_center->add_notification( $notification );
	}

	/**
	 * Helper to truncate the version string up to the minor number
	 *
	 * @param string $version The version string to extract the major.minor number from.
	 * @return string The version string up to the minor number.
	 */
	private function get_major_minor_version( $version ) {
		$version_parts = preg_split( '/[^0-9]+/', $version, 3 );
		return join( '.', array_slice( $version_parts, 0, 2 ) );
	}

	/**
	 * Builds Yoast SEO update notification.
	 *
	 * @param object $release_info The release information.
	 *
	 * @return Yoast_Notification The notification for the present version
	 */
	private function get_yoast_seo_update_notification( $release_info ) {
		$info_message = '<strong>' .
				sprintf(
				/* translators: %1$s expands to Yoast SEO, %2$s expands to the plugin version. */
					__( 'New in %1$s %2$s: ', 'wordpress-seo' ),
					'Yoast SEO',
					$release_info->version
				) .
				'</strong>' .
				$release_info->release_description;

		if ( ! empty( $release_info->shortlink ) ) {
			$link = esc_url( WPSEO_Shortlinker::get( $release_info->shortlink ) );
			$info_message .= ' <a href="' . esc_url( $link ) . '" target="_blank">' .
							 sprintf(
							 	/* translators: %s expands to the plugin version. */
							 	__( 'Read all about version %s here', 'wordpress-seo' ),
								$release_info->version
							 ) .
							 '</a>';
		}

		return new Yoast_Notification(
			$info_message,
			[
				'id'            => 'wpseo-plugin-updated',
				'type'          => Yoast_Notification::UPDATED,
				'data_json'     => [ 'dismiss_value' => WPSEO_Options::get( 'version', WPSEO_VERSION ) ],
				'dismissal_key' => 'wpseo-plugin-updated',
			]
		);
	}

	/**
	 * Creates an unsupported PHP version notification in the notification center.
	 *
	 * @return void
	 */
	public function unsupported_php_notice() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->remove_notification_by_id( 'wpseo-dismiss-unsupported-php' );
	}

	/**
	 * Gets the latest released major WordPress version from the WordPress stable-check api.
	 *
	 * @return float The latest released major WordPress version. 0 The stable-check api doesn't respond.
	 */
	private function get_latest_major_wordpress_version() {
		$core_updates = get_core_updates( [ 'dismissed' => true ] );

		if ( $core_updates === false ) {
			return 0;
		}

		$wp_version_latest = get_bloginfo( 'version' );
		foreach ( $core_updates as $update ) {
			if ( $update->response === 'upgrade' && version_compare( $update->version, $wp_version_latest, '>' ) ) {
				$wp_version_latest = $update->version;
			}
		}

		// Strip the patch version and convert to a float.
		return (float) $wp_version_latest;
	}

	/**
	 * Helper to verify if the user is currently visiting one of our admin pages.
	 *
	 * @return bool
	 */
	private function on_wpseo_admin_page() {
		return $this->pagenow === 'admin.php' && strpos( filter_input( INPUT_GET, 'page' ), 'wpseo' ) === 0;
	}

	/**
	 * Determine whether we should load the meta box class and if so, load it.
	 */
	private function load_meta_boxes() {

		$is_editor      = WPSEO_Metabox::is_post_overview( $this->pagenow ) || WPSEO_Metabox::is_post_edit( $this->pagenow );
		$is_inline_save = filter_input( INPUT_POST, 'action' ) === 'inline-save';

		/**
		 * Filter: 'wpseo_always_register_metaboxes_on_admin' - Allow developers to change whether
		 * the WPSEO metaboxes are only registered on the typical pages (lean loading) or always
		 * registered when in admin.
		 *
		 * @api bool Whether to always register the metaboxes or not. Defaults to false.
		 */
		if ( $is_editor || $is_inline_save || apply_filters( 'wpseo_always_register_metaboxes_on_admin', false )
		) {
			$GLOBALS['wpseo_metabox']      = new WPSEO_Metabox();
			$GLOBALS['wpseo_meta_columns'] = new WPSEO_Meta_Columns();
		}
	}

	/**
	 * Determine if we should load our taxonomy edit class and if so, load it.
	 */
	private function load_taxonomy_class() {
		if (
			WPSEO_Taxonomy::is_term_edit( $this->pagenow )
			|| WPSEO_Taxonomy::is_term_overview( $this->pagenow )
		) {
			new WPSEO_Taxonomy();
		}
	}

	/**
	 * Determine if we should load our admin pages class and if so, load it.
	 *
	 * Loads admin page class for all admin pages starting with `wpseo_`.
	 */
	private function load_admin_user_class() {
		if ( in_array( $this->pagenow, [ 'user-edit.php', 'profile.php' ], true )
			&& current_user_can( 'edit_users' )
		) {
			new WPSEO_Admin_User_Profile();
		}
	}

	/**
	 * Determine if we should load our admin pages class and if so, load it.
	 *
	 * Loads admin page class for all admin pages starting with `wpseo_`.
	 */
	private function load_admin_page_class() {

		if ( $this->on_wpseo_admin_page() ) {
			// For backwards compatabilty, this still needs a global, for now...
			$GLOBALS['wpseo_admin_pages'] = new WPSEO_Admin_Pages();

			// Only register the yoast i18n when the page is a Yoast SEO page.
			if ( WPSEO_Utils::is_yoast_seo_free_page( filter_input( INPUT_GET, 'page' ) ) ) {
				$this->register_i18n_promo_class();
				$this->register_premium_upsell_admin_block();
			}
		}
	}

	/**
	 * Loads the plugin suggestions.
	 */
	private function load_plugin_suggestions() {
		$suggestions = new WPSEO_Suggested_Plugins( new WPSEO_Plugin_Availability(), Yoast_Notification_Center::get() );
		$suggestions->register_hooks();
	}

	/**
	 * Registers the Premium Upsell Admin Block.
	 *
	 * @return void
	 */
	private function register_premium_upsell_admin_block() {
		if ( ! WPSEO_Utils::is_yoast_seo_premium() ) {
			$upsell_block = new WPSEO_Premium_Upsell_Admin_Block( 'wpseo_admin_promo_footer' );
			$upsell_block->register_hooks();
		}
	}

	/**
	 * Registers the promotion class for our GlotPress instance, then creates a notification with the i18n promo.
	 *
	 * @link https://github.com/Yoast/i18n-module
	 */
	private function register_i18n_promo_class() {
		// BC, because an older version of the i18n-module didn't have this class.
		$i18n_module = new Yoast_I18n_WordPressOrg_v3(
			[
				'textdomain'  => 'wordpress-seo',
				'plugin_name' => 'Yoast SEO',
				'hook'        => 'wpseo_admin_promo_footer',
			],
			false
		);

		$message = $i18n_module->get_promo_message();

		if ( $message !== '' ) {
			$message .= $i18n_module->get_dismiss_i18n_message_button();
		}

		$notification_center = Yoast_Notification_Center::get();

		$notification = new Yoast_Notification(
			$message,
			[
				'type' => Yoast_Notification::WARNING,
				'id'   => 'i18nModuleTranslationAssistance',
			]
		);

		if ( $message ) {
			$notification_center->add_notification( $notification );

			return;
		}

		$notification_center->remove_notification( $notification );
	}

	/**
	 * See if we should start our XML Sitemaps Admin class.
	 */
	private function load_xml_sitemaps_admin() {
		if ( WPSEO_Options::get( 'enable_xml_sitemap', false ) ) {
			new WPSEO_Sitemaps_Admin();
		}
	}

	/**
	 * Checks whether search engines are discouraged from indexing the site.
	 *
	 * @return bool Whether search engines are discouraged from indexing the site.
	 */
	private function are_search_engines_discouraged() {
		return (string) get_option( 'blog_public' ) === '0';
	}

	/**
	 * Shows deprecation warnings to the user if a plugin has registered a filter we have deprecated.
	 */
	public function show_hook_deprecation_warnings() {
		global $wp_filter;

		if ( wp_doing_ajax() ) {
			return;
		}

		// WordPress hooks that have been deprecated since a Yoast SEO version.
		$deprecated_filters = [
			'wpseo_genesis_force_adjacent_rel_home' => [
				'version'     => '9.4',
				'alternative' => null,
			],
			'wpseo_opengraph'                       => [
				'version'     => '14.0',
				'alternative' => null,
			],
			'wpseo_twitter'                         => [
				'version'     => '14.0',
				'alternative' => null,
			],
			'wpseo_twitter_taxonomy_image'          => [
				'version'     => '14.0',
				'alternative' => null,
			],
			'wpseo_twitter_metatag_key'             => [
				'version'     => '14.0',
				'alternative' => null,
			],
			'wp_seo_get_bc_ancestors'               => [
				'version'     => '14.0',
				'alternative' => 'wpseo_breadcrumb_links',
			],
		];

		// Determine which filters have been registered.
		$deprecated_notices = array_intersect(
			array_keys( $deprecated_filters ),
			array_keys( $wp_filter )
		);

		// Show notice for each deprecated filter or action that has been registered.
		foreach ( $deprecated_notices as $deprecated_filter ) {
			$deprecation_info = $deprecated_filters[ $deprecated_filter ];
			// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- only uses the hardcoded values from above.
			_deprecated_hook(
				$deprecated_filter,
				'WPSEO ' . $deprecation_info['version'],
				$deprecation_info['alternative']
			);
			// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped.
		}
	}

	/**
	 * Check if the permalink uses %postname%.
	 *
	 * @return bool
	 */
	private function has_postname_in_permalink() {
		return ( strpos( get_option( 'permalink_structure' ), '%postname%' ) !== false );
	}

	/**
	 * Shows a notice on the permalink settings page.
	 */
	public function permalink_settings_notice() {
		global $pagenow;

		if ( $pagenow === 'options-permalink.php' ) {
			printf(
				'<div class="notice notice-warning"><p><strong>%1$s</strong><br>%2$s<br><a href="%3$s" target="_blank">%4$s</a></p></div>',
				esc_html__( 'WARNING:', 'wordpress-seo' ),
				sprintf(
					/* translators: %1$s and %2$s expand to <em> items to emphasize the word in the middle. */
					esc_html__( 'Changing your permalinks settings can seriously impact your search engine visibility. It should almost %1$s never %2$s be done on a live website.', 'wordpress-seo' ),
					'<em>',
					'</em>'
				),
				esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/why-permalinks/' ) ),
				// The link's content.
				esc_html__( 'Learn about why permalinks are important for SEO.', 'wordpress-seo' )
			);
		}
	}

	/**
	 * Determines whether and where the "search engines discouraged" admin notice should be displayed.
	 *
	 * @return bool Whether the "search engines discouraged" admin notice should be displayed.
	 */
	private function should_display_search_engines_discouraged_notice() {
		$discouraged_pages = [
			'index.php',
			'plugins.php',
			'update-core.php',
		];

		return (
			$this->are_search_engines_discouraged()
			&& WPSEO_Capability_Utils::current_user_can( 'manage_options' )
			&& WPSEO_Options::get( 'ignore_search_engines_discouraged_notice', false ) === false
			&& (
				$this->on_wpseo_admin_page()
				|| in_array( $this->pagenow, $discouraged_pages, true )
			)
		);
	}

	/**
	 * Displays an admin notice when WordPress is set to discourage search engines from indexing the site.
	 *
	 * @return void
	 */
	public function search_engines_discouraged_notice() {
		if ( ! $this->should_display_search_engines_discouraged_notice() ) {
			return;
		}

		printf(
			'<div id="robotsmessage" class="notice notice-error"><p><strong>%1$s</strong> %2$s <button type="button" id="robotsmessage-dismiss-button" class="button-link hide-if-no-js" data-nonce="%3$s">%4$s</button></p></div>',
			esc_html__( 'Huge SEO Issue: You\'re blocking access to robots.', 'wordpress-seo' ),
			sprintf(
				/* translators: 1: Link start tag to the WordPress Reading Settings page, 2: Link closing tag. */
				esc_html__( 'If you want search engines to show this site in their results, you must %1$sgo to your Reading Settings%2$s and uncheck the box for Search Engine Visibility.', 'wordpress-seo' ),
				'<a href="' . esc_url( admin_url( 'options-reading.php' ) ) . '">',
				'</a>'
			),
			esc_js( wp_create_nonce( 'wpseo-ignore' ) ),
			esc_html__( 'I don\'t want this site to show in the search results.', 'wordpress-seo' )
		);
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Add an alert if outdated versions of Yoast SEO plugins are running.
	 *
	 * @deprecated 12.3
	 * @codeCoverageIgnore
	 */
	public function yoast_plugin_compatibility_notification() {
		_deprecated_function( __METHOD__, 'WPSEO 12.3' );
	}

	/**
	 * Creates a WordPress upgrade notification in the notification center.
	 *
	 * @deprecated 12.5
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function wordpress_upgrade_notice() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Shows a notice to the user if they have Google Analytics for WordPress 5.4.3 installed because it causes an error
	 * on the google search console page.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 */
	public function ga_compatibility_notice() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Display notice to disable comment pagination.
	 *
	 * @deprecated 12.8
	 * @codeCoverageIgnore
	 */
	public function page_comments_notice() {
		_deprecated_function( __METHOD__, 'WPSEO 12.8' );
	}

	/**
	 * Are page comments enabled.
	 *
	 * @deprecated 12.8
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public function has_page_comments() {
		_deprecated_function( __METHOD__, 'WPSEO 12.8' );

		return get_option( 'page_comments' ) === '1';
	}

	/**
	 * Notify about the default tagline if the user hasn't changed it.
	 *
	 * @deprecated 13.2
	 * @codeCoverageIgnore
	 */
	public function tagline_notice() {
		_deprecated_function( __METHOD__, 'WPSEO 13.2' );
	}

	/**
	 * Returns whether or not the site has the default tagline.
	 *
	 * @deprecated 13.2
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public function has_default_tagline() {
		_deprecated_function( __METHOD__, 'WPSEO 13.2' );

		$blog_description         = get_bloginfo( 'description' );
		$default_blog_description = 'Just another WordPress site';

		// We are checking against the WordPress internal translation.
		// @codingStandardsIgnoreLine
		$translated_blog_description = __( 'Just another WordPress site', 'default' );

		return $translated_blog_description === $blog_description || $default_blog_description === $blog_description;
	}

	/**
	 * Shows an alert when the permalink doesn't contain %postname%.
	 *
	 * @deprecated 13.2
	 * @codeCoverageIgnore
	 */
	public function permalink_notice() {
		_deprecated_function( __METHOD__, 'WPSEO 13.2' );
	}

	/**
	 * Add an alert if the blog is not publicly visible.
	 *
	 * @deprecated 14.1
	 * @codeCoverageIgnore
	 */
	public function blog_public_notice() {
		_deprecated_function( __METHOD__, 'WPSEO 14.1' );
	}

	/**
	 * Handles the notifiers for the dashboard page.
	 *
	 * @deprecated 14.1
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function handle_notifications() {
		_deprecated_function( __METHOD__, 'WPSEO 14.1' );
	}
}
