<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Builder;

use Mockery;
use Yoast\WP\SEO\Exceptions\Indexable\Invalid_Term_Exception;
use Yoast\WP\SEO\Exceptions\Indexable\Post_Not_Found_Exception;
use Yoast\WP\SEO\Exceptions\Indexable\Source_Exception;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;

/**
 * Build_Test.
 * Tests cases for system-page, home-page, date-archive and post-type-archive can be found in other tests the directory.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 */
final class Build_Test extends Abstract_Indexable_Builder_TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
	}

	/**
	 * Tests building an indexable for the post type.
	 *
	 * @covers ::ensure_indexable
	 * @covers ::maybe_build_author_indexable
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build() {

		$this->expect_deep_copy_indexable( $this->indexable );

		$this->expect_build_switch_case_post( $this->indexable );

		$this->expect_maybe_build_author_indexable();

		$this->expect_save_indexable( $this->indexable );

		$this->assertSame( $this->indexable, $this->instance->build( $this->indexable ) );
	}

	/**
	 * Tests building an indexable with object_sub_type = 'attachment'.
	 *
	 * @covers ::build
	 * @covers ::ensure_indexable
	 * $covers ::deep_copy_indexable
	 * @covers ::maybe_build_author_indexable
	 *
	 * @return void
	 */
	public function test_build_with_post_attachment() {

		$this->indexable->object_sub_type = 'attachment';

		$this->expect_deep_copy_indexable( $this->indexable );

		$this->expect_build_switch_case_post( $this->indexable );

		// Executed when object_sub_type = 'attachment' and 'object_type' is post.
		$this->link_builder
			->expects( 'patch_seo_links' )
			->once()
			->with( $this->indexable );

		$this->expect_maybe_build_author_indexable();

		$this->expect_save_indexable( $this->indexable );

		$result = $this->instance->build( $this->indexable );

		$this->assertSame( $this->indexable, $result );
	}

	/**
	 * Tests building an indexable for a term.
	 *
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 * @covers ::deep_copy_indexable
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build_with_term_given() {
		$this->indexable->object_type = 'term';

		$this->expect_deep_copy_indexable( $this->indexable );

		$this->term_builder
			->expects( 'build' )
			->once()
			->with( 1337, $this->indexable )
			->andReturn( $this->indexable );

		$this->hierarchy_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable );

		$this->expect_save_indexable( $this->indexable );

		$this->assertSame( $this->indexable, $this->instance->build( $this->indexable ) );
	}

	/**
	 * Tests building an indexable for a term.
	 *
	 * @covers ::build
	 * @covers ::deep_copy_indexable
	 *
	 * @return void
	 */
	public function test_build_for_id_and_type_with_term_exception() {
		$this->indexable->object_type = 'term';
		$this->indexable->object_id   = null;

		$this->expect_deep_copy_indexable( $this->indexable );

		$this->term_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable->object_id, $this->indexable )
			->andThrows( Source_Exception::class );

		$this->assertFalse( $this->instance->build( $this->indexable ) );
	}

	/**
	 * Tests that build returns false when a build returns an exception.
	 *
	 * @covers ::build
	 * @covers ::deep_copy_indexable
	 * @covers ::save_indexable
	 *
	 * @return void
	 */
	public function test_build_with_fake_indexable() {
		$this->indexable->object_type = 'term';

		$this->expect_deep_copy_indexable( $this->indexable );

		$this->term_builder->expects( 'build' )
			->once()
			->with( 1337, $this->indexable )
			->andThrows( Invalid_Term_Exception::class );

		$this->version_manager
			->expects( 'set_latest' )
			->once()
			->with( $this->indexable )
			->andReturnUsing(
				static function ( $indexable ) {
					$indexable->version = 2;

					return $indexable;
				}
			);

		$this->expect_save_indexable( $this->indexable );

		$result = $this->instance->build( $this->indexable );

		$expected_indexable              = clone $this->indexable;
		$expected_indexable->post_status = 'unindexed';
		$this->assertEquals( $expected_indexable, $result );
	}

	/**
	 * Tests building an indexable for an unknown type.
	 *
	 * @covers ::build
	 * @covers ::deep_copy_indexable
	 *
	 * @return void
	 */
	public function test_build_for_id_and_type_with_unknown_type_given() {
		$this->indexable->object_type = 'this type should not be processed';

		$this->expect_deep_copy_indexable( $this->indexable );

		$this->expect_save_indexable( $this->indexable );

		$this->assertSame( $this->indexable, $this->instance->build( $this->indexable ) );
	}

	/**
	 * Tests whether an indexable is not being built when the object id is invalid (0).
	 *
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_not_being_built_if_object_id_is_invalid() {

		$this->indexable->object_id = 0;

		$this->expect_deep_copy_indexable( $this->indexable );

		$this->assertFalse( $this->instance->build( $this->indexable ) );
	}

	/**
	 * Tests building an indexable for a post when the post builder throws an exception because the post does not exist.
	 *
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 *
	 * @return void
	 */
	public function test_build_for_id_and_type_with_post_given_and_no_indexable_build() {
		$empty_indexable = Mockery::mock( Indexable_Mock::class );

		$defaults                     = [
			'object_type' => 'post',
			'object_id'   => 1337,
		];
		$empty_indexable->object_type = 'post';
		$empty_indexable->object_id   = '1337';

		$this->expect_ensure_indexable( $defaults, $empty_indexable );

		// Force an exception during the build process.
		$this->post_builder
			->expects( 'build' )
			->once()
			->with( 1337, $empty_indexable )
			->andThrows( Post_Not_Found_Exception::class );

		// Verify the code after exception is not run.
		$this->primary_term_builder
			->expects( 'build' )
			->never();

		// Verify that the exception is caught and a placeholder indexable is created.
		$this->version_manager
			->expects( 'set_latest' )
			->once()
			->with( $empty_indexable )
			->andReturnUsing(
				static function ( $indexable ) {
					$indexable->version = 2;

					return $indexable;
				}
			);

		$expected_indexable              = clone $empty_indexable;
		$expected_indexable->post_status = 'unindexed';
		$expected_indexable->version     = 2;

		$this->expect_save_indexable( $expected_indexable );

		$result = $this->instance->build( false, $defaults );
		$this->assertEquals( $empty_indexable, $result );
	}

	/**
	 * Tests building an indexable for a post when the post builder throws an exception because the post does not exist anymore.
	 *
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 *
	 * @return void
	 */
	public function test_build_with_post_and_indexable_given_and_no_indexable_build() {

		$this->expect_deep_copy_indexable( $this->indexable );

		// Force an exception during the build process.
		$this->post_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable->object_id, $this->indexable )
			->andThrows( Post_Not_Found_Exception::class );

		// Verify the code after exception is not run.
		$this->primary_term_builder
			->expects( 'build' )
			->never();

		// Verify that the exception is caught and a placeholder indexable is saved instead.
		$this->version_manager
			->expects( 'set_latest' )
			->once()
			->with( $this->indexable )
			->andReturnUsing(
				static function ( $indexable ) {
					$indexable->version = 2;

					return $indexable;
				}
			);

		$expected_indexable              = clone $this->indexable;
		$expected_indexable->post_status = 'unindexed';

		$this->expect_save_indexable( $expected_indexable );

		$result = $this->instance->build( $this->indexable );
		$this->assertEquals( $expected_indexable, $result );
	}

	/**
	 * Partial expectation for build method when switch case is post and no exceptions are thrown.
	 *
	 * @param Indexable_Mock $indexable The indexable to expect.
	 *
	 * @return void
	 */
	public function expect_build_switch_case_post( $indexable ) {
		$this->post_builder
			->expects( 'build' )
			->once()
			->with( $indexable->object_id, $indexable )
			->andReturn( $indexable );

		$this->primary_term_builder
			->expects( 'build' )
			->once()
			->with( $indexable->object_id );

		$this->hierarchy_builder
			->expects( 'build' )
			->once()
			->with( $indexable )
			->andReturn( $indexable );
	}
}
