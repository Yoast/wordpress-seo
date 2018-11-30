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
	 * Class constructor
	 */
	public function __construct() {
		$GLOBALS['wpseo_admin'] = new WPSEO_Admin();

		$this->pagenow = $GLOBALS['pagenow'];

		$this->asset_manager = new WPSEO_Admin_Asset_Manager();

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_dismissible' ) );
		add_action( 'admin_init', array( $this, 'tagline_notice' ), 15 );
		add_action( 'admin_init', array( $this, 'blog_public_notice' ), 15 );
		add_action( 'admin_init', array( $this, 'permalink_notice' ), 15 );
		add_action( 'admin_init', array( $this, 'page_comments_notice' ), 15 );
		add_action( 'admin_init', array( $this, 'ga_compatibility_notice' ), 15 );
		add_action( 'admin_init', array( $this, 'yoast_plugin_compatibility_notification' ), 15 );
		add_action( 'admin_init', array( $this, 'yoast_plugin_suggestions_notification' ), 15 );
		add_action( 'admin_init', array( $this, 'recalculate_notice' ), 15 );
		add_action( 'admin_init', array( $this, 'unsupported_php_notice' ), 15 );
		add_action( 'admin_init', array( $this->asset_manager, 'register_assets' ) );
		add_action( 'admin_init', array( $this, 'show_hook_deprecation_warnings' ) );
		add_action( 'admin_init', array( 'WPSEO_Plugin_Conflict', 'hook_check_for_plugin_conflicts' ) );
		add_action( 'admin_init', array( $this, 'handle_notifications' ), 15 );
		add_action( 'admin_notices', array( $this, 'permalink_settings_notice' ) );
		add_action( 'admin_enqueue_scripts', array( $this->asset_manager, 'register_wp_assets' ), PHP_INT_MAX );

		$listeners   = array();
		$listeners[] = new WPSEO_Post_Type_Archive_Notification_Handler();

		/** @var WPSEO_Listener $listener */
		foreach ( $listeners as $listener ) {
			$listener->listen();
		}

		$this->load_meta_boxes();
		$this->load_taxonomy_class();
		$this->load_admin_page_class();
		$this->load_admin_user_class();
		$this->load_xml_sitemaps_admin();
		$this->load_plugin_suggestions();
	}

	/**
	 * Handles the notifiers for the dashboard page.
	 *
	 * @return void
	 */
	public function handle_notifications() {
		/**
		 * @var WPSEO_Notification_Handler[] $handlers
		 */
		$handlers   = array();
		$handlers[] = new WPSEO_Post_Type_Archive_Notification_Handler();

		$notification_center = Yoast_Notification_Center::get();
		foreach ( $handlers as $handler ) {
			$handler->handle( $notification_center );
		}
	}

	/**
	 * Enqueue our styling for dismissible yoast notifications.
	 */
	public function enqueue_dismissible() {
		$this->asset_manager->enqueue_style( 'dismissible' );
	}

	/**
	 * Notify about the default tagline if the user hasn't changed it
	 */
	public function tagline_notice() {

		$current_url   = ( is_ssl() ? 'https://' : 'http://' );
		$current_url  .= sanitize_text_field( $_SERVER['SERVER_NAME'] ) . sanitize_text_field( $_SERVER['REQUEST_URI'] );
		$query_args    = array(
			'autofocus[control]' => 'blogdescription',
			'url'                => urlencode( $current_url ),
		);
		$customize_url = add_query_arg( $query_args, wp_customize_url() );

		$info_message = sprintf(
			/* translators: 1: link open tag; 2: link close tag. */
			__( 'You still have the default WordPress tagline, even an empty one is probably better. %1$sYou can fix this in the customizer%2$s.', 'wordpress-seo' ),
			'<a href="' . esc_attr( $customize_url ) . '">',
			'</a>'
		);

		$notification_options = array(
			'type'         => Yoast_Notification::ERROR,
			'id'           => 'wpseo-dismiss-tagline-notice',
			'capabilities' => 'wpseo_manage_options',
		);

		$tagline_notification = new Yoast_Notification( $info_message, $notification_options );

		$notification_center = Yoast_Notification_Center::get();
		if ( $this->has_default_tagline() ) {
			$notification_center->add_notification( $tagline_notification );
		}
		else {
			$notification_center->remove_notification( $tagline_notification );
		}
	}

	/**
	 * Add an alert if the blog is not publicly visible
	 */
	public function blog_public_notice() {

		$info_message  = '<strong>' . __( 'Huge SEO Issue: You\'re blocking access to robots.', 'wordpress-seo' ) . '</strong> ';
		$info_message .= sprintf(
			/* translators: %1$s resolves to the opening tag of the link to the reading settings, %1$s resolves to the closing tag for the link */
			__( 'You must %1$sgo to your Reading Settings%2$s and uncheck the box for Search Engine Visibility.', 'wordpress-seo' ),
			'<a href="' . esc_url( admin_url( 'options-reading.php' ) ) . '">',
			'</a>'
		);

		$notification_options = array(
			'type'         => Yoast_Notification::ERROR,
			'id'           => 'wpseo-dismiss-blog-public-notice',
			'priority'     => 1.0,
			'capabilities' => 'wpseo_manage_options',
		);

		$notification = new Yoast_Notification( $info_message, $notification_options );

		$notification_center = Yoast_Notification_Center::get();
		if ( ! $this->is_blog_public() ) {
			$notification_center->add_notification( $notification );
		}
		else {
			$notification_center->remove_notification( $notification );
		}
	}

	/**
	 * Display notice to disable comment pagination
	 */
	public function page_comments_notice() {

		$info_message  = __( 'Paging comments is enabled, this is not needed in 999 out of 1000 cases, we recommend to disable it.', 'wordpress-seo' );
		$info_message .= '<br/>';

		$info_message .= sprintf(
			/* translators: %1$s resolves to the opening tag of the link to the comment setting page, %2$s resolves to the closing tag of the link */
			__( 'To fix this uncheck the box in front of the "Break comments into pages..." on the %1$sComment settings page%2$s.', 'wordpress-seo' ),
			'<a href="' . esc_url( admin_url( 'options-discussion.php' ) ) . '">',
			'</a>'
		);

		$notification_options = array(
			'type'         => Yoast_Notification::WARNING,
			'id'           => 'wpseo-dismiss-page_comments-notice',
			'capabilities' => 'wpseo_manage_options',
		);

		$tagline_notification = new Yoast_Notification( $info_message, $notification_options );

		$notification_center = Yoast_Notification_Center::get();
		if ( $this->has_page_comments() ) {
			$notification_center->add_notification( $tagline_notification );
		}
		else {
			$notification_center->remove_notification( $tagline_notification );
		}
	}

	/**
	 * Returns whether or not the site has the default tagline
	 *
	 * @return bool
	 */
	public function has_default_tagline() {
		$blog_description         = get_bloginfo( 'description' );
		$default_blog_description = 'Just another WordPress site';

		// We are checking against the WordPress internal translation.
		// @codingStandardsIgnoreLine
		$translated_blog_description = __( 'Just another WordPress site', 'default' );

		return $translated_blog_description === $blog_description || $default_blog_description === $blog_description;
	}

	/**
	 * Show alert when the permalink doesn't contain %postname%
	 */
	public function permalink_notice() {

		$info_message  = __( 'You do not have your postname in the URL of your posts and pages, it is highly recommended that you do. Consider setting your permalink structure to <strong>/%postname%/</strong>.', 'wordpress-seo' );
		$info_message .= '<br/>';
		$info_message .= sprintf(
			/* translators: %1$s resolves to the starting tag of the link to the permalink settings page, %2$s resolves to the closing tag of the link */
			__( 'You can fix this on the %1$sPermalink settings page%2$s.', 'wordpress-seo' ),
			'<a href="' . admin_url( 'options-permalink.php' ) . '">',
			'</a>'
		);

		$notification_options = array(
			'type'         => Yoast_Notification::WARNING,
			'id'           => 'wpseo-dismiss-permalink-notice',
			'capabilities' => 'wpseo_manage_options',
			'priority'     => 0.8,
		);

		$notification = new Yoast_Notification( $info_message, $notification_options );

		$notification_center = Yoast_Notification_Center::get();
		if ( ! $this->has_postname_in_permalink() ) {
			$notification_center->add_notification( $notification );
		}
		else {
			$notification_center->remove_notification( $notification );
		}
	}

	/**
	 * Are page comments enabled
	 *
	 * @return bool
	 */
	public function has_page_comments() {
		return '1' === get_option( 'page_comments' );
	}

	/**
	 * Shows a notice to the user if they have Google Analytics for WordPress 5.4.3 installed because it causes an error
	 * on the google search console page.
	 */
	public function ga_compatibility_notice() {

		$notification        = $this->get_compatibility_notification();
		$notification_center = Yoast_Notification_Center::get();

		if ( defined( 'GAWP_VERSION' ) && '5.4.3' === GAWP_VERSION ) {
			$notification_center->add_notification( $notification );
		}
		else {
			$notification_center->remove_notification( $notification );
		}
	}

	/**
	 * Build compatibility problem notification
	 *
	 * @return Yoast_Notification
	 */
	private function get_compatibility_notification() {
		$info_message = sprintf(
			/* translators: %1$s expands to Yoast SEO, %2$s expands to 5.4.3, %3$s expands to Google Analytics by Yoast */
			__( '%1$s detected you are using version %2$s of %3$s, please update to the latest version to prevent compatibility issues.', 'wordpress-seo' ),
			'Yoast SEO',
			'5.4.3',
			'Google Analytics by Yoast'
		);

		return new Yoast_Notification(
			$info_message,
			array(
				'id'   => 'gawp-compatibility-notice',
				'type' => Yoast_Notification::ERROR,
			)
		);
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
			array(
				'id'   => 'wpseo-suggested-plugin-' . $name,
				'type' => Yoast_Notification::WARNING,
			)
		);
	}

	/**
	 * Add an alert if outdated versions of Yoast SEO plugins are running.
	 */
	public function yoast_plugin_compatibility_notification() {
		$compatibility_checker = new WPSEO_Plugin_Compatibility( WPSEO_VERSION );
		$plugins               = $compatibility_checker->get_installed_plugins_compatibility();

		$notification_center = Yoast_Notification_Center::get();

		foreach ( $plugins as $name => $plugin ) {
			$type         = ( $plugin['active'] ) ? Yoast_Notification::ERROR : Yoast_Notification::WARNING;
			$notification = $this->get_yoast_seo_compatibility_notification( $name, $plugin, $type );

			if ( $plugin['compatible'] === false ) {
				$notification_center->add_notification( $notification );

				continue;
			}

			$notification_center->remove_notification( $notification );
		}
	}

	/**
	 * Build Yoast SEO compatibility problem notification
	 *
	 * @param string $name   The plugin name to use for the unique ID.
	 * @param array  $plugin The plugin to retrieve the data from.
	 * @param string $level  The severity level to use for the notification.
	 *
	 * @return Yoast_Notification
	 */
	private function get_yoast_seo_compatibility_notification( $name, $plugin, $level = Yoast_Notification::WARNING ) {
		$info_message = sprintf(
			/* translators: %1$s expands to Yoast SEO, %2$s expands to the plugin version, %3$s expands to the plugin name */
			__( '%1$s detected you are using version %2$s of %3$s, please update to the latest version to prevent compatibility issues.', 'wordpress-seo' ),
			'Yoast SEO',
			$plugin['version'],
			$plugin['title']
		);

		return new Yoast_Notification(
			$info_message,
			array(
				'id'   => 'wpseo-outdated-yoast-seo-plugin-' . $name,
				'type' => $level,
			)
		);
	}

	/**
	 * Shows the notice for recalculating the post. the Notice will only be shown if the user hasn't dismissed it before.
	 */
	public function recalculate_notice() {
		// Just a return, because we want to temporary disable this notice (#3998 and #4532).
		return;

		if ( filter_input( INPUT_GET, 'recalculate' ) === '1' ) {
			update_option( 'wpseo_dismiss_recalculate', '1' );

			return;
		}

		if ( ! WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' ) ) {
			return;
		}

		if ( $this->is_site_notice_dismissed( 'wpseo_dismiss_recalculate' ) ) {
			return;
		}

		Yoast_Notification_Center::get()->add_notification(
			new Yoast_Notification(
				sprintf(
					/* translators: 1: is a link to 'admin_url / admin.php?page=wpseo_tools&recalculate=1' 2: closing link tag */
					__( 'We\'ve updated our SEO score algorithm. %1$sRecalculate the SEO scores%2$s for all posts and pages.', 'wordpress-seo' ),
					'<a href="' . admin_url( 'admin.php?page=wpseo_tools&recalculate=1' ) . '">',
					'</a>'
				),
				array(
					'type'  => 'updated yoast-dismissible',
					'id'    => 'wpseo-dismiss-recalculate',
					'nonce' => wp_create_nonce( 'wpseo-dismiss-recalculate' ),
				)
			)
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
	 * Check if the user has dismissed the given notice (by $notice_name)
	 *
	 * @param string $notice_name The name of the notice that might be dismissed.
	 *
	 * @return bool
	 */
	private function is_site_notice_dismissed( $notice_name ) {
		return '1' === get_option( $notice_name, true );
	}

	/**
	 * Helper to verify if the user is currently visiting one of our admin pages.
	 *
	 * @return bool
	 */
	private function on_wpseo_admin_page() {
		return 'admin.php' === $this->pagenow && strpos( filter_input( INPUT_GET, 'page' ), 'wpseo' ) === 0;
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
		if ( in_array( $this->pagenow, array( 'user-edit.php', 'profile.php' ), true )
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
			array(
				'textdomain'  => 'wordpress-seo',
				'plugin_name' => 'Yoast SEO',
				'hook'        => 'wpseo_admin_promo_footer',
			),
			false
		);

		$message = $i18n_module->get_promo_message();

		if ( $message !== '' ) {
			$message .= $i18n_module->get_dismiss_i18n_message_button();
		}

		$notification_center = Yoast_Notification_Center::get();

		$notification = new Yoast_Notification(
			$message,
			array(
				'type' => Yoast_Notification::WARNING,
				'id'   => 'i18nModuleTranslationAssistance',
			)
		);

		if ( $message ) {
			$notification_center->add_notification( $notification );

			return;
		}

		$notification_center->remove_notification( $notification );
	}

	/**
	 * See if we should start our XML Sitemaps Admin class
	 */
	private function load_xml_sitemaps_admin() {
		if ( WPSEO_Options::get( 'enable_xml_sitemap', false ) ) {
			new WPSEO_Sitemaps_Admin();
		}
	}

	/**
	 * Check if the site is set to be publicly visible
	 *
	 * @return bool
	 */
	private function is_blog_public() {
		return '1' === (string) get_option( 'blog_public' );
	}

	/**
	 * Shows deprecation warnings to the user if a plugin has registered a filter we have deprecated.
	 */
	public function show_hook_deprecation_warnings() {
		global $wp_filter;

		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			return;
		}

		// WordPress hooks that have been deprecated since a Yoast SEO version.
		$deprecated_filters = array(
			'wpseo_metadesc_length'            => array(
				'version'     => '3.0',
				'alternative' => 'javascript',
			),
			'wpseo_metadesc_length_reason'     => array(
				'version'     => '3.0',
				'alternative' => 'javascript',
			),
			'wpseo_body_length_score'          => array(
				'version'     => '3.0',
				'alternative' => 'javascript',
			),
			'wpseo_linkdex_results'            => array(
				'version'     => '3.0',
				'alternative' => 'javascript',
			),
			'wpseo_snippet'                    => array(
				'version'     => '3.0',
				'alternative' => 'javascript',
			),
			'wp_seo_get_bc_title'              => array(
				'version'     => '5.8',
				'alternative' => 'wpseo_breadcrumb_single_link_info',
			),
			'wpseo_metakey'                    => array(
				'version'     => '6.3',
				'alternative' => null,
			),
			'wpseo_metakeywords'               => array(
				'version'     => '6.3',
				'alternative' => null,
			),
			'wpseo_stopwords'                  => array(
				'version'     => '7.0',
				'alternative' => null,
			),
			'wpseo_redirect_orphan_attachment' => array(
				'version'     => '7.0',
				'alternative' => null,
			),
			'wpseo_genesis_force_adjacent_rel_home' => array(
				'version'     => '9.4',
				'alternative' => null,
			),
		);

		// Determine which filters have been registered.
		$deprecated_notices = array_intersect(
			array_keys( $deprecated_filters ),
			array_keys( $wp_filter )
		);

		// Show notice for each deprecated filter or action that has been registered.
		foreach ( $deprecated_notices as $deprecated_filter ) {
			$deprecation_info = $deprecated_filters[ $deprecated_filter ];
			_deprecated_hook(
				$deprecated_filter,
				'WPSEO ' . $deprecation_info['version'],
				$deprecation_info['alternative']
			);
		}
	}

	/**
	 * Check if the permalink uses %postname%
	 *
	 * @return bool
	 */
	private function has_postname_in_permalink() {
		return ( false !== strpos( get_option( 'permalink_structure' ), '%postname%' ) );
	}

	/**
	 * Shows a notice on the permalink settings page.
	 */
	public function permalink_settings_notice() {
		global $pagenow;

		if ( $pagenow === 'options-permalink.php' ) {
			$warning = esc_html__( 'WARNING:', 'wordpress-seo' );
			/* translators: %1$s and %2$s expand to <i> items to emphasize the word in the middle. */
			$message = esc_html__( 'Changing your permalinks settings can seriously impact your search engine visibility. It should almost %1$s never %2$s be done on a live website.', 'wordpress-seo' );
			$link    = esc_html__( 'Learn about why permalinks are important for SEO.', 'wordpress-seo' );
			$url     = WPSEO_Shortlinker::get( 'https://yoa.st/why-permalinks/' );

			echo '<div class="notice notice-warning"><p><strong>' . $warning . '</strong><br>' . sprintf( $message, '<i>', '</i>' ) . '<br><a href="' . $url . '" target="_blank">' . $link . '</a></p></div>';
		}
	}
}
