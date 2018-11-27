<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Frontend
 */

/**
 * Unit Test Class.
 */
class WPSEO_Handle_404_Test extends WPSEO_UnitTestCase {

	/**
	 * @var Expose_WPSEO_Handle_404
	 */
	private static $class_instance;

	/**
	 * Sets the handle 404 object.
	 *
	 * @return void;
	 */
	public function setUp() {
		parent::setUp();

		// Creates instance of WPSEO_Handle_404 class.
		self::$class_instance = new Expose_WPSEO_Handle_404();
	}

	/**
	 * Tests main feeds
	 *
	 * @covers WPSEO_Handle_404::is_main_feed()
	 */
	public function test_main_feeds() {
		// Go to default feed.
		$this->go_to( get_feed_link() );

		$this->assertTrue( self::$class_instance->is_main_feed() );

		// Go to comment feed.
		$this->go_to( get_feed_link( 'comments_rss2' ) );

		$this->assertTrue( self::$class_instance->is_main_feed() );

		// Go to home page.
		$this->go_to_home();

		$this->assertFalse( self::$class_instance->is_main_feed() );
	}
}
