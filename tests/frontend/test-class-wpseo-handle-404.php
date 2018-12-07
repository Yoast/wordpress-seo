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
	}

	/**
	 * Tests wp conditionals on post comments feed.
	 */
	public function test_wp_conditionals_on_post_feed() {
		$post      = $this->factory->post->create_and_get();
		$feed_link = get_post_comments_feed_link( $post->ID );

		// Go to post comments feed.
		$this->go_to( $feed_link );

		// Verify the query object is a feed.
		$this->assertQueryTrue( 'is_comment_feed', 'is_feed', 'is_singular', 'is_single' );

		// Delete post.
		wp_delete_post( $post->ID );

		// Go to (deleted) post comments feed.
		$this->go_to( $feed_link );

		$this->assertFalse( is_feed() );
		$this->assertQueryTrue( 'is_404' );
	}

	/**
	 * Tests category feed.
	 *
	 * @covers WPSEO_Handle_404::is_main_feed()
	 * @covers WPSEO_Handle_404::is_feed_404()
	 */
	public function test_category_feed() {
		$this->run_test_on_term_feed( 'category' );
	}

	/**
	 * Tests tag feed.
	 *
	 * @covers WPSEO_Handle_404::is_main_feed()
	 * @covers WPSEO_Handle_404::is_feed_404()
	 */
	public function test_tag_feed() {
		$this->run_test_on_term_feed( 'post_tag' );
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
	 * Tests search (query string) feed.
	 *
	 * @covers WPSEO_Handle_404::is_main_feed()
	 * @covers WPSEO_Handle_404::is_feed_404()
	 */
	public function test_search_query_string_feed() {
		$this->go_to( '/?s=Lorem&feed=rss2' );

		$this->assertFalse( self::$class_instance->is_main_feed() );
		$this->assertFalse( self::$class_instance->is_feed_404( false ) );
	}

	/**
	 * Tests feed with query string.
	 *
	 * @covers WPSEO_Handle_404::is_main_feed()
	 * @covers WPSEO_Handle_404::is_feed_404()
	 */
	public function test_query_string_feed() {
		$this->go_to( '/?feed=rss2' );

		$this->assertTrue( self::$class_instance->is_main_feed() );
		$this->assertFalse( self::$class_instance->is_feed_404( false ) );
	}

	/**
	 * Runs tests for term feed.
	 *
	 * @param string $taxonomy The taxonomy to test.
	 */
	private function run_test_on_term_feed( $taxonomy ) {
		$term = $this->factory->term->create_and_get(
			array( 'taxonomy' => $taxonomy )
		);

		// Go to term feed.
		$feed_link = get_term_feed_link( $term->term_id, $term->taxonomy );
		$this->go_to( $feed_link );

		$this->assertFalse( self::$class_instance->is_main_feed() );
		$this->assertFalse( self::$class_instance->is_feed_404( false ) );

		// Delete term.
		wp_delete_term( $term->term_id, $term->taxonomy );
		clean_term_cache( $term->term_id, $term->taxonomy, false );

		// Go to term feed again.
		$this->go_to( $feed_link );

		$this->assertTrue( self::$class_instance->is_feed_404( false ) );
	}
}
