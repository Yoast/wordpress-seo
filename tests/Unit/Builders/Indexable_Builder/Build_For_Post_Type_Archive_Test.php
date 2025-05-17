<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Builder;

/**
 * Build_For_Post_Type_Archive_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 */
final class Build_For_Post_Type_Archive_Test extends Abstract_Indexable_Builder_TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable->object_type     = 'post-type-archive';
		$this->indexable->object_sub_type = 'post';
	}

	/**
	 * Tests building an indexable for the post type archive.
	 *
	 * @covers ::build_for_post_type_archive
	 * @covers ::ensure_indexable
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build_for_post_type_archive() {
		$defaults = [
			'object_type'     => 'post-type-archive',
			'object_sub_type' => 'post',
		];

		$this->expect_build( $defaults );

		$this->assertSame( $this->indexable, $this->instance->build_for_post_type_archive( 'post', false ) );
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

		$this->post_type_archive_builder
			->expects( 'build' )
			->once()
			->with( 'post', $this->indexable )
			->andReturn( $this->indexable );

		$this->expect_save_indexable( $this->indexable );
	}
}
