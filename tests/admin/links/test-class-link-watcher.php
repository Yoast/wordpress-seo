<?php

class WPSEO_Link_Watcher_Test extends WPSEO_UnitTestCase {

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
	 * Test the is processable
	 */
	public function test_is_processable_post_revision() {

		$post_parent = $this->factory->post->create_and_get();
		$post = $this->factory->post->create_and_get(
			array( 'post_type' => 'revision', 'post_parent' => $post_parent->ID )
		);

		$processor = $this->get_processor();
		$processor
			->expects( $this->never() )
			->method( 'process' );

		$watcher = new WPSEO_Link_Watcher( $processor );
		$watcher->save_post( $post->ID, $post );
	}

	/**
	 * Test with a
	 */
	public function test_is_processable_draft() {

		$post = $this->factory->post->create_and_get(
			array( 'post_status' => 'draft' )
		);

		$processor = $this->get_processor();
		$processor
			->expects( $this->never() )
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
				'post_content' => ''
			));

		$processor = $this->get_processor();
		$processor
			->expects( $this->once() )
			->method( 'process' )
			->with( $post->ID, "" );

		$watcher = new WPSEO_Link_Watcher( $processor );
		$watcher->save_post( $post->ID, $post );
	}

	/**
	 * Test with a post with content..
	 */
	public function test_is_processable_with_content() {

		$post = $this->factory->post->create_and_get(
			array(
				'post_content' => 'This is content'
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

	public function test_delete_post() {
		$post = $this->factory->post->create_and_get(
			array(
				'post_content' => 'This is content that will be deleted'
			)
		);

		$link_to_save = new WPSEO_Link( 'http://example.com/page', 0, 'external' );

		$storage = new WPSEO_Link_Storage();
		$storage->save_links( $post->ID, array( $link_to_save ) );

		$this->assertNotEmpty( $storage->get_links( $post->ID ) );

		$watcher = new WPSEO_Link_Watcher( new WPSEO_Link_Content_Processor( $storage ) );
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
			->setConstructorArgs( array( new WPSEO_Link_Storage() ) )
			->setMethods( array( 'process' ) )
			->getMock();
	}

}