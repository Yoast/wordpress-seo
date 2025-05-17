<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Builder;

/**
 * Build_For_Home_Page_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 */
final class Build_For_Home_Page_Test extends Abstract_Indexable_Builder_TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable->object_type     = 'home-page';
		$this->indexable->object_sub_type = 'post';
	}

	/**
	 * Tests building an indexable for the post type archive.
	 *
	 * @covers ::build_for_home_page
	 * @covers ::build
	 * @covers ::ensure_indexable
	 *
	 * @return void
	 */
	public function test_build_for_home_page() {

		$this->expect_build( [ 'object_type' => 'home-page' ] );

		$this->assertSame( $this->indexable, $this->instance->build_for_home_page( false ) );
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

		$this->home_page_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable )
			->andReturn( $this->indexable );

		$this->expect_save_indexable( $this->indexable );
	}
}
