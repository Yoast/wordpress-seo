<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Links
 */

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Link_Storage
 */
class WPSEO_Link_Storage_Test extends WPSEO_UnitTestCase {

	/**
	 * Creates the table to make sure the tests for this class can be executed.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		$installer = new WPSEO_Link_Installer();
		$installer->install();
	}

	/**
	 * Drops the table when all tests for this class are executed.
	 */
	public static function tearDownAfterClass() {
		parent::tearDownAfterClass();

		global $wpdb;

		$storage      = new WPSEO_Link_Storage();
		$meta_storage = new WPSEO_Meta_Storage();

		$wpdb->query( 'DROP TABLE ' . $storage->get_table_name() );
		$wpdb->query( 'DROP TABLE ' . $meta_storage->get_table_name() );

		delete_transient( 'wpseo_link_table_inaccessible' );
		delete_transient( 'wpseo_meta_table_inaccessible' );
	}

	/**
	 * Tests the saving of a link.
	 *
	 * @covers ::save_links
	 */
	public function test_save_link() {

		$this->bypass_php74_mockbuilder_deprecation_warning();

		/** @var WPSEO_Link_Storage $storage */
		$storage = $this
			->getMockBuilder( 'WPSEO_Link_Storage' )
			->setMethods( [ 'save_link' ] )
			->getMock();

		$storage
			->expects( $this->once() )
			->method( 'save_link' )
			->with(
				new WPSEO_Link( 'page', 0, 'outbound' ),
				0,
				1
			);

		$storage->save_links(
			1,
			[
				new WPSEO_Link( 'page', 0, 'outbound' ),
			]
		);
	}

	/**
	 * Tests the cleanup for a given post id.
	 *
	 * @covers ::cleanup
	 */
	public function test_cleanup() {
		$storage = new WPSEO_Link_Storage();
		$storage->save_links( 2, [ new WPSEO_Link( 'page2', 0, 'outbound' ) ] );

		$this->assertEquals( 1, $storage->cleanup( 2 ) );
	}
}
