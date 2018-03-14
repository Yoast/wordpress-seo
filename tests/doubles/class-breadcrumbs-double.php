<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Breadcrumbs_Double extends WPSEO_Breadcrumbs {

	/**
	 * Overrides the protected constructor in the parent.
	 */
	public function __construct() {

	}

	/**
	 * Returns the link url for the id.
	 *
	 * @param int $id ID.
	 *
	 * @return string
	 */
	public function get_link_url_for_id( $id ) {
		return parent::get_link_url_for_id( $id );
	}
}
