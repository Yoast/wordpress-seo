<?php

class WPSEO_Link_Column_Count_Test extends WPSEO_UnitTestCase {

	/**
	 * Creates the table to make sure the tests for this class can be executed.
	 */
	public function setUp() {
		parent::setUp();

		$installer = new WPSEO_Link_Installer();
		$installer->install();
	}

	/**
	 * Drops the table when all tests for this class are executed.
	 */
	public function tearDown() {
		global $wpdb;

		parent::tearDown();

		$storage = new WPSEO_Link_Storage();

		$wpdb->query( 'DROP TABLE ' . $storage->get_table_name() );
	}

	/**
	 * Test set with an empty array
	 */
	public function test_set_without_post_ids() {
		/** @var WPSEO_Link_Column_Count $column_count */
		$column_count = $this
			->getMockBuilder( 'WPSEO_Link_Column_Count' )
			->setMethods( array( 'get_results' ) )
			->getMock();

		$column_count
			->expects( $this->never() )
			->method( 'get_results' );

		$column_count->set( array() );
	}

	/**
	 * Test set with array containing one value
	 */
	public function test_set_with_post_ids() {
		/** @var WPSEO_Link_Column_Count $column_count */
		$column_count = $this
			->getMockBuilder( 'WPSEO_Link_Column_Count' )
			->setMethods( array( 'get_results' ) )
			->getMock();

		$column_count
			->expects( $this->once() )
			->method( 'get_results' )
			->will( $this->returnValue( array( 1 => array( 'post_id' => 1, 'total' => 10 ) ) ) );

		$column_count->set( array( 1 ) );
	}

	/**
	 * Test get with existing post id given.
	 */
	public function test_get_existing_post_id() {
		/** @var WPSEO_Link_Column_Count $column_count */
		$column_count = $this
			->getMockBuilder( 'WPSEO_Link_Column_Count' )
			->setMethods( array( 'get_results' ) )
			->getMock();

		$column_count
			->expects( $this->once() )
			->method( 'get_results' )
			->will(
				$this->returnValue(
					array(
						1 => array(
							'link_count' => 10,
							'internal_link_count' => 0,
						),
					)
				)
			);

		$column_count->set( array( 1 ) );

		$this->assertEquals( 10, $column_count->get( 1 ) );
	}

	/**
	 * Test get with non existing post id given
	 */
	public function test_get_non_existing_post_id() {
		/** @var WPSEO_Link_Column_Count $column_count */
		$column_count = $this
			->getMockBuilder( 'WPSEO_Link_Column_Count' )
			->setMethods( array( 'get_results' ) )
			->getMock();

		$column_count
			->expects( $this->once() )
			->method( 'get_results' )
			->will( $this->returnValue( array( 1 => array( 'post_id' => 1, 'total' => 10 ) ) ) );

		$column_count->set( array( 1 ) );

		$this->assertEquals( 0, $column_count->get( 2 ) );
	}

	/**
	 * Test get_results
	 */
	public function test_get_results() {
		$processor = new WPSEO_Link_Content_Processor( new WPSEO_Link_Storage(), new WPSEO_Link_Count_Storage() );
		$processor->process( 100, '<a href="internal-url">internal-url</a>' );


		$column_count = new WPSEO_Link_Column_Count();
		$column_count->set( array( 100 ) );

		$this->assertEquals( 1, $column_count->get( 100, 'link_count' ) );
	}
}
