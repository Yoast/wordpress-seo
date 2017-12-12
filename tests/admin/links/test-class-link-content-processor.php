<?php
/**
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
	}

	/**
	 * Test link storage.
	 */
	public function test_store_links() {
		/** @var WPSEO_Link_Storage $storage */
		$storage = $this
			->getMockBuilder( 'WPSEO_Link_Storage' )
			->setMethods( array( 'cleanup', 'save_links', 'update_link_index_version' ) )
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
				array( new WPSEO_Link( 'http://example.org/post', 0, 'internal' ) )
			);

		/** @var WPSEO_Link_Content_Processor $storage */
		$processor = $this
			->getMockBuilder( 'WPSEO_Link_Content_Processor' )
			->setConstructorArgs( array( $storage, new WPSEO_Meta_Storage() ) )
			->setMethods( array( 'update_link_index_version' ) )
			->getMock();

		$processor
			->expects( $this->once() )
			->method( 'update_link_index_version' );

		$processor->process( 1, "<a href='http://example.org/post'>example post</a>" );
	}
}
