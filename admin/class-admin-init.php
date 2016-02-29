<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Performs the load on admin side.
 */
class WPSEO_Admin_Init {

	/**
	 * Holds the Yoast SEO Options
	 *
	 * @var array
	 */
	private $options;

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
		$this->options = WPSEO_Options::get_option( 'wpseo_xml' );

		$GLOBALS['wpseo_admin'] = new WPSEO_Admin;

		$this->pagenow = $GLOBALS['pagenow'];

		$this->asset_manager = new WPSEO_Admin_Asset_Manager();

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_dismissible' ) );
		add_action( 'admin_init', array( $this, 'update_seen_about_check' ), 15 );
		add_action( 'admin_init', array( $this, 'ga_compatibility_notice' ), 15 );
		add_action( 'admin_init', array( $this, 'ignore_tour' ) );
		add_action( 'admin_init', array( $this, 'load_tour' ) );
		add_action( 'admin_init', array( $this->asset_manager, 'register_assets' ) );
		add_action( 'admin_init', array( $this, 'show_hook_deprecation_warnings' ) );

		$this->load_meta_boxes();
		$this->load_taxonomy_class();
		$this->load_admin_page_class();
		$this->load_admin_user_class();
		$this->load_xml_sitemaps_admin();
	}

	/**
	 * For WP versions older than 4.2, this includes styles and a script to make notices dismissible.
	 */
	public function enqueue_dismissible() {
		if ( version_compare( $GLOBALS['wp_version'], '4.2', '<' ) ) {
			$this->asset_manager->enqueue_script( 'dismissable' );
			$this->asset_manager->enqueue_style( 'dismissable' );
		}
	}

	/**
	 * Set the 'seen about' version if conditions meet
	 */
	public static function update_seen_about_check() {
		// Todo: be more specific for the 'intro' variable (Jip).
		if ( filter_input( INPUT_GET, 'intro' ) === '1' || Yoast_Notification_Center::maybe_dismiss_notification( 'wpseo-dismiss-about' ) ) {
			update_user_meta( get_current_user_id(), 'wpseo_seen_about_version', WPSEO_VERSION );
		}
	}

	/**
	 * Helper to verify if the current user has already seen the about page for the current version
	 *
	 * @return bool
	 */
	public static function seen_about() {
		$seen_about_version = substr( get_user_meta( get_current_user_id(), 'wpseo_seen_about_version', true ), 0, 3 );
		$last_minor_version = substr( WPSEO_VERSION, 0, 3 );

		return version_compare( $seen_about_version, $last_minor_version, '>=' );
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

		$is_editor      = in_array( $this->pagenow, array( 'edit.php', 'post.php', 'post-new.php' ) );
		$is_inline_save = filter_input( INPUT_POST, 'action' ) === 'inline-save';

		/**
		 * Filter: 'wpseo_always_register_metaboxes_on_admin' - Allow developers to change whether
		 * the WPSEO metaboxes are only registered on the typical pages (lean loading) or always
		 * registered when in admin.
		 *
		 * @api bool Whether to always register the metaboxes or not. Defaults to false.
		 */
		if ( $is_editor || $is_inline_save || in_array( $this->pagenow, array(
				'edit.php',
				'post.php',
				'post-new.php',
			) ) || apply_filters( 'wpseo_always_register_metaboxes_on_admin', false )
		) {
			$GLOBALS['wpseo_metabox']      = new WPSEO_Metabox;
			$GLOBALS['wpseo_meta_columns'] = new WPSEO_Meta_Columns();
		}
	}

	/**
	 * Determine if we should load our taxonomy edit class and if so, load it.
	 */
	private function load_taxonomy_class() {
		if ( 'edit-tags.php' === $this->pagenow ) {
			new WPSEO_Taxonomy;
		}
	}

	/**
	 * Determine if we should load our admin pages class and if so, load it.
	 *
	 * Loads admin page class for all admin pages starting with `wpseo_`.
	 */
	private function load_admin_user_class() {
		if ( in_array( $this->pagenow, array( 'user-edit.php', 'profile.php' ) ) && current_user_can( 'edit_users' ) ) {
			new WPSEO_Admin_User_Profile;
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
			$GLOBALS['wpseo_admin_pages'] = new WPSEO_Admin_Pages;
			$this->register_i18n_promo_class();
		}
	}

	/**
	 * Register the promotion class for our GlotPress instance
	 *
	 * @link https://github.com/Yoast/i18n-module
	 */
	private function register_i18n_promo_class() {
		new yoast_i18n(
			array(
				'textdomain'     => 'wordpress-seo',
				'project_slug'   => 'wordpress-seo',
				'plugin_name'    => 'Yoast SEO',
				'hook'           => 'wpseo_admin_footer',
				'glotpress_url'  => 'http://translate.yoast.com/gp/',
				'glotpress_name' => 'Yoast Translate',
				'glotpress_logo' => 'https://translate.yoast.com/gp-templates/images/Yoast_Translate.svg',
				'register_url'   => 'http://translate.yoast.com/gp/projects#utm_source=plugin&utm_medium=promo-box&utm_campaign=wpseo-i18n-promo',
			)
		);
	}

	/**
	 * See if we should start our tour.
	 */
	public function load_tour() {
		$restart_tour = filter_input( INPUT_GET, 'wpseo_restart_tour' );
		if ( $restart_tour ) {
			delete_user_meta( get_current_user_id(), 'wpseo_ignore_tour' );
		}

		if ( ! $this->has_ignored_tour() ) {
			add_action( 'admin_enqueue_scripts', array( 'WPSEO_Pointers', 'get_instance' ) );
		}
	}

	/**
	 * See if we should start our XML Sitemaps Admin class
	 */
	private function load_xml_sitemaps_admin() {
		if ( $this->options['enablexmlsitemap'] === true ) {
			new WPSEO_Sitemaps_Admin;
		}
	}

	/**
	 * Returns the value of the ignore tour.
	 *
	 * @return bool
	 */
	public static function has_ignored_tour() {
		return Yoast_Notification_Center::is_notification_dismissed( 'wpseo_ignore_tour' );
	}

	/**
	 * Listener for the ignore tour GET value. If this one is set, just set the user meta to true.
	 */
	public function ignore_tour() {
		Yoast_Notification_Center::maybe_dismiss_notification( 'wpseo_ignore_tour', '1' );
	}

	/**
	 * Shows deprecation warnings to the user if a plugin has registered a filter we have deprecated.
	 */
	public function show_hook_deprecation_warnings() {
		global $wp_filter;

		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			return false;
		}

		// WordPress hooks that have been deprecated in Yoast SEO 3.0.
		$deprecated_30 = array(
			'wpseo_pre_analysis_post_content',
			'wpseo_metadesc_length',
			'wpseo_metadesc_length_reason',
			'wpseo_body_length_score',
			'wpseo_linkdex_results',
			'wpseo_snippet',
		);

		$deprecated_notices = array_intersect(
			$deprecated_30,
			array_keys( $wp_filter )
		);

		foreach ( $deprecated_notices as $deprecated_filter ) {
			_deprecated_function(
				/* %s expands to the actual filter/action that has been used. */
				sprintf( __( '%s filter/action', 'wordpress-seo' ), $deprecated_filter ),
				'WPSEO 3.0',
				'javascript'
			);
		}
	}

	/**
	 * Returns whether or not the site has the default tagline
	 *
	 * This is now checked inside the Yoast_Default_Tagline_Notifier.
	 *
	 * @return bool
	 *
	 * @deprecated 3.2 remove in 3.5
	 */
	public function has_default_tagline() {
		return __( 'Just another WordPress site' ) === get_bloginfo( 'description' );
	}

	/**
	 * Returns whether or not the user has seen the tagline notice
	 *
	 * @return bool
	 *
	 * @deprecated 3.2 remove in 3.5
	 */
	public function seen_tagline_notice() {
		return Yoast_Notification_Center::maybe_dismiss_notification( 'wpseo-dismiss-tagline-notice' );
	}

	/**
	 * @deprecated 3.2 remove in 3.5
	 */
	public function tagline_notice() {

	}

	/**
	 * Shows a notice to the user if they have Google Analytics for WordPress 5.4.3 installed because it causes an error
	 * on the google search console page.
	 *
	 * @deprecated 3.2 remove in 3.5
	 */
	public function ga_compatibility_notice() {

	}

	/**
	 * Shows the notice for recalculating the post. the Notice will only be shown if the user hasn't dismissed it before.
	 *
	 * @deprecated 3.2 remove in 3.5
	 */
	public function recalculate_notice() {

	}
}
