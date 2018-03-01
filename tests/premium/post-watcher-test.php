<?php
/**
 * WPSEO Premium plugin test file.
 *
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
			->setMethods( array(
				'get_old_url',
				'set_undo_slug_notification',
				'get_target_url',
				'is_redirect_relevant',
			) )
			->getMock();
	}

	/**
	 * Method `set_notification()` should not be called if slugs stay the same.
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
	 * Method `set_notification()` should be called when the slug is changed.
	 */
	public function test_detect_slug_change_slug_IS_CHANGED() {
		$post = (object) array(
			'ID'          => 1,
			'post_status' => 'publish',
			'post_name'   => 'test',
		);

		$post_before = (object) array(
			'post_name' => 'test2',
		);

		$this->class_instance
			->expects( $this->once() )
			->method( 'get_old_url' )
			->will( $this->returnValue( '/test/' ) );

		$this->class_instance
			->expects( $this->once() )
			->method( 'is_redirect_relevant' )
			->will( $this->returnValue( true ) );

		$this->class_instance
			->expects( $this->once() )
			->method( 'set_undo_slug_notification' );

		$this->class_instance->detect_slug_change( 1, $post, $post_before );
	}

	/**
	 * Methods `get_target_url()` and `set_notification()` should not be called when post is not published.
	 */
	public function test_detect_slug_change_slug_post_IS_NOT_published() {
		$post = (object) array(
			'ID'          => 1,
			'post_status' => 'draft',
		);

		$post_before = (object) array(
			'post_status' => 'draft',
		);

		$this->class_instance
			->expects( $this->once() )
			->method( 'is_redirect_relevant' )
			->will( $this->returnValue( true ) );

		$this->class_instance
			->expects( $this->never() )
			->method( 'set_undo_slug_notification' );

		$this->class_instance->detect_slug_change( 1, $post, $post_before );
	}

	/**
	 * Creates a redirect and then creates a post with a slug that overlaps with the redirect, this should remove the redirect.
	 */
	public function test_slug_changed_matching_redirect() {
		$redirect = new WPSEO_Redirect( 'to', 'from', 301, 'plain' );

		// Create a redirect manager
		$manager = new WPSEO_Redirect_Manager();
		$manager->create_redirect( $redirect );

		// Make sure we have pretty permalinks.
		update_option( 'permalink_structure', '/%postname%/' );

		// Assure the redirect is added.
		$this->assertEquals( 1, count( $manager->get_all_redirects() ) );

		// Prepare a post.
		$post_id = $this->factory->post->create(
			array(
				'post_title'  => 'fake post',
				'post_name'   => 'from',
				'post_status' => 'publish',
			)
		);

		$post = get_post( $post_id, ARRAY_A );

		// Add the post watcher, to trigger on the post save.
		$post_watcher = $this
			->getMockBuilder( 'WPSEO_Post_Watcher_Double' )
			->setMethods( array( 'post_redirect_can_be_made' ) )
			->getMock();

		$post_watcher
			->expects( $this->once() )
			->method( 'post_redirect_can_be_made' )
			->will( $this->returnValue( true ) );

		/** var WPSEO_Post_Watcher_Double $post_watcher */
		$post_watcher->set_hooks();

		// Save post with a new slug.
		$post['ID']        = $post_id;
		$post['post_name'] = 'to';

		wp_update_post( $post );

		$this->assertEmpty( $manager->get_all_redirects() );
	}

	/**
	 * Tests if a redirect is not deleted when no redirect is found.
	 *
	 * @covers WPSEO_Post_Watcher::remove_colliding_redirect
	 */
	public function test_no_redirect_exists_dont_delete_redirect() {
		$redirect_manager = $this
			->getMockBuilder( 'WPSEO_Redirect_Manager' )
			->setMethods( array( 'get_redirect', 'delete_redirects' ) )
			->getMock();

		$redirect_manager
			->expects( $this->once() )
			->method( 'get_redirect' )
			->will( $this->returnValue( false ) );


		$redirect_manager
			->expects( $this->never() )
			->method( 'delete_redirects' );

		$instance = new WPSEO_Post_Watcher_Double( $redirect_manager );
		$instance->remove_colliding_redirect( array(), array() );
	}

	/**
	 * Tests if a redirect is not deleted when the targets do not match.
	 *
	 * @covers WPSEO_Post_Watcher::remove_colliding_redirect
	 */
	public function test_target_from_before_does_match() {
		$post_before = (object) array(
			'post_name' => 'name',
		);

		$redirect_manager = $this
			->getMockBuilder( 'WPSEO_Redirect_Manager' )
			->setMethods( array( 'get_redirect', 'delete_redirects' ) )
			->getMock();

		$redirect_manager
			->expects( $this->once() )
			->method( 'get_redirect' )
			->will( $this->returnValue( new WPSEO_Redirect( '', 'name' ) ) );

		$redirect_manager
			->expects( $this->never() )
			->method( 'delete_redirects' );

		/** @var WPSEO_Post_Watcher_Double $instance */
		$instance = $this
			->getMockBuilder( 'WPSEO_Post_Watcher_Double' )
			->setMethods( array(
				'get_target_url',
			) )
			->setConstructorArgs( array( $redirect_manager ) )
			->getMock();

		$instance
			->expects( $this->exactly( 2 ) )
			->method( 'get_target_url' )
			->will( $this->returnValue( 'not_name' ) );

		$instance->remove_colliding_redirect( array(), $post_before );
	}

	/**
	 * Tests if a redirect is deleted when a redirect is found and the targets match.
	 *
	 * @covers WPSEO_Post_Watcher::remove_colliding_redirect
	 */
	public function test_redirect_being_deleted() {
		$post_before = (object) array(
			'post_name' => 'name',
		);

		$redirect_manager = $this
			->getMockBuilder( 'WPSEO_Redirect_Manager' )
			->setMethods( array( 'get_redirect', 'delete_redirects' ) )
			->getMock();

		$redirect_manager
			->expects( $this->once() )
			->method( 'get_redirect' )
			->will( $this->returnValue( new WPSEO_Redirect( '', 'name' ) ) );

		$redirect_manager
			->expects( $this->once() )
			->method( 'delete_redirects' );

		/** @var WPSEO_Post_Watcher_Double $instance */
		$instance = $this
			->getMockBuilder( 'WPSEO_Post_Watcher_Double' )
			->setMethods( array(
				'get_target_url',
			) )
			->setConstructorArgs( array( $redirect_manager ) )
			->getMock();

		$instance
			->expects( $this->exactly( 2 ) )
			->method( 'get_target_url' )
			->will( $this->returnValue( 'name' ) );

		$instance->remove_colliding_redirect( array(), $post_before );
	}
}
