<?php
/**
 * @package    WPSEO
 * @subpackage Admin
 */

/**
 * Performs the load on admin side.
 */
class WPSEO_Admin_Init {

	/**
	 * Holds the WP SEO Options
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

		$this->load_meta_boxes();
		$this->load_taxonomy_class();
		$this->load_admin_page_class();
		$this->load_admin_user_class();
		$this->load_yoast_tracking();
		$this->load_tour();
		$this->load_xml_sitemaps_admin();
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
		$page = filter_input( INPUT_GET, 'page' );
		if ( 'admin.php' === $this->pagenow && strpos( $page, 'wpseo' ) === 0 ) {
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
	function register_i18n_promo_class() {
		new yoast_i18n(
			array(
				'textdomain'     => 'wordpress-seo',
				'project_slug'   => 'wordpress-seo',
				'plugin_name'    => 'WordPress SEO by Yoast',
				'hook'           => 'wpseo_admin_footer',
				'glotpress_url'  => 'http://translate.yoast.com/',
				'glotpress_name' => 'Yoast Translate',
				'glotpress_logo' => 'https://cdn.yoast.com/wp-content/uploads/i18n-images/Yoast_Translate.svg',
				'register_url'   => 'http://translate.yoast.com/projects#utm_source=plugin&utm_medium=promo-box&utm_campaign=wpseo-i18n-promo',
			)
		);
	}

	/**
	 * Determine if we're allowed to load our tracking class and if so, load it.
	 */
	private function load_yoast_tracking() {
		if ( $this->options['yoast_tracking'] === true ) {
			/**
			 * @internal this is not a proper lean loading implementation (method_exist will autoload the class),
			 * but it can't be helped as there are other plugins out there which also use versions
			 * of the Yoast Tracking class and we need to take that into account unfortunately
			 */
			if ( method_exists( 'Yoast_Tracking', 'get_instance' ) ) {
				add_action( 'yoast_tracking', array( 'Yoast_Tracking', 'get_instance' ) );
			}
			else {
				$GLOBALS['yoast_tracking'] = new Yoast_Tracking;
			}
		}
	}

	/**
	 * See if we should start our tour.
	 */
	private function load_tour() {
		$restart_tour = filter_input( INPUT_GET, 'wpseo_restart_tour' );
		if ( $restart_tour ) {
			$this->options['ignore_tour'] = false;
			update_option( 'wpseo', $this->options );
		}

		if ( $this->options['tracking_popup_done'] === false || $this->options['ignore_tour'] === false ) {
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
}