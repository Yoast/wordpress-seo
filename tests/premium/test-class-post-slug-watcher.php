<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing the post slug watcher
 */
class WPSEO_Post_Slug_Watcher_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Post_Slug_Watcher
	 */
	private $class_instance;

	/**
	 * Be sure there are some redirects.
	 */
	public function setUp() {
		parent::setUp();

		// Saving one redirect.
		$redirect_manager = new WPSEO_Redirect_Manager();
		$redirect_manager->create_redirect( new WPSEO_Redirect( 'redirected-slug', '', 410 ) );
		$redirect_manager->create_redirect( new WPSEO_Redirect( 'another-slug-2', '', 410 ) );
		$redirect_manager->save_redirects();

		$this->class_instance = new WPSEO_Post_Slug_Watcher();
	}

	/**
	 * Test if the action is set in the constructor.
	 *
	 * @covers WPSEO_Post_Slug_Watcher::__construct();
	 */
	public function test_setting_hook_in_constructor() {
		$this->assertEquals(
			10,
			has_action( 'wp_unique_post_slug', array( $this->class_instance, 'hook_unique_post_slug' ) )
		);
	}

	/**
	 * Test the result of the post_name in case of the slug isn't used before.
	 *
	 * @covers WPSEO_Post_Slug_Watcher::hook_unique_post_slug
	 * @covers WPSEO_Post_Slug_Watcher::check_for_redirect
	 */
	public function test_with_non_existing_slug() {
		$post = $this->factory->post->create_and_get( array( 'post_name' => 'non-existing' ) );

		$this->assertEquals(
			'non-existing',
			$post->post_name
		);

	}

	/**
	 * Test the result of the post_name in case of the slug isn't used before.
	 *
	 * Expected result is a suffix of -2 added by WordPress
	 *
	 * @covers WPSEO_Post_Slug_Watcher::hook_unique_post_slug
	 * @covers WPSEO_Post_Slug_Watcher::check_for_redirect
	 */
	public function test_with_existing_slug() {
		$this->factory->post->create( array( 'post_name' => 'i-do-exist' ) );

		$post = $this->factory->post->create_and_get( array( 'post_name' => 'i-do-exist' ) );

		$this->assertEquals(
			'i-do-exist-2',
			$post->post_name
		);

	}

	/**
	 * Test the result of the post_name in case of the slug isn't used before.
	 *
	 * Expected result is a suffix of -2 added by the watcher
	 *
	 * @covers WPSEO_Post_Slug_Watcher::hook_unique_post_slug
	 * @covers WPSEO_Post_Slug_Watcher::check_for_redirect
	 * @covers WPSEO_Post_Slug_Watcher::get_suffix
	 */
	public function test_with_a_slug_being_redirected() {

		$post_id = $this->factory->post->create( array( 'post_name' => 'redirected-slug' ) );
		$post    = get_post( $post_id );

		$this->assertEquals(
			'redirected-slug-2',
			$post->post_name
		);

	}

	/**
	 * Test if the handling of a redirect will work fine for an existing redirect
	 *
	 * Expected result is a suffix of -2 added by the WordPress and -3 after it added by that wather
	 *
	 * @covers WPSEO_Post_Slug_Watcher::hook_unique_post_slug
	 * @covers WPSEO_Post_Slug_Watcher::check_for_redirect
	 * @covers WPSEO_Post_Slug_Watcher::get_suffix
	 */
	public function test_with_an_new_slug_that_will_be_redirected() {
		$this->factory->post->create( array( 'post_name' => 'another-slug' ) );

		$post = $this->factory->post->create_and_get( array( 'post_name' => 'another-slug' ) );

		$this->assertEquals(
			'another-slug-3',
			$post->post_name
		);

	}


}
