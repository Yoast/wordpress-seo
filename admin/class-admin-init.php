<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Performs the load on admin side.
 */
class WPSEO_Admin_Init {

	/**
	 * Holds the Yoast Options
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

		$this->load_meta_boxes();
		$this->load_taxonomy_class();
		$this->load_admin_page_class();
		$this->load_admin_user_class();
		$this->ignore_tour();
		$this->load_tour();
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
		if ( current_user_can( 'manage_options' ) && ! $this->seen_about() ) {

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
		/**
		 * Filter: 'wpseo_always_register_metaboxes_on_admin' - Allow developers to change whether
		 * the WPSEO metaboxes are only registered on the typical pages (lean loading) or always
		 * registered when in admin.
		 *
		 * @api bool Whether to always register the metaboxes or not. Defaults to false.
		 */
		if ( in_array( $this->pagenow, array(
				'edit.php',
				'post.php',
				'post-new.php',
			) ) || apply_filters( 'wpseo_always_register_metaboxes_on_admin', false )
		) {
			$GLOBALS['wpseo_metabox'] = new WPSEO_Metabox;
			if ( $this->options['opengraph'] === true || $this->options['twitter'] === true || $this->options['googleplus'] === true ) {
				new WPSEO_Social_Admin;
			}
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
		if ( in_array( $this->pagenow, array( 'user-edit.php', 'profile.php' ) ) ) {
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
	private function load_tour() {
		$restart_tour = filter_input( INPUT_GET, 'wpseo_restart_tour' );
		if ( $restart_tour ) {
			delete_user_meta( get_current_user_id(), 'wpseo_ignore_tour' );
		}

		if ( ! get_user_meta( get_current_user_id(), 'wpseo_ignore_tour' ) ) {
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
	 * Listener for the ignore tour GET value. If this one is set, just set the user meta to true.
	 */
	private function ignore_tour() {
		if ( filter_input( INPUT_GET, 'wpseo_ignore_tour' ) && wp_verify_nonce( filter_input( INPUT_GET, 'nonce' ), 'wpseo-ignore-tour' ) ) {
			update_user_meta( get_current_user_id(), 'wpseo_ignore_tour', true );
		}

	}
}
