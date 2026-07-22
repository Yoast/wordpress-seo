<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Content_Types\Content_Type_Access_Checker;

use Brain\Monkey\Functions;

/**
 * Tests can_edit_any.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Content_Types\Content_Type_Access_Checker::can_edit_any
 */
final class Can_Edit_Any_Test extends Abstract_Content_Type_Access_Checker_Test {

	/**
	 * Tests that the type is editable when the user can edit its own drafts.
	 *
	 * @return void
	 */
	public function test_can_edit_any_with_edit_posts() {
		Functions\expect( 'get_post_type_object' )
			->once()
			->with( 'book' )
			->andReturn(
				(object) [
					'map_meta_cap' => true,
					'cap'          => (object) [ 'edit_posts' => 'edit_books' ],
				],
			);

		Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_books' )
			->andReturnTrue();

		$this->assertTrue( $this->instance->can_edit_any( 'book' ) );
	}

	/**
	 * Tests that the type is editable when the user can only edit published posts.
	 *
	 * @return void
	 */
	public function test_can_edit_any_with_only_edit_published_posts() {
		Functions\expect( 'get_post_type_object' )
			->once()
			->with( 'book' )
			->andReturn(
				(object) [
					'map_meta_cap' => true,
					'cap'          => (object) [
						'edit_posts'           => 'edit_books',
						'edit_published_posts' => 'edit_published_books',
					],
				],
			);

		Functions\expect( 'current_user_can' )
			->twice()
			->andReturnUsing(
				static function ( $capability ) {
					return $capability === 'edit_published_books';
				},
			);

		$this->assertTrue( $this->instance->can_edit_any( 'book' ) );
	}

	/**
	 * Tests that the type is editable when the user can only edit other authors' posts.
	 *
	 * @return void
	 */
	public function test_can_edit_any_with_only_edit_others_posts() {
		Functions\expect( 'get_post_type_object' )
			->once()
			->with( 'book' )
			->andReturn(
				(object) [
					'map_meta_cap' => true,
					'cap'          => (object) [
						'edit_posts'           => 'edit_books',
						'edit_published_posts' => 'edit_published_books',
						'edit_others_posts'    => 'edit_others_books',
					],
				],
			);

		Functions\expect( 'current_user_can' )
			->times( 3 )
			->andReturnUsing(
				static function ( $capability ) {
					return $capability === 'edit_others_books';
				},
			);

		$this->assertTrue( $this->instance->can_edit_any( 'book' ) );
	}

	/**
	 * Tests that the type is not editable when the user holds none of the editing capabilities.
	 *
	 * @return void
	 */
	public function test_can_edit_any_without_any_capability() {
		Functions\expect( 'get_post_type_object' )
			->once()
			->with( 'book' )
			->andReturn(
				(object) [
					'map_meta_cap' => true,
					'cap'          => (object) [
						'edit_posts'           => 'edit_books',
						'edit_published_posts' => 'edit_published_books',
						'edit_others_posts'    => 'edit_others_books',
					],
				],
			);

		Functions\expect( 'current_user_can' )->times( 3 )->andReturnFalse();

		$this->assertFalse( $this->instance->can_edit_any( 'book' ) );
	}

	/**
	 * Tests that the singular capability is used when meta-cap mapping is disabled.
	 *
	 * @return void
	 */
	public function test_can_edit_any_uses_singular_capability_when_mapping_disabled() {
		Functions\expect( 'get_post_type_object' )
			->once()
			->with( 'book' )
			->andReturn(
				(object) [
					'map_meta_cap' => false,
					'cap'          => (object) [ 'edit_post' => 'edit_book' ],
				],
			);

		Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_book' )
			->andReturnTrue();

		$this->assertTrue( $this->instance->can_edit_any( 'book' ) );
	}

	/**
	 * Tests that the type is not editable when mapping is disabled and the singular capability is missing.
	 *
	 * @return void
	 */
	public function test_can_edit_any_without_singular_capability_when_mapping_disabled() {
		Functions\expect( 'get_post_type_object' )
			->once()
			->with( 'book' )
			->andReturn(
				(object) [
					'map_meta_cap' => false,
					'cap'          => (object) [ 'edit_post' => 'edit_book' ],
				],
			);

		Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_book' )
			->andReturnFalse();

		$this->assertFalse( $this->instance->can_edit_any( 'book' ) );
	}

	/**
	 * Tests that an unknown post type is not editable.
	 *
	 * @return void
	 */
	public function test_can_edit_any_unknown_post_type() {
		Functions\expect( 'get_post_type_object' )
			->once()
			->with( 'nonexistent' )
			->andReturnNull();

		Functions\expect( 'current_user_can' )->never();

		$this->assertFalse( $this->instance->can_edit_any( 'nonexistent' ) );
	}
}
