<?php

class WPSEO_Multi_Keyword {

	public function __construct() {
		add_filter( 'wpseo_metabox_entries_general', array( $this, 'add_focus_keywords_input') );
		add_action( 'admin_footer', array( $this, 'keyword_tab' ) );
		add_action( 'admin_footer', array( $this, 'add_keyword_button' ) );
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
		wp_enqueue_script( 'wp-seo-premium-multi-keyword', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/wp-seo-premium-multi-keyword' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION );
	}

	/**
	 * Keyword tab for enabling analysis of multiple keywords.
	 */
	public function keyword_tab() {
		echo '<script type="text/html" id="tmpl-keyword_tab">
				<li class="wpseo_keyword_tab">
					<a class="wpseo_tablink" href="#wpseo_content" data-keyword="{{data.keyword}}" data-score="{{data.score}}">
						<span class="wpseo-score-icon {{data.score}}">
							<span class="screen-reader-text"></span>
						</span>
						<em><span class="wpseo_keyword">{{data.placeholder}}</span></em>
					</a>
					<a href="#" class="remove-keyword"><span>x</span></a>
				</li>
			</script>';
	}

	public function add_keyword_button() {
		echo '<script type="text/html" id="tmpl-add_keyword_button">
				<li class="wpseo-add-tab">
					<a class="add-keyword" href="#">
						<span style="height: 3px; padding: 0px 3px; border: 1px solid #ccc; font-size: 10px; text-decoration: none; color: #000;">+</span>
					</a>
				</li>
			</script>';
	}
}