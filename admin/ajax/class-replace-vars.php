<?php

/**
 * Created by PhpStorm.
 * User: andy
 * Date: 04/02/16
 * Time: 10:33
 */
class WPSEO_Replace_Vars_Ajax {
	/**
	 * Initialize the AJAX hooks
	 */
	public function __construct() {
		add_action( 'wp_ajax_wpseo_replace_category', array( $this, 'replace_category' ) );
	}

	/**
	 * Fetch the categories
	 */
	public function replace_category() {
		check_ajax_referer( 'wpseo-replace-vars', 'nonce' );

		$needed_categories = filter_input( INPUT_POST, 'data', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
		$parsed_categories = array();
		foreach( $needed_categories as $category_id ) {
			$category = get_category( $category_id );

			$parsed_categories[] = array(
				'id'   => $category_id,
				'name' => $category->name,
			);
		}

		wp_die( wp_json_encode( $parsed_categories ) );
	}
}