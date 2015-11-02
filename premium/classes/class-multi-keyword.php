<?php

class WPSEO_Multi_Keyword {

	public function __construct() {
		add_filter( 'wpseo_metabox_entries_general', array( $this, 'add_focus_keywords_input') );
		add_action( 'admin_footer', array( $this, 'keyword_tab' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets') );
	}

	public function add_focus_keywords_input( $field_defs ) {
		if ( is_array( $field_defs ) ) {
			$field_defs['focuskeywords'] = array(
				'type' => 'hidden',
				'title' => 'focuskeywords',
			);
		}

		return $field_defs;
	}

	public function enqueue_assets() {
		wp_enqueue_style( 'wp-seo-premium-metabox', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/css/premium-metabox' . WPSEO_CSSJS_SUFFIX . '.css', array(), WPSEO_VERSION );
		wp_enqueue_script( 'wp-seo-premium-multi-keyword', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/wp-seo-premium-multi-keyword' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery', 'wp-util' ), WPSEO_VERSION );
	}
}
