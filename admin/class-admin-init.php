<?php

class WPSEO_Admin_Init {

	/**
	 * @var array
	 */
	private $options;

	/**
	 * Class constructor
	 */
	function __construct() {
	 	$this->options = WPSEO_Options::get_all();

		$GLOBALS['wpseo_admin'] = new WPSEO_Admin;

		$this->load_meta_boxes();
		$this->load_taxonomy_class();
		$this->load_admin_page_class();
		$this->load_yoast_tracking();
		$this->load_tour();
		$this->load_xml_sitemaps_admin();
	}

	private function load_meta_boxes() {
		global $pagenow;

		/**
		 * Filter: 'wpseo_always_register_metaboxes_on_admin' - Allow developers to change whether
		 * the WPSEO metaboxes are only registered on the typical pages (lean loading) or always
		 * registered when in admin.
		 *
		 * @api bool Whether to always register the metaboxes or not. Defaults to false.
		 */
		if ( in_array( $pagenow, array(
				'edit.php',
				'post.php',
				'post-new.php'
			) ) || apply_filters( 'wpseo_always_register_metaboxes_on_admin', false )
		) {
			$GLOBALS['wpseo_metabox'] = new WPSEO_Metabox;
			if ( $this->options['opengraph'] === true || $this->options['twitter'] === true || $this->options['googleplus'] === true ) {
				$GLOBALS['wpseo_social'] = new WPSEO_Social_Admin;
			}
		}
	}

	private function load_taxonomy_class() {
		global $pagenow;

		if ( 'edit-tags.php' === $pagenow ) {
			$GLOBALS['wpseo_taxonomy'] = new WPSEO_Taxonomy;
		}
	}

	private function load_admin_page_class() {
		global $pagenow;

		if ( 'admin.php' === $pagenow && isset( $_GET['page'] ) && strpos( $_GET['page'], 'wpseo' ) === 0 ) {
			$GLOBALS['wpseo_admin_pages'] = new WPSEO_Admin_Pages;
		}
	}

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

	private function load_tour() {
		if ( isset( $_GET['wpseo_restart_tour'] ) ) {
			$options['ignore_tour'] = false;
			update_option( 'wpseo', $options );
		}

		if ( $this->options['tracking_popup_done'] === false || $this->options['ignore_tour'] === false ) {
			add_action( 'admin_enqueue_scripts', array( 'WPSEO_Pointers', 'get_instance' ) );
		}
	}

	private function load_xml_sitemaps_admin() {
		if ( $this->options['enablexmlsitemap'] === true ) {
			$GLOBALS['wpseo_sitemaps_admin'] = new WPSEO_Sitemaps_Admin;
		}
	}
}