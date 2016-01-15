<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing term slug watcher
 */
class WPSEO_Term_Slug_Watcher_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Term_Slug_Watcher
	 */
	private $class_instance;

	/**
	 * Be sure there are some redirects.
	 */
	public function setUp() {
		parent::setUp();

		// Saving one redirect.
		$redirect_manager = new WPSEO_Redirect_Manager();
		$redirect_manager->create_redirect( new WPSEO_Redirect( 'category/redirected-slug', '', 410 ) );
		$redirect_manager->create_redirect( new WPSEO_Redirect( 'category/another-slug-2', '', 410 ) );
		$redirect_manager->save_redirects();


		$this->class_instance = $this->getMock( 'WPSEO_Term_Slug_Watcher', array( 'get_term_slug' ) );

		$this->class_instance
			->expects( $this->any() )
			->method( 'get_term_slug' )
			->will( $this->returnCallback( array( $this, 'mock_get_term_slug' ) ) );
	}

	/**
	 * Test if the action is set in the constructor.
	 *
	 * @covers: WPSEO_Term_Slug_Watcher::__construct();
	 */
	public function test_setting_hook_in_constructor() {
		$this->assertEquals(
			10,
			has_action( 'edited_terms', array( $this->class_instance, 'hook_make_term_slug_unique' ) )
		);
	}

	/**
	 * Test of the hook for the unique term being set. This will be the case when editing a term.
	 *
	 * @covers WPSEO_Term_Slug_Watcher::hook_make_term_slug_unique
	 * @covers WPSEO_Term_Slug_Watcher::hook_unique_term_slug
	 */
	public function test_wp_unique_term_slug_being_set() {
		$term = $this->factory->term->create_and_get( array( 'slug' => 'hook_call', 'taxonomy' => 'category' ) );

		wp_update_term( $term->term_id, 'category', array( 'slug' => 'non-hook_call' ) );

		$this->assertEquals(
			10,
			has_action( 'wp_unique_term_slug', array( $this->class_instance, 'hook_unique_term_slug' ) )
		);
	}

	/**
	 * Test the result of the slug in case of the slug isn't used before.
	 *
	 * @covers: WPSEO_Term_Slug_Watcher::hook_unique_term_slug
	 * @covers: WPSEO_Term_Slug_Watcher::check_for_redirect
	 */
	public function test_with_non_existing_slug() {
		$term = $this->factory->term->create_and_get( array( 'slug' => 'non-existing', 'taxonomy' => 'category' ) );

		$this->assertEquals( 'non-existing', $term->slug );
	}

	/**
	 * Test the result of the post_name in case of the slug isn't used before.
	 *
	 * Expected result is a suffix of -2 added by WordPress
	 *
	 * @covers WPSEO_Term_Slug_Watcher::hook_unique_term_slug
	 * @covers WPSEO_Term_Slug_Watcher::check_for_redirect
	 * @covers WPSEO_Term_Slug_Watcher::get_term_slug
	 */
	public function test_with_existing_slug() {
		$this->factory->term->create( array( 'slug' => 'i-do-exist' ) );

		$term = $this->factory->term->create_and_get( array( 'slug' => 'i-do-exist' ) );

		$this->assertEquals( 'i-do-exist-2', $term->slug );
	}

	/**
	 * Test the result of the term slug in case of the slug isn't used before.
	 *
	 * Expected result is a suffix of -2 added by the watcher
	 *
	 * @covers WPSEO_Term_Slug_Watcher::hook_unique_term_slug
	 * @covers WPSEO_Term_Slug_Watcher::hook_make_term_slug_unique
	 * @covers WPSEO_Term_Slug_Watcher::check_for_redirect
	 * @covers WPSEO_Term_Slug_Watcher::get_term_slug
	 * @covers WPSEO_Term_Slug_Watcher::get_suffix
	 */
	public function test_with_a_slug_being_redirected() {
		$term = $this->factory->term->create_and_get( array( 'slug' => 'redirected-slug', 'taxonomy' => 'category' ) );

		wp_update_term( $term->term_id, 'category', array( 'slug' => 'redirected-slug' ) );

		$term = get_term( $term->term_id, 'category' );

		$this->assertEquals( 'redirected-slug-2', $term->slug );

	}



	/**
	 * Test if the handling of a redirect will work fine for an existing redirect
	 *
	 * Expected result is a suffix of -2 added by the WordPress and -3 after it added by that wather
	 *
	 * @covers WPSEO_Term_Slug_Watcher::hook_unique_term_slug
	 * @covers WPSEO_Term_Slug_Watcher::check_for_redirect
	 * @covers WPSEO_Term_Slug_Watcher::get_term_slug
	 * @covers WPSEO_Term_Slug_Watcher::get_suffix
	 */
	public function test_with_an_new_slug_that_will_be_redirected() {
		$this->factory->term->create( array( 'slug' => 'another-slug', 'taxonomy' => 'category' ) );

		$term = $this->factory->term->create_and_get( array( 'slug' => 'another-slug', 'taxonomy' => 'category' ) );

		wp_update_term( $term->term_id, 'category', array( 'name' => 'another-slug', 'slug' => '' ) );

		$term = get_term( $term->term_id, 'category' );

		$this->assertEquals(
			'another-slug-3',
			$term->slug
		);

	}



	/**
	 * Prepend category/ to the slug
	 *
	 * @param string $slug The slug to use.
	 *
	 * @return string
	 */
	public function mock_get_term_slug( $slug  ) {
		return 'category/' . $slug;
	}

}
