<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Builder;

/**
 * Build_For_Date_Archive_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 */
final class Build_For_Date_Archive_Test extends Abstract_Indexable_Builder_TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->indexable->object_type = 'date-archive';
	}

	/**
	 * Tests building an indexable for the post type archive.
	 *
	 * @covers ::build_for_date_archive
	 * @covers ::ensure_indexable
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build_for_date_archive_without_indexable() {
		$this->expect_build( [ 'object_type' => 'date-archive' ] );

		$this->assertSame( $this->indexable, $this->instance->build_for_date_archive( false ) );
	}

	/**
	 * Tests building an indexable for the post type archive.
	 *
	 * @covers ::build_for_date_archive
	 * @covers ::ensure_indexable
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build_for_date_archive_with_indexable() {
		$this->expect_deep_copy_indexable( $this->indexable );

		$this->date_archive_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable )
			->andReturn( $this->indexable );

		$this->expect_save_indexable( $this->indexable );

		$this->assertSame( $this->indexable, $this->instance->build_for_date_archive( $this->indexable ) );
	}

	/**
	 * Expectation for build method.
	 *
	 * @param array $defaults The defaults to expect.
	 *
	 * @return void
	 */
	private function expect_build( $defaults ) {
		$this->expect_ensure_indexable( $defaults, $this->indexable );

		$this->date_archive_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable )
			->andReturn( $this->indexable );

		$this->expect_save_indexable( $this->indexable );
	}
}
