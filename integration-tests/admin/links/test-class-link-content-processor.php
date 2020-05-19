<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Links
 */

/**
 * Unit Test Class.
 */
class WPSEO_Link_Content_Processor_Test extends WPSEO_UnitTestCase {

	/**
	 * Creates the table to make sure the tests for this class can be executed.
	 */
	public static function setUpBeforeClass() {
		$installer = new WPSEO_Link_Installer();
		$installer->install();

		parent::setUpBeforeClass();
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
	 * Test link storage.
	 *
	 * @covers WPSEO_Link_Builder::build
	 */
	public function test_store_links() {

		$this->bypass_php74_mockbuilder_deprecation_warning();

		/** @var WPSEO_Link_Storage $storage */
		$storage = $this
			->getMockBuilder( 'WPSEO_Link_Storage' )
			->setMethods( [ 'cleanup', 'save_links' ] )
			->getMock();

		$storage
			->expects( $this->once() )
			->method( 'cleanup' )
			->with( 1 );

		$storage
			->expects( $this->once() )
			->method( 'save_links' )
			->with(
				1,
				[ new WPSEO_Link( 'http://example.org/post', 0, 'internal' ) ]
			);

		$processor = new WPSEO_Link_Builder( $storage, new WPSEO_Meta_Storage() );
		$processor->build( 1, "<a href='http://example.org/post'>example post</a>" );
	}
}
