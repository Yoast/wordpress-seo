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

		// Reset permalink structure.
		$this->set_permalink_structure( '/%postname%/' );
		create_initial_taxonomies();

		// Creates instance of WPSEO_Handle_404 class.
		self::$class_instance = new Expose_WPSEO_Handle_404();
	}

	/**
	 * Tests main feeds.
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

	/**
	 * Tests post comments feed.
	 *
	 * @covers WPSEO_Handle_404::is_main_feed()
	 * @covers WPSEO_Handle_404::is_feed_404()
	 */
	public function test_post_feeds() {
		$post      = $this->factory->post->create_and_get();
		$feed_link = get_post_comments_feed_link( $post->ID );

		// Go to post comments feed.
		$this->go_to( $feed_link );

		$this->assertFalse( self::$class_instance->is_main_feed() );

		$this->assertFalse( self::$class_instance->is_feed_404( false ) );

		// Delete post.
		wp_delete_post( $post->ID );

		// Go to (deleted) post comments feed.
		$this->go_to( $feed_link );

		$this->assertTrue( self::$class_instance->is_feed_404( false ) );

		$this->assertFalse( is_feed() );
		$this->assertTrue( is_404() );
	}

	/**
	 * Tests archive feeds.
	 *
	 * @covers WPSEO_Handle_404::is_main_feed()
	 * @covers WPSEO_Handle_404::is_feed_404()
	 */
	public function test_archive_feeds() {
		$cat_args = array(
			'name' => 'Foo Category',
			'slug' => 'foo',
		);
		$tag_args = array(
			'name' => 'Bar Tag',
			'slug' => 'bar',
		);

		$category = $this->factory->category->create_and_get( $cat_args );
		$tag      = $this->factory->tag->create_and_get( $tag_args );

		// Go to category feed.
		$this->go_to( '/category/foo/feed/' );

		$this->assertFalse( self::$class_instance->is_main_feed() );
		$this->assertFalse( self::$class_instance->is_feed_404( false ) );

		// Go to tag feed.
		$this->go_to( '/tag/bar/feed/' );

		$this->assertFalse( self::$class_instance->is_main_feed() );
		$this->assertFalse( self::$class_instance->is_feed_404( false ) );

		// Go to non-existent category feed.
		$this->go_to( '/category/foo2/feed/' );

		$this->assertTrue( self::$class_instance->is_feed_404( false ) );

		$this->assertFalse( is_feed() );
		$this->assertTrue( is_404() );

		// Go to non-existent tag feed.
		$this->go_to( '/tag/bar2/feed/' );

		$this->assertTrue( self::$class_instance->is_feed_404( false ) );

		$this->assertFalse( is_feed() );
		$this->assertTrue( is_404() );

		// Delete terms.
		wp_delete_term( $category->term_id, 'category' );
		wp_delete_term( $tag->term_id, 'tag' );
	}

	/**
	 * Tests search feed.
	 *
	 * @covers WPSEO_Handle_404::is_main_feed()
	 * @covers WPSEO_Handle_404::is_feed_404()
	 */
	public function test_search_feed() {
		$this->go_to( get_search_feed_link( 'Lorem' ) );

		$this->assertFalse( self::$class_instance->is_main_feed() );
		$this->assertFalse( self::$class_instance->is_feed_404( false ) );
	}

	/**
	 * Tests feeds with query strings.
	 *
	 * @covers WPSEO_Handle_404::is_main_feed()
	 * @covers WPSEO_Handle_404::is_feed_404()
	 */
	public function test_query_string_feeds() {
		$this->go_to( '/?feed=rss2' );

		$this->assertTrue( self::$class_instance->is_main_feed() );
		$this->assertFalse( self::$class_instance->is_feed_404( false ) );

		$this->go_to( '/?s=Lorem&feed=rss2' );

		$this->assertFalse( self::$class_instance->is_main_feed() );
		$this->assertFalse( self::$class_instance->is_feed_404( false ) );
	}
}
