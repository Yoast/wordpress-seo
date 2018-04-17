<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Links
 */

/**
 * Tests for the reindex dashboard.
 */
class WPSEO_Link_Reindex_Dashboard_Test extends PHPUnit_Framework_TestCase {

	/**
	 * Tests if unprocessed works as expected.
	 */
	public function test_unprocessed() {
		$instance = new WPSEO_Link_Reindex_Dashboard_Double();
		$instance->set_unprocessed( 1 );

		$this->assertTrue( $instance->has_unprocessed() );

		$instance->set_unprocessed( 0 );

		$this->assertFalse( $instance->has_unprocessed() );
	}

	/**
	 * Tests if the unprocessed count is presented as expected.
	 */
	public function test_get_unprocessed_count() {
		$instance = new WPSEO_Link_Reindex_Dashboard_Double();
		$instance->set_unprocessed( 1 );

		$this->assertEquals( 1, $instance->get_unprocessed_count() );
	}
}
