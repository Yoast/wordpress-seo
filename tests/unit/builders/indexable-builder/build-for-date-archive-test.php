<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Builder;

use Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Builder\Indexable_Builder_Setup;

/**
 * Build_For_Date_Archive_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 */
class Build_For_Date_Archive_Test extends Indexable_Builder_Setup {

	/**
	 * Sets up the test.
	 */
	protected function set_up() {
		parent::set_up();
		$this->indexable->object_type     = 'date-archive';
		$this->indexable->object_sub_type = 'post';
	}

	/**
	 * Tests building an indexable for the post type archive.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_date_archive
	 * @covers ::ensure_indexable
	 */
	public function test_build_for_date_archive() {

		$this->expect_build( [ 'object_type' => 'date-archive' ] );

		$this->assertSame( $this->indexable, $this->instance->build_for_date_archive( false ) );
	}

	/**
	 * Expectation for build method.
	 *
	 * @param array $defaults The defaults to expect.
	 */
	public function expect_build( $defaults ) {
		$this->expect_ensure_indexable( $defaults, $this->indexable );

		$this->date_archive_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable )
			->andReturn( $this->indexable );

		// Saving is outside the scope of this test.
		$this->expect_save_indexable_skip();
	}
}
