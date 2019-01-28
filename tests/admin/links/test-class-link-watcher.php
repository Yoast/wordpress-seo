<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Links
 */

/**
 * Unit Test Class.
 */
class WPSEO_Link_Watcher_Test extends WPSEO_UnitTestCase {
	/**
	 * Store the post ID to be able to compare it in a filter.
	 *
	 * @var int
	 */
	private $the_content_post_id;

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
	 * Test the is processable
	 */
	public function test_is_processable_post_revision() {

		$post_parent = $this->factory->post->create_and_get();
		$post        = $this->factory->post->create_and_get(
			array(
				'post_type'   => 'revision',
				'post_parent' => $post_parent->ID,
			)
		);

		$processor = $this->get_processor();
		$processor
			->expects( $this->never() )
			->method( 'process' );

		$watcher = new WPSEO_Link_Watcher( $processor );
		$watcher->save_post( $post->ID, $post );
	}

	/**
	 * Don't process trash posts.
	 *
	 * @covers WPSEO_Link_Watcher::save_post()
	 */
	public function test_skip_trash_posts() {

		$post = self::factory()->post->create(
			array(
				'post_type' => 'post',
			)
		);

		wp_delete_post( $post );

		$post = get_post( $post );

		$processor = $this->get_processor();
		$processor
			->expects( $this->never() )
			->method( 'process' );

		$watcher = new WPSEO_Link_Watcher( $processor );
		$watcher->save_post( $post->ID, $post );
	}

	/**
	 * Test with a draft post.
	 *
	 * This should be processed, but will not be displayed.
	 * See https://github.com/Yoast/wordpress-seo/pull/8068#issuecomment-338146035
	 */
	public function test_is_processable_draft() {

		$post = $this->factory->post->create_and_get(
			array( 'post_status' => 'draft' )
		);

		$processor = $this->get_processor();
		$processor
			->expects( $this->once() )
			->method( 'process' );

		$watcher = new WPSEO_Link_Watcher( $processor );
		$watcher->save_post( $post->ID, $post );
	}

	/**
	 * Test with a none public posttype.
	 */
	public function test_is_processable_none_public_posttype() {
		register_post_type( 'hidden', array( 'public' => false ) );

		$post = $this->factory->post->create_and_get(
			array( 'post_type' => 'hidden' )
		);

		$processor = $this->get_processor();
		$processor
			->expects( $this->never() )
			->method( 'process' );

		$watcher = new WPSEO_Link_Watcher( $processor );
		$watcher->save_post( $post->ID, $post );
	}

	/**
	 * Test with a post not containing content.
	 */
	public function test_is_processable_without_content() {

		$post = $this->factory->post->create_and_get(
			array(
				'post_content' => '',
			)
		);

		$processor = $this->get_processor();
		$processor
			->expects( $this->once() )
			->method( 'process' )
			->with( $post->ID, '' );

		$watcher = new WPSEO_Link_Watcher( $processor );
		$watcher->save_post( $post->ID, $post );
	}

	/**
	 * Test with a post with content..
	 */
	public function test_is_processable_with_content() {

		$post = $this->factory->post->create_and_get(
			array(
				'post_content' => 'This is content',
			)
		);

		$processor = $this->get_processor();
		$processor
			->expects( $this->once() )
			->method( 'process' )
			->with( $post->ID, "<p>This is content</p>\n" );

		$watcher = new WPSEO_Link_Watcher( $processor );
		$watcher->save_post( $post->ID, $post );
	}

	/**
	 * Test deleting links when a post is deleted.
	 */
	public function test_delete_post() {
		$post = $this->factory->post->create_and_get(
			array(
				'post_content' => 'This is content that will be deleted',
			)
		);

		$link_to_save = new WPSEO_Link( 'http://example.com/page', 0, 'external' );

		$storage = new WPSEO_Link_Storage();
		$storage->save_links( $post->ID, array( $link_to_save ) );

		$this->assertNotEmpty( $storage->get_links( $post->ID ) );

		$watcher = new WPSEO_Link_Watcher( new WPSEO_Link_Content_Processor( $storage, new WPSEO_Meta_Storage() ) );
		$watcher->delete_post( $post->ID );

		$this->assertEmpty( $storage->get_links( $post->ID ) );
	}

	/**
	 * Makes sure the_content will have the needed content to properly function.
	 */
	public function test_the_content_filter() {
		$author = $this->factory->user->create_and_get(
			array( 'nicename' => 'test' )
		);

		// save_post
		$post = $this->factory->post->create_and_get(
			array(
				'post_content' => 'This is content',
				'post_author' => $author->ID,
			)
		);

		$this->the_content_post_id = $post->ID;

		$processor = new WPSEO_Link_Content_Processor( new WPSEO_Link_Storage(), new WPSEO_Meta_Storage() );

		add_filter( 'the_content', array( $this, 'filter_the_content' ) );

		$watcher = new WPSEO_Link_Watcher( $processor );
		$watcher->save_post( $post->ID, $post );

		// Cleanup.
		remove_filter( 'the_content', array( $this, 'filter_the_content' ) );
		unset( $this->the_content_post_id );
	}

	/**
	 * Makes sure process will restore the global post after running.
	 */
	public function test_the_content_filter_data_reset() {
		global $post;

		// Get the currently set global post.
		$post = get_post();
		// Store so we can see if it will be restored as it was before calling this.
		$original_post = $post;

		$created_post = $this->factory->post->create_and_get(
			array(
				'post_content' => 'This is content',
			)
		);

		$processor = new WPSEO_Link_Content_Processor( new WPSEO_Link_Storage(), new WPSEO_Meta_Storage() );

		$watcher = new WPSEO_Link_Watcher( $processor );
		$watcher->save_post( $created_post->ID, $created_post );

		$this->assertEquals( $post, $original_post, 'The global post should be restored as before the filter.' );
	}

	/**
	 * Filters the_content when a post is saved and processed.
	 *
	 * This assumes the same context as if we are in "The Loop".
	 *
	 * @param string $content The content to filter.
	 *
	 * @return string The filtered content.
	 */
	public function filter_the_content( $content ) {
		global $post;

		$current_post = get_post( $this->the_content_post_id );

		$this->assertEquals( $post->ID, $current_post->ID );
		$this->assertEquals( get_the_title(), get_the_title( $current_post->ID ) );

		// Test other globals being setup properly ($authordata).
		$this->assertEquals( get_the_author_meta( 'ID' ), $current_post->post_author );

		return $content;
	}

	/**
	 * Returns an 'instance' of the content processor.
	 *
	 * @return PHPUnit_Framework_MockObject_MockObject
	 */
	protected function get_processor() {
		return $this
			->getMockBuilder( 'WPSEO_Link_Content_Processor' )
			->setConstructorArgs( array( new WPSEO_Link_Storage(), new WPSEO_Meta_Storage() ) )
			->setMethods( array( 'process' ) )
			->getMock();
	}
}
