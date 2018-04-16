<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Links
 */

/**
 * Unit Test Class.
 */
class WPSEO_Link_Reindex_Post_Service_Test extends WPSEO_UnitTestCase {

	/**
	 * Testing the default situation without any unprocessed posts.
	 *
	 * @covers WPSEO_Link_Reindex_Post_Service::reindex()
	 * @covers WPSEO_Link_Reindex_Post_Service::process_posts()
	 * @covers WPSEO_Link_Reindex_Post_Service::is_processable()
	 * @covers WPSEO_Link_Reindex_Post_Service::get_unprocessed_posts()
	 */
	public function test_reindex() {
		$class_instance = new WPSEO_Link_Reindex_Post_Service();

		$this->assertEquals( new WP_REST_Response( 0 ), $class_instance->reindex() );
	}

	/**
	 * Testing the situation where the needed tables aren't accessible.
	 *
	 * @covers WPSEO_Link_Reindex_Post_Service::reindex()
	 */
	public function test_reindex_with_inaccessible_tables() {
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Link_Reindex_Post_Service' )
			->setMethods( array( 'is_processable' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'is_processable' )
			->will( $this->returnValue( false ) );

		$response = $class_instance->reindex();

		$this->assertEquals( new WP_REST_Response( 0 ), $response );
	}

	/**
	 * Tests the reindexing functionality with one 'unprocessed' post.
	 *
	 * @covers WPSEO_Link_Reindex_Post_Service::reindex()
	 * @covers WPSEO_Link_Reindex_Post_Service::process_posts()
	 * @covers WPSEO_Link_Reindex_Post_Service::is_processable()
	 * @covers WPSEO_Link_Reindex_Post_Service::process_post()
	 */
	public function test_reindex_with_posts() {
		$content_processor = $this->get_content_processor_mock();

		$content_processor
			->expects( $this->once() )
			->method( 'process' );

		$post = $this->factory()
			->post
			->create_and_get( array( 'post_content' => 'this is the content' ) );

		$class_instance = $this
			->getMockBuilder( 'WPSEO_Link_Reindex_Post_Service' )
			->setMethods( array( 'is_processable', 'get_unprocessed_posts', 'get_content_processor' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'is_processable' )
			->will( $this->returnValue( true ) );

		$class_instance
			->expects( $this->once() )
			->method( 'get_unprocessed_posts' )
			->will( $this->returnValue( array( $post ) ) );

		$class_instance
			->expects( $this->once() )
			->method( 'get_content_processor' )
			->will( $this->returnValue( $content_processor ) );

		$response = $class_instance->reindex();

		$this->assertEquals( new WP_REST_Response( 1 ), $response );
	}

	/**
	 * Tests the reindexing without any posts.
	 *
	 * @covers WPSEO_Link_Reindex_Post_Service::reindex()
	 */
	public function test_reindex_without_posts() {
		$content_processor = $this->get_content_processor_mock();

		$content_processor
			->expects( $this->never() )
			->method( 'process' );

		$class_instance = $this
			->getMockBuilder( 'WPSEO_Link_Reindex_Post_Service' )
			->setMethods( array( 'is_processable', 'get_unprocessed_posts', 'get_content_processor' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'is_processable' )
			->will( $this->returnValue( true ) );

		$class_instance
			->expects( $this->once() )
			->method( 'get_unprocessed_posts' )
			->will( $this->returnValue( array() ) );

		$class_instance
			->expects( $this->never() )
			->method( 'get_content_processor' )
			->will( $this->returnValue( $content_processor ) );

		$response = $class_instance->reindex();

		$this->assertEquals( new WP_REST_Response( 0 ), $response );
	}

	/**
	 * Returns a mock object for the WPSEO_Link_Content_Processor
	 *
	 * @return WPSEO_Link_Content_Processor The mock object.
	 */
	private function get_content_processor_mock() {
		return $this
			->getMockBuilder( 'WPSEO_Link_Content_Processor' )
			->setConstructorArgs( array( new WPSEO_Link_Storage(), new WPSEO_Meta_Storage() ) )
			->setMethods( array( 'process' ) )
			->getMock();
	}
}
