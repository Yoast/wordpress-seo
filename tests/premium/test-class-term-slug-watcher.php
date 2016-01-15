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

		$this->class_instance = new WPSEO_Term_Slug_Watcher();
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
	 * Test the result of the slug in case of the slug isn't used before.
	 *
	 * @covers: WPSEO_Term_Slug_Watcher::hook_unique_post_slug
	 * @covers: WPSEO_Term_Slug_Watcher::check_for_redirect
	 */
	public function test_with_non_existing_slug() {
		$term = $this->factory->term->create_and_get( array( 'slug' => 'non-existing', 'taxonomy' => 'category' ) );

		$this->assertEquals( 'non-existing', $term->slug );
	}

}
