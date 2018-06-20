<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 */
class WPSEO_Admin_Recommended_Replace_Vars_Test extends WPSEO_UnitTestCase {

	/** @var WPSEO_Admin_Recommended_Replace_Vars */
	protected $class_instance;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_Admin_Recommended_Replace_Vars();
		add_filter( 'wpseo_recommended_replace_vars', array( $this, 'filter_recommended_replacevars' ) );
	}

	/**
	 * Tests that determine_for_term can detect a category.
	 *
	 * @covers WPSEO_Admin_Recommended_Replace_Vars::determine_for_term
	 */
	public function test_determine_for_term_with_a_category() {
		$this->assertEquals( 'category', $this->class_instance->determine_for_term( 'category' ) );
	}

	/**
	 * Tests that determine_for_term can detect a tag.
	 *
	 * @covers WPSEO_Admin_Recommended_Replace_Vars::determine_for_term
	 */
	public function test_determine_for_term_with_a_tag() {
		$this->assertEquals( 'post_tag', $this->class_instance->determine_for_term( 'post_tag' ) );
	}

	/**
	 * Tests that determine_for_term can detect a post_format.
	 *
	 * @covers WPSEO_Admin_Recommended_Replace_Vars::determine_for_term
	 */
	public function test_determine_for_term_with_a_post_format() {
		$this->assertEquals( 'post_format', $this->class_instance->determine_for_term( 'post_format' ) );
	}

	/**
	 * Tests that determine_for_post defaults to post when no actual post variable is passed along.
	 *
	 * @covers WPSEO_Admin_Recommended_Replace_Vars::determine_for_post
	 */
	public function test_determine_for_post_without_a_wp_post_instance() {
		$this->assertEquals( 'post', $this->class_instance->determine_for_post( null ) );
	}

	/**
	 * Tests that a homepage is succesfully determined.
	 *
	 * @covers WPSEO_Admin_Recommended_Replace_Vars::is_homepage
	 * @covers WPSEO_Admin_Recommended_Replace_Vars::determine_for_post
	 */
	public function test_determine_for_post_with_a_homepage() {
		// Backup the current values for these options.
		$show_on_front = get_option( 'show_on_front' );
		$page_on_front = get_option( 'page_on_front' );

		$post = $this->create_and_get_with_post_type( 'page' );

		// Overwrite the options used in the is_homepage function.
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $post->ID );

		$this->assertEquals( 'homepage', $this->class_instance->determine_for_post( $post ) );

		// Revert the options their original values.
		update_option( 'show_on_front', $show_on_front );
		update_option( 'page_on_front', $page_on_front );
	}

	/**
	 * Tests that determine_for_post can detect a page.
	 *
	 * @covers WPSEO_Admin_Recommended_Replace_Vars::determine_for_post
	 */
	public function test_determine_for_post_with_a_page() {
		$post = $this->create_and_get_with_post_type( 'page' );

		$this->assertEquals( 'page', $this->class_instance->determine_for_post( $post ) );
	}

	/**
	 * Tests that determine_for_post can detect a post.
	 *
	 * @covers WPSEO_Admin_Recommended_Replace_Vars::determine_for_post
	 */
	public function test_determine_for_post_with_a_post() {
		$post = $this->create_and_get_with_post_type( 'post' );

		$this->assertEquals( 'post', $this->class_instance->determine_for_post( $post ) );
	}

	/**
	 * Tests that determine_for_post can detect a custom post type.
	 *
	 * @covers WPSEO_Admin_Recommended_Replace_Vars::determine_for_post
	 */
	public function test_determine_for_post_with_a_custom_post_type() {
		$post = $this->create_and_get_with_post_type( 'some_plugin_post' );

		$this->assertEquals( 'custom_post_type', $this->class_instance->determine_for_post( $post ) );
	}

	/**
	 * Tests that get_recommended_replacevars works for the settings.
	 *
	 * @dataProvider get_recommended_replacevars_provider
	 *
	 * @param string $page_type The page type to get the recommended replacement variables for.
	 * @param array  $expected  The expected recommended replacement variables.
	 *
	 * @covers       WPSEO_Admin_Recommended_Replace_Vars::get_recommended_replacevars_for
	 */
	public function test_get_recommended_replacevars( $page_type, $expected ) {
		$this->assertEquals( $expected, $this->class_instance->get_recommended_replacevars_for( $page_type ) );
	}

	/**
	 * Dataprovider function for the test: test_get_recommended_replacevars
	 *
	 * @return array With the $page_type and $expected variables.
	 */
	public function get_recommended_replacevars_provider() {
		// This is basically a copy of the $recommended_replace_vars in WPSEO_Admin_Recommended_Replace_Vars.
		return array(
			// Posts.
			array( 'page', array( 'sitename', 'title', 'sep', 'primary_category' ) ),
			array( 'post', array( 'sitename', 'title', 'sep', 'primary_category' ) ),
			// Homepage.
			array( 'homepage', array( 'sitename', 'sitedesc', 'sep' ) ),
			// Custom post.
			array( 'custom_post_type', array( 'sitename', 'title', 'sep' ) ),

			// Taxonomies.
			array( 'category'   , array( 'sitename', 'term_title', 'sep' ) ),
			array( 'post_tag'   , array( 'sitename', 'term_title', 'sep' ) ),
			array( 'post_format', array( 'sitename', 'term_title', 'sep', 'page' ) ),
			// Custom taxonomy.
			array( 'term-in-custom-taxomomy', array( 'sitename', 'term_title', 'sep' ) ),

			// Settings - archive pages.
			array( 'author_archive'         , array( 'sitename', 'title', 'sep', 'page' ) ),
			array( 'date_archive'           , array( 'sitename', 'sep', 'date', 'page' ) ),
			array( 'custom-taxonomy_archive', array( 'sitename', 'title', 'sep' ) ),
			// Settings - special pages.
			array( 'search', array( 'sitename', 'searchphrase', 'sep', 'page' ) ),
			array( '404'   , array( 'sitename', 'sep' ) ),
		);
	}

	/**
	 * Tests that get_recommended_replacevars works when there are no recommendations found.
	 *
	 * @covers WPSEO_Admin_Recommended_Replace_Vars::get_recommended_replacevars_for
	 */
	public function test_get_recommended_replacevars_non_existing() {
		$this->assertEquals( array(), $this->class_instance->get_recommended_replacevars_for( 'non-existing-replace-var' ) );
	}

	/**
	 * Tests that get_recommended_replacevars works when a filter adds a non-array recommendation.
	 *
	 * @covers WPSEO_Admin_Recommended_Replace_Vars::get_recommended_replacevars_for
	 */
	public function test_get_recommended_replacevars_non_array() {
		$this->assertEquals( array(), $this->class_instance->get_recommended_replacevars_for( 'non-array' ) );
	}

	/**
	 * Filter function for adding or changing replacement variables.
	 *
	 * @param array $replacevars The replacement variables before the filter.
	 *
	 * @return array The new recommended replacement variables.
	 */
	public function filter_recommended_replacevars( $replacevars = array() ) {
		$replacevars[ 'non-array' ] = 'non-array';

		return $replacevars;
	}

	/**
	 * Create and get a mocked WP_Post with a certain post_type.
	 *
	 * @param string $post_type The post type to give to the post.
	 *
	 * @return WP_Post A mocked post with the specified post_type.
	 */
	private function create_and_get_with_post_type( $post_type = 'post' ) {
		return self::factory()->post->create_and_get(
			array(
				'post_type' => $post_type,
			)
		);
	}
}
