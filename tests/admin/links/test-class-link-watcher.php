<?php
/**
 * @package WPSEO\Tests\Admin\Links
 */

/**
 * Unit Test Class.
 */
class WPSEO_Link_Watcher_Test extends WPSEO_UnitTestCase {

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
	}

	/**
	 * Makes sure the expected actions are hooked.
	 *
	 * @covers WPSEO_Link_Watcher::register_hooks()
	 */
	public function test_register_hooks() {
		$link_watcher = new WPSEO_Link_Watcher( $this->get_processor() );
		$link_watcher->register_hooks();

		$this->assertNotFalse( has_action( 'save_post', array( $link_watcher, 'save_post' ) ) );
		$this->assertNotFalse( has_action( 'delete_post', array( $link_watcher, 'delete_post' ) ) );
	}

	/**
	 * Makes sure in-accessible table result in expected function calls.
	 *
	 * @covers WPSEO_Link_Watcher::save_post()
	 */
	public function test_tables_not_accessible_save_post() {
		$post = $this->factory->post->create_and_get();

		$watcher_mock = $this
			->getMockBuilder( 'WPSEO_Link_Watcher' )
			->setConstructorArgs( array( $this->get_processor() ) )
			->setMethods( array( 'tables_accessible', 'process' ) )
			->getMock();

		$watcher_mock
			->expects( $this->once() )
			->method( 'tables_accessible' )
			->will( $this->returnValue( false ) );

		$watcher_mock
			->expects( $this->never() )
			->method( 'process' );

		$watcher_mock->save_post( $post->ID, $post );
	}

	/**
	 * Makes sure accessible table result in expected function calls.
	 *
	 * @covers WPSEO_Link_Watcher::save_post()
	 */
	public function test_tables_accessible_save_post() {
		$post = $this->factory->post->create_and_get();

		$content_processor = $this
			->getMockBuilder( 'WPSEO_Link_Content_Processor' )
			->setConstructorArgs( array( new WPSEO_Link_Storage(), new WPSEO_Meta_Storage() ) )
			->setMethods( array( 'get_stored_internal_links' ) )
			->getMock();

		$watcher_mock = $this
			->getMockBuilder( 'WPSEO_Link_Watcher' )
			->setConstructorArgs( array( $content_processor ) )
			->setMethods( array( 'tables_accessible', 'process' ) )
			->getMock();

		$watcher_mock
			->expects( $this->once() )
			->method( 'tables_accessible' )
			->will( $this->returnValue( true ) );

		$content_processor
			->expects( $this->never() )
			->method( 'get_stored_internal_links' );


		$watcher_mock->save_post( $post->ID, $post );
	}

	/**
	 * Makes sure accessible tables result in expected function calls.
	 *
	 * @covers WPSEO_Link_Watcher::delete_post()
	 */
	public function test_tables_accessible_delete_post() {
		$post = $this->factory->post->create_and_get();

		$content_processor = $this
			->getMockBuilder( 'WPSEO_Link_Content_Processor' )
			->setConstructorArgs( array( new WPSEO_Link_Storage(), new WPSEO_Meta_Storage() ) )
			->setMethods( array( 'get_stored_internal_links' ) )
			->getMock();

		$watcher_mock = $this
			->getMockBuilder( 'WPSEO_Link_Watcher' )
			->setConstructorArgs( array( $content_processor ) )
			->setMethods( array( 'tables_accessible', 'process' ) )
			->getMock();

		$watcher_mock
			->expects( $this->once() )
			->method( 'tables_accessible' )
			->will( $this->returnValue( true ) );


		$content_processor
			->expects( $this->once() )
			->method( 'get_stored_internal_links' )
			->will( $this->returnValue( array() ) );

		$watcher_mock->delete_post( $post->ID, $post );
	}

	/**
	 * Makes sure in-accessible tables result in function calls not being executed.
	 *
	 * @covers WPSEO_Link_Watcher::delete_post()
	 */
	public function test_tables_not_accessible_delete_post() {
		$post = $this->factory->post->create_and_get();

		$content_processor = $this
			->getMockBuilder( 'WPSEO_Link_Content_Processor' )
			->setConstructorArgs( array( new WPSEO_Link_Storage(), new WPSEO_Meta_Storage() ) )
			->setMethods( array( 'get_stored_internal_links' ) )
			->getMock();

		$watcher_mock = $this
			->getMockBuilder( 'WPSEO_Link_Watcher' )
			->setConstructorArgs( array( $content_processor ) )
			->setMethods( array( 'tables_accessible', 'process' ) )
			->getMock();

		$watcher_mock
			->expects( $this->once() )
			->method( 'tables_accessible' )
			->will( $this->returnValue( false ) );


		$content_processor
			->expects( $this->never() )
			->method( 'get_stored_internal_links' );

		$watcher_mock->delete_post( $post->ID, $post );
	}

	/**
	 * Test the is processable
	 *
	 * @covers WPSEO_Link_Watcher::save_post()
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
	 * Makes sure `auto-draft` objects are not processed.
	 *
	 * @covers WPSEO_Link_Watcher::save_post()
	 */
	public function test_is_processable_post_auto_draft() {

		$post = $this->factory->post->create_and_get(
			array(
				'post_status' => 'auto-draft',
				'post_type'   => 'post',
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
	 * Makes sure the `save_post` hook is unhooked when it is currently hooked.
	 *
	 * @covers WPSEO_Link_Watcher::save_post()
	 */
	public function test_no_save_post_hooked() {
		$post = $this->factory->post->create_and_get(
			array(
				'post_type' => 'post',
			)
		);

		$watcher_mock = $this
			->getMockBuilder( 'WPSEO_Link_Watcher' )
			->setConstructorArgs( array( $this->get_processor() ) )
			->setMethods( array( 'hook_save_post', 'unhook_save_post', 'process', 'is_save_post_hooked' ) )
			->getMock();

		$watcher_mock
			->expects( $this->once() )
			->method( 'is_save_post_hooked' )
			->will( $this->returnValue( true ) );

		$watcher_mock
			->expects( $this->once() )
			->method( 'hook_save_post' );

		$watcher_mock
			->expects( $this->once() )
			->method( 'process' );

		$watcher_mock
			->expects( $this->once() )
			->method( 'unhook_save_post' );

		$watcher_mock->save_post( $post->ID, $post );
	}

	/**
	 * Makes sure the hooks are not touched when already unhooked.
	 *
	 * @covers WPSEO_Link_Watcher::save_post()
	 */
	public function test_no_save_post_not_hooked() {
		$post = $this->factory->post->create_and_get();

		$watcher_mock = $this
			->getMockBuilder( 'WPSEO_Link_Watcher' )
			->setConstructorArgs( array( $this->get_processor() ) )
			->setMethods( array( 'hook_save_post', 'unhook_save_post', 'process', 'is_save_post_hooked' ) )
			->getMock();

		$watcher_mock
			->expects( $this->once() )
			->method( 'is_save_post_hooked' )
			->will( $this->returnValue( false ) );

		$watcher_mock
			->expects( $this->never() )
			->method( 'hook_save_post' );

		$watcher_mock
			->expects( $this->once() )
			->method( 'process' );

		$watcher_mock
			->expects( $this->never() )
			->method( 'unhook_save_post' );

		$watcher_mock->save_post( $post->ID, $post );
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
