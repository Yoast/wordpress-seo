<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class that holds most of the admin functionality for Yoast SEO.
 */
class WPSEO_Admin {

	/**
	 * The page identifier used in WordPress to register the admin page.
	 *
	 * !DO NOT CHANGE THIS!
	 *
	 * @var string
	 */
	const PAGE_IDENTIFIER = 'wpseo_dashboard';

	/**
	 * Array of classes that add admin functionality.
	 *
	 * @var array
	 */
	protected $admin_features;

	/**
	 * Class constructor.
	 */
	public function __construct() {
		$integrations = [];

		global $pagenow;

		$wpseo_menu = new WPSEO_Menu();
		$wpseo_menu->register_hooks();

		if ( is_multisite() ) {
			WPSEO_Options::maybe_set_multisite_defaults( false );
		}

		if ( WPSEO_Options::get( 'stripcategorybase' ) === true ) {
			add_action( 'created_category', [ $this, 'schedule_rewrite_flush' ] );
			add_action( 'edited_category', [ $this, 'schedule_rewrite_flush' ] );
			add_action( 'delete_category', [ $this, 'schedule_rewrite_flush' ] );
		}

		if ( WPSEO_Options::get( 'disable-attachment' ) === true ) {
			add_filter( 'wpseo_accessible_post_types', [ 'WPSEO_Post_Type', 'filter_attachment_post_type' ] );
		}

		if ( filter_input( INPUT_GET, 'page' ) === 'wpseo_tools' && filter_input( INPUT_GET, 'tool' ) === null ) {
			new WPSEO_Recalculate_Scores();
		}

		add_filter( 'plugin_action_links_' . WPSEO_BASENAME, [ $this, 'add_action_link' ], 10, 2 );

		add_action( 'admin_enqueue_scripts', [ $this, 'config_page_scripts' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_global_style' ] );

		add_filter( 'user_contactmethods', [ $this, 'update_contactmethods' ], 10, 1 );

		add_action( 'after_switch_theme', [ $this, 'switch_theme' ] );
		add_action( 'switch_theme', [ $this, 'switch_theme' ] );

		add_filter( 'set-screen-option', [ $this, 'save_bulk_edit_options' ], 10, 3 );

		add_action( 'admin_init', [ 'WPSEO_Plugin_Conflict', 'hook_check_for_plugin_conflicts' ], 10, 1 );

		add_action( 'admin_init', [ $this, 'map_manage_options_cap' ] );

		WPSEO_Sitemaps_Cache::register_clear_on_option_update( 'wpseo' );
		WPSEO_Sitemaps_Cache::register_clear_on_option_update( 'home' );

		if ( WPSEO_Utils::is_yoast_seo_page() ) {
			add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		}

		if ( WPSEO_Utils::is_api_available() ) {
			$configuration = new WPSEO_Configuration_Page();
			$configuration->set_hooks();
			$configuration->catch_configuration_request();
		}

		$this->set_upsell_notice();

		$this->initialize_cornerstone_content();

		if ( WPSEO_Utils::is_plugin_network_active() ) {
			$integrations[] = new Yoast_Network_Admin();
		}

		$this->admin_features = [
			'dashboard_widget' => new Yoast_Dashboard_Widget(),
		];

		if ( WPSEO_Metabox::is_post_overview( $pagenow ) || WPSEO_Metabox::is_post_edit( $pagenow ) ) {
			$this->admin_features['primary_category'] = new WPSEO_Primary_Term_Admin();
		}

		$integrations[] = new WPSEO_Yoast_Columns();
		$integrations[] = new WPSEO_License_Page_Manager();
		$integrations[] = new WPSEO_Statistic_Integration();
		$integrations[] = new WPSEO_Capability_Manager_Integration( WPSEO_Capability_Manager_Factory::get() );
		$integrations[] = new WPSEO_Admin_Media_Purge_Notification();
		$integrations[] = new WPSEO_Admin_Gutenberg_Compatibility_Notification();
		$integrations[] = new WPSEO_Expose_Shortlinks();
		$integrations[] = new WPSEO_MyYoast_Proxy();
		$integrations[] = new WPSEO_MyYoast_Route();
		$integrations[] = new WPSEO_Schema_Person_Upgrade_Notification();
		$integrations[] = new WPSEO_Tracking( 'https://tracking.yoast.com/stats', ( WEEK_IN_SECONDS * 2 ) );
		$integrations[] = new WPSEO_Admin_Settings_Changed_Listener();
		$integrations[] = $this->get_helpscout_beacon();

		$integrations = array_merge(
			$integrations,
			$this->get_admin_features(),
			$this->initialize_seo_links(),
			$this->initialize_cornerstone_content()
		);

		foreach ( $integrations as $integration ) {
			$integration->register_hooks();
		}
	}

	/**
	 * Schedules a rewrite flush to happen at shutdown.
	 */
	public function schedule_rewrite_flush() {
		// Bail if this is a multisite installation and the site has been switched.
		if ( is_multisite() && ms_is_switched() ) {
			return;
		}

		add_action( 'shutdown', 'flush_rewrite_rules' );
	}

	/**
	 * Returns all the classes for the admin features.
	 *
	 * @return array
	 */
	public function get_admin_features() {
		return $this->admin_features;
	}

	/**
	 * Register assets needed on admin pages.
	 */
	public function enqueue_assets() {
		if ( filter_input( INPUT_GET, 'page' ) === 'wpseo_licenses' ) {
			$asset_manager = new WPSEO_Admin_Asset_Manager();
			$asset_manager->enqueue_style( 'extensions' );
		}
	}

	/**
	 * Returns the manage_options capability.
	 *
	 * @return string The capability to use.
	 */
	public function get_manage_options_cap() {
		/**
		 * Filter: 'wpseo_manage_options_capability' - Allow changing the capability users need to view the settings pages.
		 *
		 * @api string unsigned The capability.
		 */
		return apply_filters( 'wpseo_manage_options_capability', 'wpseo_manage_options' );
	}

	/**
	 * Maps the manage_options cap on saving an options page to wpseo_manage_options.
	 */
	public function map_manage_options_cap() {
		$option_page = ! empty( $_POST['option_page'] ) ? $_POST['option_page'] : ''; // WPCS: CSRF ok.

		if ( strpos( $option_page, 'yoast_wpseo' ) === 0 ) {
			add_filter( 'option_page_capability_' . $option_page, [ $this, 'get_manage_options_cap' ] );
		}
	}

	/**
	 * Adds the ability to choose how many posts are displayed per page
	 * on the bulk edit pages.
	 */
	public function bulk_edit_options() {
		$option = 'per_page';
		$args   = [
			'label'   => __( 'Posts', 'wordpress-seo' ),
			'default' => 10,
			'option'  => 'wpseo_posts_per_page',
		];
		add_screen_option( $option, $args );
	}

	/**
	 * Saves the posts per page limit for bulk edit pages.
	 *
	 * @param int    $status Status value to pass through.
	 * @param string $option Option name.
	 * @param int    $value  Count value to check.
	 *
	 * @return int
	 */
	public function save_bulk_edit_options( $status, $option, $value ) {
		if ( $option && ( $value > 0 && $value < 1000 ) === 'wpseo_posts_per_page' ) {
			return $value;
		}

		return $status;
	}

	/**
	 * Adds links to Premium Support and FAQ under the plugin in the plugin overview page.
	 *
	 * @staticvar string $this_plugin Holds the directory & filename for the plugin.
	 *
	 * @param array  $links Array of links for the plugins, adapted when the current plugin is found.
	 * @param string $file  The filename for the current plugin, which the filter loops through.
	 *
	 * @return array $links
	 */
	public function add_action_link( $links, $file ) {
		if ( WPSEO_BASENAME === $file && WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' ) ) {
			$settings_link = '<a href="' . esc_url( admin_url( 'admin.php?page=' . self::PAGE_IDENTIFIER ) ) . '">' . __( 'Settings', 'wordpress-seo' ) . '</a>';
			array_unshift( $links, $settings_link );
		}

		$addon_manager = new WPSEO_Addon_Manager();
		if ( WPSEO_Utils::is_yoast_seo_premium() && $addon_manager->has_valid_subscription( WPSEO_Addon_Manager::PREMIUM_SLUG ) ) {
			return $links;
		}

		// Add link to premium support landing page.
		$premium_link = '<a style="font-weight: bold;" href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/1yb' ) ) . '" target="_blank">' . __( 'Premium Support', 'wordpress-seo' ) . '</a>';
		array_unshift( $links, $premium_link );

		// Add link to docs.
		$faq_link = '<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/1yc' ) ) . '" target="_blank">' . __( 'FAQ', 'wordpress-seo' ) . '</a>';
		array_unshift( $links, $faq_link );

		return $links;
	}

	/**
	 * Enqueues the (tiny) global JS needed for the plugin.
	 */
	public function config_page_scripts() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'admin-global-script' );

		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'admin-global-script', 'wpseoAdminGlobalL10n', $this->localize_admin_global_script() );
	}

	/**
	 * Enqueues the (tiny) global stylesheet needed for the plugin.
	 */
	public function enqueue_global_style() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_style( 'admin-global' );
	}

	/**
	 * Filter the $contactmethods array and add a set of social profiles.
	 *
	 * These are used with the Facebook author, rel="author" and Twitter cards implementation.
	 *
	 * @link https://developers.google.com/search/docs/data-types/social-profile
	 *
	 * @param array $contactmethods Currently set contactmethods.
	 *
	 * @return array $contactmethods with added contactmethods.
	 */
	public function update_contactmethods( $contactmethods ) {
		$contactmethods['facebook']   = __( 'Facebook profile URL', 'wordpress-seo' );
		$contactmethods['instagram']  = __( 'Instagram profile URL', 'wordpress-seo' );
		$contactmethods['linkedin']   = __( 'LinkedIn profile URL', 'wordpress-seo' );
		$contactmethods['myspace']    = __( 'MySpace profile URL', 'wordpress-seo' );
		$contactmethods['pinterest']  = __( 'Pinterest profile URL', 'wordpress-seo' );
		$contactmethods['soundcloud'] = __( 'SoundCloud profile URL', 'wordpress-seo' );
		$contactmethods['tumblr']     = __( 'Tumblr profile URL', 'wordpress-seo' );
		$contactmethods['twitter']    = __( 'Twitter username (without @)', 'wordpress-seo' );
		$contactmethods['youtube']    = __( 'YouTube profile URL', 'wordpress-seo' );
		$contactmethods['wikipedia']  = __( 'Wikipedia page about you', 'wordpress-seo' ) . '<br/><small>' . __( '(if one exists)', 'wordpress-seo' ) . '</small>';

		return $contactmethods;
	}

	/**
	 * Log the updated timestamp for user profiles when theme is changed.
	 */
	public function switch_theme() {
		$users = get_users( [ 'who' => 'authors' ] );
		if ( is_array( $users ) && $users !== [] ) {
			foreach ( $users as $user ) {
				update_user_meta( $user->ID, '_yoast_wpseo_profile_updated', time() );
			}
		}
	}

	/**
	 * Localization for the dismiss urls.
	 *
	 * @return array
	 */
	private function localize_admin_global_script() {
		return [
			'isRtl'                   => is_rtl(),
			'variable_warning'        => sprintf(
				/* translators: %1$s: '%%term_title%%' variable used in titles and meta's template that's not compatible with the given template, %2$s: expands to 'HelpScout beacon' */
				__( 'Warning: the variable %1$s cannot be used in this template. See the %2$s for more info.', 'wordpress-seo' ),
				'<code>%s</code>',
				'HelpScout beacon'
			),
			'dismiss_about_url'       => $this->get_dismiss_url( 'wpseo-dismiss-about' ),
			/* translators: %s: expends to Yoast SEO */
			'help_video_iframe_title' => sprintf( __( '%s video tutorial', 'wordpress-seo' ), 'Yoast SEO' ),
			'scrollable_table_hint'   => __( 'Scroll to see the table content.', 'wordpress-seo' ),
		];
	}

	/**
	 * Extending the current page URL with two params to be able to ignore the notice.
	 *
	 * @param string $dismiss_param The param used to dismiss the notification.
	 *
	 * @return string
	 */
	private function get_dismiss_url( $dismiss_param ) {
		$arr_params = [
			$dismiss_param => '1',
			'nonce'        => wp_create_nonce( $dismiss_param ),
		];

		return esc_url( add_query_arg( $arr_params ) );
	}

	/**
	 * Sets the upsell notice.
	 */
	protected function set_upsell_notice() {
		$upsell = new WPSEO_Product_Upsell_Notice();
		$upsell->dismiss_notice_listener();
		$upsell->initialize();
	}

	/**
	 * Whether we are on the admin dashboard page.
	 *
	 * @returns bool
	 */
	protected function on_dashboard_page() {
		return $GLOBALS['pagenow'] === 'index.php';
	}

	/**
	 * Loads the cornerstone filter.
	 *
	 * @return WPSEO_WordPress_Integration[] The integrations to initialize.
	 */
	protected function initialize_cornerstone_content() {
		if ( ! WPSEO_Options::get( 'enable_cornerstone_content' ) ) {
			return [];
		}

		return [
			'cornerstone_filter' => new WPSEO_Cornerstone_Filter(),
		];
	}

	/**
	 * Initializes the seo link watcher.
	 *
	 * @returns WPSEO_WordPress_Integration[]
	 */
	protected function initialize_seo_links() {
		$integrations = [];

		if ( ! WPSEO_Options::get( 'enable_text_link_counter' ) ) {
			return $integrations;
		}

		$integrations[] = new WPSEO_Link_Cleanup_Transient();

		if ( ! WPSEO_Link_Table_Accessible::is_accessible() ) {
			WPSEO_Link_Table_Accessible::cleanup();
		}

		if ( ! WPSEO_Meta_Table_Accessible::is_accessible() ) {
			WPSEO_Meta_Table_Accessible::cleanup();
		}

		if ( ! WPSEO_Link_Table_Accessible::is_accessible() || ! WPSEO_Meta_Table_Accessible::is_accessible() ) {
			return $integrations;
		}

		$integrations[] = new WPSEO_Link_Columns( new WPSEO_Meta_Storage() );
		$integrations[] = new WPSEO_Link_Reindex_Dashboard();
		$integrations[] = new WPSEO_Link_Notifier();

		// Adds a filter to exclude the attachments from the link count.
		add_filter( 'wpseo_link_count_post_types', [ 'WPSEO_Post_Type', 'filter_attachment_post_type' ] );

		return $integrations;
	}

	/**
	 * Retrieves an instance of the HelpScout beacon class for Yoast SEO.
	 *
	 * @return WPSEO_HelpScout The instance of the HelpScout beacon.
	 */
	private function get_helpscout_beacon() {
		$helpscout_settings = [
			'beacon_id'   => '2496aba6-0292-489c-8f5d-1c0fba417c2f',
			'pages'       => [
				'wpseo_dashboard',
				'wpseo_titles',
				'wpseo_search_console',
				'wpseo_social',
				'wpseo_tools',
				'wpseo_licenses',
			],
			'products'    => [],
			'ask_consent' => true,
		];

		/**
		 * Filter: 'wpseo_helpscout_beacon_settings' - Allows overriding the HelpScout beacon settings.
		 *
		 * @api string - The helpscout beacons settings.
		 */
		$helpscout_settings = apply_filters( 'wpseo_helpscout_beacon_settings', $helpscout_settings );

		return new WPSEO_HelpScout(
			$helpscout_settings['beacon_id'],
			$helpscout_settings['pages'],
			$helpscout_settings['products'],
			$helpscout_settings['ask_consent']
		);
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Cleans stopwords out of the slug, if the slug hasn't been set yet.
	 *
	 * @deprecated 7.0
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function remove_stopwords_from_slug() {
		_deprecated_function( __METHOD__, 'WPSEO 7.0' );
	}

	/**
	 * Filter the stopwords from the slug.
	 *
	 * @deprecated 7.0
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function filter_stopwords_from_slug() {
		_deprecated_function( __METHOD__, 'WPSEO 7.0' );
	}

	/**
	 * Initializes WHIP to show a notice for outdated PHP versions.
	 *
	 * @deprecated 8.1
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function check_php_version() {
		// Intentionally left empty.
	}
}
