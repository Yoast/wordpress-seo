<?php

class WPSEO_Link_Storage_Test extends WPSEO_UnitTestCase {

	/**
	 * Creates the table to make sure the tests for this class can be executed.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		$storage = new WPSEO_Link_Storage();
		$storage->create_table();
	}

	/**
	 * Drops the table when all tests for this class are executed.
	 */
	public static function tearDownAfterClass() {
		parent::tearDownAfterClass();

		global $wpdb;

		$storage = new WPSEO_Link_Storage();

		$wpdb->query( 'DROP TABLE ' . $storage->get_table_name() );
	}

	/**
	 * Tests the usage of a custom table prefix.
	 */
	public function test_table_prefix() {
		$storage = new WPSEO_Link_Storage( 'custom_prefix_' );

		$this->assertEquals( 'custom_prefix_yoast_seo_links', $storage->get_table_name() );
	}

	/**
	 * Tests the creation of the table.
	 */
	public function test_create_table() {
		$storage = new WPSEO_Link_Storage();

		$this->assertEquals( 1, $storage->create_table() );
	}

	/**
	 * Tests the saving of a link.
	 */
	public function test_save_link() {
		/** @var WPSEO_Link_Storage $storage */
		$storage = $this
			->getMockBuilder( 'WPSEO_Link_Storage' )
			->setMethods( array( 'save_link' ) )
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
			array(
				new WPSEO_Link( 'page', 0, 'outbound' )
			)
		);
	}
	/**
	 * Tests the cleanup for a given post id.
	 */
	public function test_cleanup() {
		$storage = new WPSEO_Link_Storage();
		$storage->save_links( 2, array( new WPSEO_Link( 'page2', 0, 'outbound' ) ) );

		$this->assertEquals( 1, $storage->cleanup( 2 ) );
	}


}