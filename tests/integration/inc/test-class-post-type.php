<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc
 */

/**
 * Unit Test Class.
 */
class WPSEO_Post_Type_Test extends WPSEO_UnitTestCase {

	/**
	 * Remove the custom post type after each test.
	 */
	public function tear_down() {
		// Remove possibly set post type.
		unregister_post_type( 'custom-post-type' );
		unregister_post_type( 'custom-post-type-api' );

		parent::tear_down();
	}

	/**
	 * Tests the default situation with no custom post types being added.
	 *
	 * @covers WPSEO_Post_Type::get_accessible_post_types
	 */
	public function test_get_accessible_post_types() {
		$post_types = WPSEO_Post_Type::get_accessible_post_types();
		$this->assertContains( 'post', $post_types );
		$this->assertContains( 'page', $post_types );
		$this->assertContains( 'attachment', $post_types );
	}

	/**
	 * Tests the situation with a custom public post type.
	 *
	 * @covers WPSEO_Post_Type::get_accessible_post_types
	 */
	public function test_get_accessible_post_types_with_a_custom_post_type() {
		register_post_type( 'custom-post-type', [ 'public' => true ] );

		$this->assertContains( 'custom-post-type', WPSEO_Post_Type::get_accessible_post_types() );
	}

	/**
	 * Tests the situation with a custom public post type that is not publicly queryable.
	 *
	 * @covers WPSEO_Post_Type::get_accessible_post_types
	 */
	public function test_get_accessible_post_types_with_a_custom_post_type_that_is_noy_publicly_queryable() {
		register_post_type(
			'hidden-post-type',
			[
				'public'             => true,
				'publicly_queryable' => false,
			]
		);

		$this->assertNotContains( 'hidden-post-type', WPSEO_Post_Type::get_accessible_post_types() );
	}

	/**
	 * Tests the situation with a custom private post post type.
	 *
	 * @covers WPSEO_Post_Type::get_accessible_post_types
	 */
	public function test_get_accessible_post_types_with_a_custom_private_post_type() {
		register_post_type( 'custom-post-type', [ 'public' => false ] );

		$this->assertNotContains( 'custom-post-type', WPSEO_Post_Type::get_accessible_post_types() );
	}

	/**
	 * Tests the situation with a post type that is set to robots noindex.
	 *
	 * @covers WPSEO_Post_Type::get_accessible_post_types
	 */
	public function test_get_accessible_post_types_with_a_non_indexable_post_type() {
		$custom_post_type = register_post_type( 'custom-post-type', [ 'public' => true ] );

		WPSEO_Options::set( 'noindex-' . $custom_post_type->name, true );

		// Noindexed post types -should- remain in the list.
		$this->assertContains( 'custom-post-type', WPSEO_Post_Type::get_accessible_post_types() );
	}

	/**
	 * Tests the situation with a post type that isn't set to robots noindex.
	 *
	 * @covers WPSEO_Post_Type::get_accessible_post_types
	 */
	public function test_get_accessible_post_types_with_an_indexable_post_type() {
		$custom_post_type = register_post_type( 'custom-post-type', [ 'public' => true ] );

		WPSEO_Options::set( 'noindex-' . $custom_post_type->name, false );

		$this->assertContains( 'custom-post-type', WPSEO_Post_Type::get_accessible_post_types() );
	}

	/**
	 * Tests the situation where a post type will be filtered by using the 'wpseo_accessible_post_types filter'.
	 *
	 * @covers WPSEO_Post_Type::get_accessible_post_types
	 */
	public function test_get_accessible_post_types_with_a_filter_hook() {
		$this->assertContains( 'attachment', WPSEO_Post_Type::get_accessible_post_types() );

		add_filter( 'wpseo_accessible_post_types', [ $this, 'filter_attachment' ] );
		$this->assertNotContains( 'attachment', WPSEO_Post_Type::get_accessible_post_types() );
		remove_filter( 'wpseo_accessible_post_types', [ $this, 'filter_attachment' ] );
	}

	/**
	 * Tests the situation where a post type will be filtered by using the 'wpseo_accessible_post_types filter'.
	 *
	 * @covers WPSEO_Post_Type::get_accessible_post_types
	 */
	public function test_get_accessible_post_types_with_a_filter_hook_that_returns_wrong_type() {
		add_filter( 'wpseo_accessible_post_types', '__return_true' );

		$this->assertEquals( [], WPSEO_Post_Type::get_accessible_post_types() );

		remove_filter( 'wpseo_accessible_post_types', '__return_true' );
	}

	/**
	 * Tests the situation with a post type that isn't set to robots noindex.
	 *
	 * @covers WPSEO_Post_Type::is_post_type_indexable
	 */
	public function test_is_post_type_indexable_with_indexable_post_type() {
		$custom_post_type = register_post_type( 'custom-post-type', [ 'public' => true ] );

		WPSEO_Options::set( 'noindex-' . $custom_post_type->name, false );

		$this->assertTrue( WPSEO_Post_Type::is_post_type_indexable( $custom_post_type->name ) );
	}

	/**
	 * Tests the situation with a post type that is set to robots noindex.
	 *
	 * @covers WPSEO_Post_Type::is_post_type_indexable
	 */
	public function test_is_post_type_indexable_with_non_indexable_post_type() {
		$custom_post_type = register_post_type( 'custom-post-type', [ 'public' => true ] );

		WPSEO_Options::set( 'noindex-' . $custom_post_type->name, true );

		$this->assertFalse( WPSEO_Post_Type::is_post_type_indexable( $custom_post_type->name ) );
	}

	/**
	 * Test the situation where the attachment post type will be filtered.
	 *
	 * @covers WPSEO_Post_Type::filter_attachment_post_type
	 */
	public function test_filter_attachment_post_type() {
		$this->assertNotContains(
			'attachment',
			WPSEO_Post_Type::filter_attachment_post_type(
				[
					'post'       => 'post',
					'attachment' => 'attachment',
				]
			)
		);
	}

	/**
	 * Callback for the 'wpseo_accessible_post_types' filter, used in 'test_get_accessible_post_types_with_a_filter_hook'.
	 *
	 * @param array $post_types The post types to filter.
	 *
	 * @return array The filtered post_types.
	 */
	public function filter_attachment( array $post_types ) {
		unset( $post_types['attachment'] );

		return $post_types;
	}

	/**
	 * Tests whether or (custom) post types are enabled in the REST API.
	 *
	 * @covers WPSEO_Post_Type::is_rest_enabled
	 */
	public function test_rest_enabled_post_types() {
		$this->assertTrue( WPSEO_Post_Type::is_rest_enabled( 'post' ) );
		$this->assertFalse( WPSEO_Post_Type::is_rest_enabled( 'invalid_post_type' ) );

		register_post_type(
			'custom-post-type-api',
			[
				'public'       => true,
				'show_in_rest' => true,
			]
		);
		$this->assertTrue( WPSEO_Post_Type::is_rest_enabled( 'custom-post-type-api' ) );

		register_post_type( 'custom-post-type', [ 'public' => true ] );
		$this->assertFalse( WPSEO_Post_Type::is_rest_enabled( 'custom-post-type' ) );
	}
}
