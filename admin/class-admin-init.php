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
		add_action( 'admin_init', [ $this, 'unsupported_php_notice' ], 15 );
		add_action( 'admin_init', [ $this->asset_manager, 'register_assets' ] );
		add_action( 'admin_init', [ $this, 'show_hook_deprecation_warnings' ] );
		add_action( 'admin_init', [ 'WPSEO_Plugin_Conflict', 'hook_check_for_plugin_conflicts' ] );
		add_action( 'admin_notices', [ $this, 'permalink_settings_notice' ] );
		add_action( 'post_submitbox_misc_actions', [ $this, 'add_publish_box_section' ] );

		/*
		 * The `admin_notices` hook fires on single site admin pages vs.
		 * `network_admin_notices` which fires on multisite admin pages and
		 * `user_admin_notices` which fires on multisite user admin pagss.
		 */
		add_action( 'admin_notices', [ $this, 'search_engines_discouraged_notice' ] );

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
	 * @return float|int The latest released major WordPress version. 0 when the stable-check API doesn't respond.
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

			$page = filter_input( INPUT_GET, 'page' );
			// Only register the yoast i18n when the page is a Yoast SEO page.
			if ( WPSEO_Utils::is_yoast_seo_free_page( $page ) ) {
				$this->register_i18n_promo_class();
				if ( $page !== 'wpseo_titles' ) {
					$this->register_premium_upsell_admin_block();
				}
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
		if ( ! YoastSEO()->helpers->product->is_premium() ) {
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
			'wpseo_opengraph' => [
				'version'     => '14.0',
				'alternative' => null,
			],
			'wpseo_twitter' => [
				'version'     => '14.0',
				'alternative' => null,
			],
			'wpseo_twitter_taxonomy_image' => [
				'version'     => '14.0',
				'alternative' => null,
			],
			'wpseo_twitter_metatag_key' => [
				'version'     => '14.0',
				'alternative' => null,
			],
			'wp_seo_get_bc_ancestors' => [
				'version'     => '14.0',
				'alternative' => 'wpseo_breadcrumb_links',
			],
			'validate_facebook_app_id_api_response_code' => [
				'version'     => '15.5',
				'alternative' => null,
			],
			'validate_facebook_app_id_api_response_body' => [
				'version'     => '15.5',
				'alternative' => null,
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
			// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Only uses the hardcoded values from above.
			_deprecated_hook(
				$deprecated_filter,
				'WPSEO ' . $deprecation_info['version'],
				$deprecation_info['alternative']
			);
			// phpcs:enable
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

	/**
	 * Adds a custom Yoast section within the Classic Editor publish box.
	 *
	 * @param \WP_Post $post The current post object.
	 *
	 * @return void
	 */
	public function add_publish_box_section( $post ) {
		if ( in_array( $this->pagenow, [ 'post.php', 'post-new.php' ], true ) ) {
			?>
			<div id="yoast-seo-publishbox-section"></div>
			<?php
			/**
			 * Fires after the post time/date setting in the Publish meta box.
			 *
			 * @api \WP_Post The current post object.
			 */
			do_action( 'wpseo_publishbox_misc_actions', $post );
		}
	}

	/* ********************* DEPRECATED METHODS ********************* */

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

		// We are using the WordPress internal translation.
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
