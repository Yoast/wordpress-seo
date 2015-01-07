<?php

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

		global $pagenow;
		$this->pagenow = $pagenow;

		$this->load_meta_boxes();
		$this->load_taxonomy_class();
		$this->load_admin_page_class();
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
				'post-new.php'
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
		if ( 'edit-tags.php' === $this->pagenow && WPSEO_Admin_Util::filter_input( INPUT_GET, 'action' ) ) {
			new WPSEO_Taxonomy;
		}
	}

	/**
	 * Determine if we should load our admin pages class and if so, load it.
	 *
	 * Loads admin page class for all admin pages starting with `wpseo_`.
	 */
	private function load_admin_page_class() {
		$page = WPSEO_Admin_Util::filter_input( INPUT_GET, 'page' );
		if ( 'admin.php' === $this->pagenow && strpos( $page, 'wpseo' ) === 0 ) {
			$GLOBALS['wpseo_admin_pages'] = new WPSEO_Admin_Pages;
		}
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
			} else {
				$GLOBALS['yoast_tracking'] = new Yoast_Tracking;
			}
		}
	}

	/**
	 * See if we should start our tour.
	 */
	private function load_tour() {
		$restart_tour = WPSEO_Admin_Util::filter_input( INPUT_GET, 'wpseo_restart_tour' );
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