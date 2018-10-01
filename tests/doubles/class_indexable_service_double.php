<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Indexable_Service_Double extends WPSEO_Indexable_Service {

	/**
	 * @inheritdoc
	 */
	public function get_provider( $object_type ) {
		return parent::get_provider( $object_type );
	}

	/**
	 * @inheritdoc
	 */
	public function handle_unknown_object_type( $object_type ) {
		return parent::handle_unknown_object_type( $object_type );
	}
}
