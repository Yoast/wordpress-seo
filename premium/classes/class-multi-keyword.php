<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Implements multi keyword int he admin.
 */
class WPSEO_Multi_Keyword {
	/**
	 * Constructor. Adds WordPress hooks.
	 */
	public function __construct() {
		add_filter( 'wpseo_metabox_entries_general', array( $this, 'add_focus_keywords_input' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Add field in which we can save multiple keywords
	 *
	 * @param array $field_defs The current fields definitions.
	 *
	 * @return array Field definitions with our added field.
	 */
	public function add_focus_keywords_input( $field_defs ) {
		if ( is_array( $field_defs ) ) {
			$field_defs['focuskeywords'] = array(
				'type' => 'hidden',
				'title' => 'focuskeywords',
			);
		}

		return $field_defs;
	}

	/**
	 * Enqueue multi keyword assets
	 */
	public function enqueue_assets() {
		wp_enqueue_style( 'wp-seo-premium-metabox', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/css/premium-metabox-331' . WPSEO_CSSJS_SUFFIX . '.css', array(), WPSEO_VERSION );
		wp_enqueue_script( 'wp-seo-premium-multi-keyword', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/wp-seo-premium-multi-keyword-341' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery', 'wp-util', 'underscore' ), WPSEO_VERSION );
	}
}
