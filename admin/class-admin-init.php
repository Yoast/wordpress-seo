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
	 * Class constructor
	 */
	public function __construct() {
		$this->options = WPSEO_Options::get_all();

		$GLOBALS['wpseo_admin'] = new WPSEO_Admin;

		$this->pagenow = $GLOBALS['pagenow'];

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_dismissible' ) );
		add_action( 'admin_init', array( $this, 'after_update_notice' ), 15 );
		add_action( 'admin_init', array( $this, 'tagline_notice' ), 15 );
		add_action( 'admin_init', array( $this, 'ga_compatibility_notice' ), 15 );
		add_action( 'admin_init', array( $this, 'recalculate_notice' ), 15 );
		add_action( 'admin_init', array( $this, 'ignore_tour' ) );
		add_action( 'admin_init', array( $this, 'load_tour' ) );
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
			wp_enqueue_style( 'wpseo-dismissible', plugins_url( 'css/wpseo-dismissible' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
			wp_enqueue_script( 'wpseo-dismissible', plugins_url( 'js/wp-seo-dismissible' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'jquery' ), WPSEO_VERSION, true );
		}
	}
	/**
	 * Redirect first time or just upgraded users to the about screen.
	 */
	public function after_update_notice() {

		$can_access = is_multisite() ? WPSEO_Utils::grant_access() : current_user_can( 'manage_options' );

		if ( $can_access && $this->has_ignored_tour() && ! $this->seen_about() ) {

			if ( filter_input( INPUT_GET, 'intro' ) === '1' ) {
				update_user_meta( get_current_user_id(), 'wpseo_seen_about_version' , WPSEO_VERSION );

				return;
			}
			/* translators: %1$s expands to Yoast SEO, $2%s to the version number, %3$s and %4$s to anchor tags with link to intro page  */
			$info_message = sprintf(
				__( '%1$s has been updated to version %2$s. %3$sClick here%4$s to find out what\'s new!', 'wordpress-seo' ),
				'Yoast SEO',
				WPSEO_VERSION,
				'<a href="' . admin_url( 'admin.php?page=wpseo_dashboard&intro=1' ) . '">',
				'</a>'
			);

			$notification_options = array(
				'type' => 'updated',
				'id' => 'wpseo-dismiss-about',
				'nonce' => wp_create_nonce( 'wpseo-dismiss-about' ),
			);

			Yoast_Notification_Center::get()->add_notification( new Yoast_Notification( $info_message, $notification_options ) );
		}
	}

	/**
	 * Helper to verify if the current user has already seen the about page for the current version
	 *
	 * @return bool
	 */
	private function seen_about() {
		return get_user_meta( get_current_user_id(), 'wpseo_seen_about_version', true ) === WPSEO_VERSION;
	}

	/**
	 * Notify about the default tagline if the user hasn't changed it
	 */
	public function tagline_notice() {
		if ( current_user_can( 'manage_options' ) && $this->has_default_tagline() && ! $this->seen_tagline_notice() ) {

			// Only add the notice on GET requests, not in the customizer, and not in "action" type submits to prevent faulty return url.
			if ( 'GET' !== filter_input( INPUT_SERVER, 'REQUEST_METHOD' ) || is_customize_preview() || null !== filter_input( INPUT_GET, 'action' ) ) {
				return;
			}

			$current_url = ( is_ssl() ? 'https://' : 'http://' );
			$current_url .= sanitize_text_field( $_SERVER['SERVER_NAME'] ) . sanitize_text_field( $_SERVER['REQUEST_URI'] );
			$customize_url = add_query_arg( array(
				'url' => urlencode( $current_url ),
			), wp_customize_url() );

			$info_message = sprintf(
				__( 'You still have the default WordPress tagline, even an empty one is probably better. %1$sYou can fix this in the customizer%2$s.', 'wordpress-seo' ),
				'<a href="' . esc_attr( $customize_url ) . '">',
				'</a>'
			);

			$notification_options = array(
				'type'  => 'error',
				'id'    => 'wpseo-dismiss-tagline-notice',
				'nonce' => wp_create_nonce( 'wpseo-dismiss-tagline-notice' ),
			);

			Yoast_Notification_Center::get()->add_notification( new Yoast_Notification( $info_message, $notification_options ) );
		}
	}

	/**
	 * Returns whether or not the site has the default tagline
	 *
	 * @return bool
	 */
	public function has_default_tagline() {
		return __( 'Just another WordPress site' ) === get_bloginfo( 'description' );
	}

	/**
	 * Returns whether or not the user has seen the tagline notice
	 *
	 * @return bool
	 */
	public function seen_tagline_notice() {
		return 'seen' === get_user_meta( get_current_user_id(), 'wpseo_seen_tagline_notice', true );
	}

	/**
	 * Shows a notice to the user if they have Google Analytics for WordPress 5.4.3 installed because it causes an error
	 * on the google search console page.
	 */
	public function ga_compatibility_notice() {
		if ( defined( 'GAWP_VERSION' ) && '5.4.3' === GAWP_VERSION ) {

			$info_message = sprintf(
				/* translators: %1$s expands to Yoast SEO, %2$s expands to 5.4.3, %3$s expands to Google Analytics by Yoast */
				__( '%1$s detected you are using version %2$s of %3$s, please update to the latest version to prevent compatibility issues.', 'wordpress-seo' ),
				'Yoast SEO',
				'5.4.3',
				'Google Analytics by Yoast'
			);

			$notification_options = array(
				'type' => 'error',
			);

			Yoast_Notification_Center::get()->add_notification( new Yoast_Notification( $info_message, $notification_options ) );
		}
	}

	/**
	 * Shows the notice for recalculating the post. the Notice will only be shown if the user hasn't dismissed it before.
	 */
	public function recalculate_notice() {
		$can_access = is_multisite() ? WPSEO_Utils::grant_access() : current_user_can( 'manage_options' );
		if ( $can_access && ! $this->is_site_notice_dismissed( 'wpseo_dismiss_recalculate' ) ) {
			Yoast_Notification_Center::get()->add_notification(
				new Yoast_Notification(
					/* translators: 1: is a link to 'admin_url / admin.php?page=wpseo_tools&recalculate=1' 2: closing link tag */
					sprintf(
						__( 'We\'ve updated our SEO score algorithm. %1$sClick here to recalculate the SEO scores%2$s for all posts and pages.', 'wordpress-seo' ),
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
				'glotpress_url'  => 'https://translate.yoast.com/',
				'glotpress_name' => 'Yoast Translate',
				'glotpress_logo' => 'https://cdn.yoast.com/wp-content/uploads/i18n-images/Yoast_Translate.svg',
				'register_url'   => 'https://translate.yoast.com/projects#utm_source=plugin&utm_medium=promo-box&utm_campaign=wpseo-i18n-promo',
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
	private function has_ignored_tour() {
		$user_meta = get_user_meta( get_current_user_id(), 'wpseo_ignore_tour' );

		return ! empty( $user_meta );
	}

	/**
	 * Listener for the ignore tour GET value. If this one is set, just set the user meta to true.
	 */
	public function ignore_tour() {
		if ( filter_input( INPUT_GET, 'wpseo_ignore_tour' ) && wp_verify_nonce( filter_input( INPUT_GET, 'nonce' ), 'wpseo-ignore-tour' ) ) {
			update_user_meta( get_current_user_id(), 'wpseo_ignore_tour', true );
		}

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
}
