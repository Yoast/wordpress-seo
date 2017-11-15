<?php

/**
 * Unit test class.
 * @group test
 */
class WPSEO_Post_Type_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the default situation with no custom post types being added.
	 *
	 * @covers WPSEO_Post_Type::get_accessible_post_types()
	 */
	public function test_get_accessible_post_types() {
		$this->assertEquals(
			array( 'post' => 'post', 'page' => 'page', 'attachment' => 'attachment' ),
			WPSEO_Post_Type::get_accessible_post_types()
		);
	}

	/**
	 * Tests the situation with a custom public post type.
	 *
	 * @covers WPSEO_Post_Type::get_accessible_post_types()
	 */
	public function test_get_accessible_post_types_with_a_custom_post_type() {
		register_post_type( 'custom-post-type', array( 'public' => true ) );

		$this->assertEquals(
			array( 'post' => 'post', 'page' => 'page', 'attachment' => 'attachment', 'custom-post-type' => 'custom-post-type' ),
			WPSEO_Post_Type::get_accessible_post_types()
		);
	}

	/**
	 * Tests the situation with a custom private post post type
	 *
	 * @covers WPSEO_Post_Type::get_accessible_post_types()
	 */
	public function test_get_accessible_post_types_with_a_custom_private_post_type() {
		register_post_type( 'custom-post-type', array( 'public' => false ) );

		$this->assertEquals(
			array( 'post' => 'post', 'page' => 'page', 'attachment' => 'attachment' ),
			WPSEO_Post_Type::get_accessible_post_types()
		);
	}

	/**
	 * Tests the situation with a post type that is set to robots noindex.
	 *
	 * @covers WPSEO_Post_Type::get_accessible_post_types()
	 */
	public function test_get_accessible_post_types_with_a_non_indexable_post_type() {
		$custom_post_type = register_post_type( 'custom-post-type', array( 'public' => true ) );

		WPSEO_Options::save_option(
			'wpseo_titles',
			'noindex-' . $custom_post_type->name,
			true
		);

		$this->assertEquals(
			array( 'post' => 'post', 'page' => 'page', 'attachment' => 'attachment' ),
			WPSEO_Post_Type::get_accessible_post_types()
		);
	}

	/**
	 * Tests the situation with a post type that isn't set to robots noindex.
	 *
	 * @covers WPSEO_Post_Type::get_accessible_post_types()
	 */
	public function test_get_accessible_post_types_with_an_indexable_post_type() {
		$custom_post_type = register_post_type( 'custom-post-type', array( 'public' => true ) );

		WPSEO_Options::save_option(
			'wpseo_titles',
			'noindex-' . $custom_post_type->name,
			false
		);

		$this->assertEquals(
			array( 'post' => 'post', 'page' => 'page', 'attachment' => 'attachment', 'custom-post-type' => 'custom-post-type' ),
			WPSEO_Post_Type::get_accessible_post_types()
		);
	}

	/**
	 * Tests the situation with a post type that isn't set to robots noindex.
	 *
	 * @covers WPSEO_Post_Type::is_post_type_indexable()
	 */
	public function test_is_post_type_indexable_with_indexable_post_type() {
		$custom_post_type = register_post_type( 'custom-post-type', array( 'public' => true ) );

		WPSEO_Options::save_option(
			'wpseo_titles',
			'noindex-' . $custom_post_type->name,
			false
		);

		$this->assertTrue( WPSEO_Post_Type::is_post_type_indexable( $custom_post_type->name ) );
	}

	/**
	 * Tests the situation with a post type that isn't set to robots noindex.
	 *
	 * @covers WPSEO_Post_Type::is_post_type_indexable()
	 */
	public function test_is_post_type_indexable_with_non_indexable_post_type() {
		$custom_post_type = register_post_type( 'custom-post-type', array( 'public' => true ) );

		WPSEO_Options::save_option(
			'wpseo_titles',
			'noindex-' . $custom_post_type->name,
			true
		);

		$this->assertFalse( WPSEO_Post_Type::is_post_type_indexable( $custom_post_type->name ) );
	}

	/**
	 * Tests the situation with a post type that isn't set to robots noindex.
	 *
	 * @covers WPSEO_Post_Type::is_post_type_indexable()
	 */
	public function test_is_post_type_indexable_with_non_existing_post_type() {
		$this->assertFalse( WPSEO_Post_Type::is_post_type_indexable( 'non-existing-custom-post-type' ) );
	}
}
