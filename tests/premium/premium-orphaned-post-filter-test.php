<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for the orphaned post filter.
 */
class WPSEO_Premium_Orphaned_Post_Filter_Test extends WPSEO_UnitTestCase {

	/** @var WPSEO_Premium_Orphaned_Post_Filter */
	protected $class_instance;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance =
			$this
				->getMockBuilder( 'WPSEO_Premium_Orphaned_Post_Filter' )
				->setMethods( array( 'filter_published_posts', 'get_where_filter', 'is_filter_active' ) )
				->getMock();
	}

	/**
	 * Tests if filter_posts() correctly passes through all steps when is_filter_active() is true.
	 *
	 * @covers WPSEO_Premium_Orphaned_Post_Filter::filter_posts
	 */
	public function test_filter_posts_unpublished_posts() {

		$this->class_instance
			->expects( $this->once() )
			->method( 'is_filter_active' )
			->will( $this->returnValue( true ) );

		$this->class_instance
			->expects( $this->once() )
			->method( 'filter_published_posts' )
			->will( $this->returnValue( 'filter_published_posts called' ) );

		$this->class_instance
			->expects( $this->once() )
			->method( 'get_where_filter' )
			->will( $this->returnValue( 'get_where_filter called' ) );

		$where = $this->class_instance->filter_posts( '' );

		$this->assertContains( 'filter_published_posts called', $where );
		$this->assertContains( 'get_where_filter called', $where );
	}

	/**
	 * Tests if filter_posts() correctly returns $where when is_filter_active() is false.
	 *
	 * @covers WPSEO_Premium_Orphaned_Post_Filter::filter_posts
	 */
	public function test_filter_posts_unpublished_posts_deel_2() {

		$this->class_instance
			->expects( $this->once() )
			->method( 'is_filter_active' )
			->will( $this->returnValue( false ) );

		$this->class_instance
			->expects( $this->never() )
			->method( 'filter_published_posts' );

		$this->class_instance
			->expects( $this->never() )
			->method( 'get_where_filter' );

		$where = $this->class_instance->filter_posts( '' );

		$this->assertEquals( '', $where );
	}

	/**
	 * Tests if filter_published_posts() returns correct string.
	 *
	 * @covers WPSEO_Premium_Orphaned_Post_Filter::filter_published_posts
	 */
	public function test_filter_published_posts() {

		$class_instance = new WPSEO_Premium_Orphaned_Post_Filter_Double();

		global $wpdb;

		$expected = " AND $wpdb->posts.post_status = 'publish' AND $wpdb->posts.post_password = ''";
		$actual = $class_instance->filter_published_posts();

		$this->assertequals( $expected, $actual );
	}
}
