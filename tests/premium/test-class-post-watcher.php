<?php
/**
 * @package WPSEO\Tests\Premium
 */

/**
 * Unit Test Class.
 */
class WPSEO_Post_Watcher_Test extends WPSEO_UnitTestCase {

	/**
	 * This variable is instantiated in setUp() and is a mock object. This is used for future use in the tests
	 *
	 * @var WPSEO_Post_Watcher
	 */
	protected $class_instance;

	/**
	 * Mocking the post watcher
	 */
	public function setUp() {
		parent::setUp();
		$this->class_instance = $this
			->getMockBuilder( 'WPSEO_Post_Watcher' )
			->setMethods( array( 'get_old_url', 'set_undo_slug_notification', 'get_target_url' ) )
			->getMock();
	}

	/**
	 * set_notification should not be called if slugs stay the same
	 *
	 * @covers WPSEO_Post_Watcher::detect_slug_change
	 */
	public function test_detect_slug_change_NO_CHANGE_slug() {
		$this->class_instance
			->expects( $this->never() )
			->method( 'get_old_url' );

		$this->class_instance
			->expects( $this->never() )
			->method( 'set_undo_slug_notification' );


		$post = (object) array(
			'ID'          => 1,
			'post_name'   => '',
			'post_status' => 'publish',
			'post_name'   => 'Test Post',
		);

		$post_before = (object) array(
			'post_name' => 'Test Post',
		);

		$this->class_instance->detect_slug_change( 1, $post, $post_before );
	}

	/**
	 * set_notification should be called when the slug is changed
	*/
	public function test_detect_slug_change_slug_IS_CHANGED() {
		$this->class_instance
			->expects( $this->once() )
			->method( 'get_old_url' )
			->will( $this->returnValue( '/test/' ) );

		$this->class_instance
			->expects( $this->once() )
			->method( 'get_target_url' )
			->will( $this->returnValue( '/test2/' ) );

		$this->class_instance
			->expects( $this->once() )
			->method( 'set_undo_slug_notification' );

		$post = (object) array(
			'ID'          => 1,
			'post_name'   => '',
			'post_status' => 'publish',
			'post_name'   => 'test',
		);

		$post_before = (object) array(
			'post_name' => 'test2',
		);

		$this->class_instance->detect_slug_change( 1, $post, $post_before );
	}

	/**
	 * get_target_url and set_notification should not be called when post is not published
	 */
	public function test_detect_slug_change_slug_post_IS_NOT_published() {
		$this->class_instance
			->expects( $this->once() )
			->method( 'get_old_url' )
			->will( $this->returnValue( '/test/' ) );

		$this->class_instance
			->expects( $this->never() )
			->method( 'get_target_url' )
			->will( $this->returnValue( '/test2/' ) );

		$this->class_instance
			->expects( $this->never() )
			->method( 'set_undo_slug_notification' );

		$post = (object) array(
			'ID'          => 1,
			'post_name'   => '',
			'post_status' => 'draft',
			'post_name'   => 'test',
		);

		$post_before = (object) array(
			'post_status' => 'draft',
			'post_name'   => 'test2',
		);

		$this->class_instance->detect_slug_change( 1, $post, $post_before );
	}
}

