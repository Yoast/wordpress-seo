<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Primary_Term_Admin_Double extends WPSEO_Primary_Term_Admin {

	/**
	 * @inheritdoc
	 */
	public function get_terms_for_taxonomy( $taxonomy ) {
		return parent::get_terms_for_taxonomy( $taxonomy );
	}

	/**
	 * @inheritdoc
	 */
	public function get_ancestors_for_term( $term_id ) {
		return parent::get_ancestors_for_term( $term_id );
	}
}
