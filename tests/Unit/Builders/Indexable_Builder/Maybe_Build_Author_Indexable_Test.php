<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Builder;

use Mockery;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\Unit\Doubles\Builders\Indexable_Builder_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;

/**
 * Class Maybe_Build_Author_Indexable_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 */
final class Maybe_Build_Author_Indexable_Test extends Abstract_Indexable_Builder_TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Indexable_Builder_Double(
			$this->author_builder,
			$this->post_builder,
			$this->term_builder,
			$this->home_page_builder,
			$this->post_type_archive_builder,
			$this->date_archive_builder,
			$this->system_page_builder,
			$this->hierarchy_builder,
			$this->primary_term_builder,
			$this->indexable_helper,
			$this->version_manager,
			$this->link_builder
		);

		$this->instance->set_indexable_repository( $this->indexable_repository );
	}

	/**
	 * Test maybe_build_author_indexable.
	 *
	 * @covers ::maybe_build_author_indexable
	 * @covers ::build
	 * @covers ::ensure_indexable
	 * @covers ::save_indexable
	 *
	 * @return void
	 */
	public function test_build_new_author_indexable() {
		$author_id                     = 2011;
		$author_indexable              = Mockery::mock( Indexable_Mock::class );
		$author_indexable->object_type = 'user';
		$author_indexable->object_id   = $author_id;

		$author_defaults = [
			'object_type' => 'user',
			'object_id'   => $author_id,
		];

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( $author_id, 'user', false )
			->andReturn( false );

		// The rest of expectation are from build method.
		$this->expect_ensure_indexable( $author_defaults, $author_indexable );

		$this->author_builder
			->expects( 'build' )
			->once()
			->with( $author_indexable->object_id, $author_indexable )
			->andReturn( $author_indexable );

		$this->expect_save_indexable( $author_indexable );

		$this->instance->exposed_maybe_build_author_indexable( $author_id );
	}

	/**
	 * Test maybe_build_author_indexable.
	 *
	 * @covers ::maybe_build_author_indexable
	 * @covers ::build
	 * @covers ::ensure_indexable
	 * @covers ::save_indexable
	 * @covers ::deep_copy_indexable
	 *
	 * @return void
	 */
	public function test_update_author_indexable() {
		$author_id                     = 2012;
		$author_indexable              = Mockery::mock( Indexable_Mock::class );
		$author_indexable->object_type = 'user';
		$author_indexable->object_id   = $author_id;

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( $author_id, 'user', false )
			->andReturn( $author_indexable );

		$this->version_manager
			->expects( 'indexable_needs_upgrade' )
			->once()
			->with( $author_indexable )
			->andReturnTrue();

		// The rest of expectation are from build method.
		$this->expect_deep_copy_indexable( $author_indexable );

		$this->author_builder
			->expects( 'build' )
			->once()
			->with( $author_indexable->object_id, $author_indexable )
			->andReturn( $author_indexable );

		$this->expect_save_indexable( $author_indexable );

		$this->instance->exposed_maybe_build_author_indexable( $author_id );
	}

	/**
	 * Test maybe_build_author_indexable without changing author indexable.
	 *
	 * @covers ::maybe_build_author_indexable
	 *
	 * @return void
	 */
	public function test_does_not_build_author_indexable() {
		$author_indexable    = Mockery::mock( Indexable::class );
		$author_id           = 2010;
		$needs_upgrade_times = 1;
		$needs_upgrade       = false;

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( $author_id, 'user', false )
			->andReturn( $author_indexable );

		$this->version_manager
			->expects( 'indexable_needs_upgrade' )
			->times( $needs_upgrade_times )
			->with( $author_indexable )
			->andReturn( $needs_upgrade );

		$this->assertEquals( $author_indexable, $this->instance->exposed_maybe_build_author_indexable( $author_id ) );
	}
}
