<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Builder;

/**
 * Build_For_Id_And_Type_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 */
final class Build_For_Id_And_Type_Test extends Abstract_Indexable_Builder_TestCase {

	/**
	 * Tests building an indexable for the post type archive.
	 *
	 * @covers ::build_for_id_and_type
	 * @covers ::build
	 * @covers ::ensure_indexable
	 * @covers ::maybe_build_author_indexable
	 *
	 * @return void
	 */
	public function test_build_for_id_and_type_with_post() {

		$defaults = [
			'object_type' => 'post',
			'object_id'   => 1337,
		];

		$this->expect_build( $defaults );

		$this->assertSame( $this->indexable, $this->instance->build_for_id_and_type( 1337, 'post' ) );
	}

	/**
	 * Expectation for build method.
	 *
	 * @param array $defaults The defaults to expect.
	 *
	 * @return void
	 */
	public function expect_build( $defaults ) {
		$this->expect_ensure_indexable( $defaults, $this->indexable );

		$this->post_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable->object_id, $this->indexable )
			->andReturn( $this->indexable );

		$this->primary_term_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable->object_id );

		$this->hierarchy_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable )
			->andReturn( $this->indexable );

		$this->expect_maybe_build_author_indexable();

		$this->expect_save_indexable( $this->indexable );
	}
}
