<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 */
class WPSEO_Admin_Editor_Specific_Replace_Vars_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Admin_Editor_Specific_Replace_Vars_Double
	 */
	protected $class_instance;

	/**
	 * Set up the class which will be tested.
	 */
	public function set_up() {
		parent::set_up();

		$this->class_instance = new WPSEO_Admin_Editor_Specific_Replace_Vars_Double();
	}

	/**
	 * Tests adding replacement variables for page types.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::add_for_page_types
	 */
	public function test_add_for_page_types() {
		$this->class_instance->add_for_page_types(
			[ 'post' ],
			[ 'cf_custom_field' ]
		);

		$actual   = $this->class_instance->get();
		$expected = [ 'id', 'term404', 'pt_single', 'pt_plural', 'cf_custom_field' ];

		$this->assertEquals( $expected, $actual['post'] );
	}

	/**
	 * Test adding replacement variables for page types with given variables being an empty array.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::add_for_page_types
	 */
	public function test_add_for_page_types_with_empty_array() {
		$this->class_instance->add_for_page_types( [ 'post' ], [] );

		$actual   = $this->class_instance->get();
		$expected = [ 'id', 'term404', 'pt_single', 'pt_plural' ];

		$this->assertEquals( $expected, $actual['post'] );
	}

	/**
	 * Tests that get_shared_replace_vars removes all replacement variables that occurs in the editor specific
	 * replacement variables.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::get_generic
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::get_unique_replacement_variables
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::extract_names
	 */
	public function test_get_shared_replace_vars_filters_editor_specific_replace_vars() {
		$replace_vars_list = [
			[
				'name'  => 'searchphrase',
				'label' => 'Searchphrase',
				'value' => '',
			],
			[
				'name'  => 'title',
				'label' => 'title',
				'value' => '',
			],
			[
				'no-name' => 'key present',
			],
		];

		$this->assertEquals(
			[ 'title' ],
			$this->class_instance->get_generic(
				$replace_vars_list
			)
		);
	}

	/**
	 * Tests that determine_for_term can detect a category.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_term
	 */
	public function test_determine_for_term_with_a_category() {
		$this->assertEquals( 'category', $this->class_instance->determine_for_term( 'category' ) );
	}

	/**
	 * Tests that determine_for_term can detect a tag.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_term
	 */
	public function test_determine_for_term_with_a_tag() {
		$this->assertEquals( 'post_tag', $this->class_instance->determine_for_term( 'post_tag' ) );
	}

	/**
	 * Tests that determine_for_term can detect a post_format.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_term
	 */
	public function test_determine_for_term_with_a_post_format() {
		$this->assertEquals( 'post_format', $this->class_instance->determine_for_term( 'post_format' ) );
	}

	/**
	 * Tests that determine_for_term can detect a custom taxonomy.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_term
	 */
	public function test_determine_for_term_with_a_custom_taxonomy() {
		$this->assertEquals( 'term-in-custom-taxonomy', $this->class_instance->determine_for_term( 'custom_taxonomy' ) );
	}

	/**
	 * Tests that determine_for_post defaults to post when no actual post variable is passed along.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_post
	 */
	public function test_determine_for_post_without_a_wp_post_instance() {
		$this->assertEquals( 'post', $this->class_instance->determine_for_post( null ) );
	}

	/**
	 * Tests that determine_for_post can detect a page.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_post
	 */
	public function test_determine_for_post_with_a_page() {
		$post = $this->create_and_get_with_post_type( 'page' );

		$this->assertEquals( 'page', $this->class_instance->determine_for_post( $post ) );
	}

	/**
	 * Tests that determine_for_post can detect a post.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_post
	 */
	public function test_determine_for_post_with_a_post() {
		$post = $this->create_and_get_with_post_type( 'post' );

		$this->assertEquals( 'post', $this->class_instance->determine_for_post( $post ) );
	}

	/**
	 * Tests that determine_for_post can detect a custom post type.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_post
	 */
	public function test_determine_for_post_with_a_custom_post_type() {
		$post = $this->create_and_get_with_post_type( 'some_plugin_post' );

		$this->assertEquals( 'custom_post_type', $this->class_instance->determine_for_post( $post ) );
	}

	/**
	 * Tests that determine_for_post_type works for a post.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_post_type
	 */
	public function test_determine_for_post_type_with_a_post() {
		$this->assertEquals( 'post', $this->class_instance->determine_for_post_type( 'post' ) );
	}

	/**
	 * Tests that the determine_for_post_type fallback works.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_post_type
	 */
	public function test_determine_for_post_type_with_a_fallback() {
		$this->assertEquals( 'custom_post_type', $this->class_instance->determine_for_post_type( 'non-existing-post_type' ) );
	}

	/**
	 * Tests that the determine_for_post_type custom fallback works.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_post_type
	 */
	public function test_determine_for_post_type_with_a_custom_fallback() {
		$this->assertEquals( 'fallback_post_type', $this->class_instance->determine_for_post_type( 'non-existing-post_type', 'fallback_post_type' ) );
	}

	/**
	 * Tests that determine_for_archive works for the date_archive.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_archive
	 */
	public function test_determine_for_archive_with_author() {
		$this->assertEquals( 'custom-post-type_archive', $this->class_instance->determine_for_archive( 'author' ) );
	}

	/**
	 * Tests that determine_for_archive works for the date_archive.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_archive
	 */
	public function test_determine_for_archive_with_date() {
		$this->assertEquals( 'custom-post-type_archive', $this->class_instance->determine_for_archive( 'date' ) );
	}

	/**
	 * Tests that the determine_for_archive fallback works.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_archive
	 */
	public function test_determine_for_archive_with_a_fallback() {
		$this->assertEquals( 'custom-post-type_archive', $this->class_instance->determine_for_archive( 'non-existing-archive' ) );
	}

	/**
	 * Tests that the determine_for_archive custom fallback works.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_archive
	 */
	public function test_determine_for_archive_with_a_custom_fallback() {
		$this->assertEquals( 'fallback_archive', $this->class_instance->determine_for_archive( 'non-existing-archive', 'fallback_archive' ) );
	}

	/**
	 * Tests whether determine_for_archive correctly returns editor specific replacevars for archive pages.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::determine_for_archive
	 */
	public function test_determine_for_archive_with_a_existing_archive() {
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Admin_Editor_Specific_Replace_Vars' )
			->setMethods( [ 'has_for_page_type' ] )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'has_for_page_type' )
			->will( $this->returnValue( true ) );

		$this->assertEquals( 'post_archive', $class_instance->determine_for_archive( 'post' ) );
	}

	/**
	 * Tests that has_editor_specific_replace_vars returns true when it has recommended replacement
	 * variables for the passed page type.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::has_for_page_type
	 */
	public function test_has_editor_specific_replace_vars_existing() {
		$this->assertEquals( true, $this->class_instance->has_for_page_type( 'post' ) );
	}

	/**
	 * Tests that has_editor_specific_replace_vars returns false when it doesn't have recommended
	 * replacement variables for the passed page type.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::has_for_page_type
	 */
	public function test_has_editor_specific_replace_vars_non_existing() {
		$this->assertEquals( false, $this->class_instance->has_for_page_type( 'non-existing-replace-var' ) );
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
			[
				'post_type' => $post_type,
			]
		);
	}

	/**
	 * Tests the filter for the editor specific replacement variables.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::get
	 */
	public function test_editor_specific_replacement_variables_filter() {
		add_filter( 'wpseo_editor_specific_replace_vars', [ $this, 'filter_editor_specific_replacement_variables' ] );

		$expected_replacement_variables = [
			'page'                     => [ 'pt_single', 'pt_plural', 'parent_title' ],
			'post'                     => [ 'id', 'term404', 'pt_single', 'pt_plural' ],
			'custom_post_type'         => [ 'id', 'term404', 'pt_single', 'pt_plural', 'parent_title' ],
			'category'                 => [ 'term_title', 'term_description', 'category_description', 'parent_title', 'term_hierarchy' ],
			'post_tag'                 => [ 'term_title', 'term_description', 'tag_description' ],
			'post_format'              => [ 'term_title' ],
			'term-in-custom-taxonomy'  => [ 'term_title', 'term_description', 'category_description', 'parent_title', 'term_hierarchy' ],
			'custom-post-type_archive' => [ 'pt_single', 'pt_plural' ],
			'search'                   => [ 'searchphrase' ],
		];

		$this->assertEquals(
			$expected_replacement_variables,
			$this->class_instance->get()
		);

		remove_filter( 'wpseo_editor_specific_replace_vars', [ $this, 'filter_editor_specific_replacement_variables' ] );
	}

	/**
	 * Tests the filter for the editor specific replacement variables.
	 *
	 * @covers WPSEO_Admin_Editor_Specific_Replace_Vars::get
	 */
	public function test_editor_specific_replacement_variables_filter_with_wrong_return_value() {
		add_filter( 'wpseo_editor_specific_replace_vars', '__return_false' );

		$expected_replacement_variables = [
			// Posts types.
			'page'                      => [ 'id', 'pt_single', 'pt_plural', 'parent_title' ],
			'post'                      => [ 'id', 'term404', 'pt_single', 'pt_plural' ],
			'custom_post_type'          => [ 'id', 'term404', 'pt_single', 'pt_plural', 'parent_title' ],
			'category'                  => [ 'term_title', 'term_description', 'category_description', 'parent_title', 'term_hierarchy' ],
			'post_tag'                  => [ 'term_title', 'term_description', 'tag_description' ],
			'post_format'               => [ 'term_title' ],
			'term-in-custom-taxonomy'   => [ 'term_title', 'term_description', 'category_description', 'parent_title', 'term_hierarchy' ],
			'custom-post-type_archive'  => [ 'pt_single', 'pt_plural' ],
			'search'                    => [ 'searchphrase' ],
		];

		$this->assertEquals(
			$expected_replacement_variables,
			$this->class_instance->get()
		);

		remove_filter( 'wpseo_editor_specific_replace_vars', '__return_false' );
	}

	/**
	 * Filter function for adding or changing replacement variables.
	 *
	 * @param array $replacement_variables The replacement variables before the filter.
	 *
	 * @return array The new editor_specific replacement variables.
	 */
	public function filter_editor_specific_replacement_variables( array $replacement_variables = [] ) {
		$replacement_variables['page'] = [ 'pt_single', 'pt_plural', 'parent_title' ];

		return $replacement_variables;
	}
}
