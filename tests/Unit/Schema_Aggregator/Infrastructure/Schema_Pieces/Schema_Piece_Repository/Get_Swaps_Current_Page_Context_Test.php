<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Pieces\Schema_Piece_Repository;

use Mockery;
use RuntimeException;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository_Interface;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;

/**
 * Tests that get() primes the memoizer's current_page cache with the per-indexable context
 * around the external collect() call, and restores it afterwards (even on exception).
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Schema_Piece_Repository::get
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Swaps_Current_Page_Context_Test extends Abstract_Schema_Piece_Repository_Test {

	/**
	 * Builds an indexable with a product sub-type and the given id.
	 *
	 * @param int $id The indexable id (used as both id and object_id).
	 *
	 * @return Indexable_Mock
	 */
	private function make_product_indexable( int $id ): Indexable_Mock {
		$indexable                  = new Indexable_Mock();
		$indexable->id              = $id;
		$indexable->object_id       = $id;
		$indexable->object_type     = 'post';
		$indexable->object_sub_type = 'product';
		return $indexable;
	}

	/**
	 * Stubs every collaborator that is not relevant to the swap behaviour, leaving the
	 * indexable iteration as the only orchestration the test inspects.
	 *
	 * @param array<Indexable_Mock>    $indexables    The indexables to feed into the loop.
	 * @param array<Meta_Tags_Context> $contexts      The contexts to return from the memoizer, keyed by indexable id.
	 * @param bool                     $expects_reset Whether each iteration is expected to reach reset_global_state.
	 *
	 * @return void
	 */
	private function stub_iteration( array $indexables, array $contexts, bool $expects_reset = true ): void {
		$this->indexable_helper->expects( 'should_index_indexables' )->once()->andReturnTrue();

		$indexable_repository = Mockery::mock( Indexable_Repository_Interface::class );
		$indexable_repository->expects( 'get' )->once()->andReturn( $indexables );
		$this->indexable_repository_factory->expects( 'get_repository' )->once()->with( true )->andReturn( $indexable_repository );

		$this->config->shouldReceive( 'get_allowed_post_types' )->andReturn( [ 'product' ] );

		foreach ( $indexables as $indexable ) {
			$this->global_state_adapter->expects( 'set_global_state' )->with( $indexable );
			if ( $expects_reset ) {
				$this->global_state_adapter->expects( 'reset_global_state' );
			}

			$this->indexable_helper->expects( 'get_page_type_for_indexable' )->with( $indexable )->andReturn( 'Product' );
			$this->memoizer->expects( 'get' )->with( $indexable, 'Product' )->andReturn( $contexts[ $indexable->id ] );
			$this->adapter->expects( 'meta_tags_context_to_array' )->with( $contexts[ $indexable->id ] )->andReturn( [ '@graph' => [] ] );
		}

		$this->external_repository->shouldReceive( 'supports' )->with( 'product' )->andReturnTrue();
		$this->enhancement_factory->shouldReceive( 'get_enhancer' )->andReturnNull();
	}

	/**
	 * Tests that for each indexable, the memoizer's current_page cache is swapped to the
	 * indexable's own context before collect() is called and restored afterwards.
	 *
	 * @return void
	 */
	public function test_swap_is_invoked_around_each_external_collect_call(): void {
		$indexable_a = $this->make_product_indexable( 1 );
		$indexable_b = $this->make_product_indexable( 2 );

		$context_a = Mockery::mock( Meta_Tags_Context::class );
		$context_b = Mockery::mock( Meta_Tags_Context::class );

		$this->stub_iteration(
			[ $indexable_a, $indexable_b ],
			[
				1 => $context_a,
				2 => $context_b,
			],
		);

		// Iteration 1: prime with context_a (no previous), collect, restore null.
		$this->memoizer->expects( 'swap_current_page' )->with( $context_a )->ordered()->andReturnNull();
		$this->external_repository->expects( 'collect' )->with( 1 )->ordered()->andReturn( [] );
		$this->memoizer->expects( 'swap_current_page' )->with( null )->ordered()->andReturnNull();

		// Iteration 2: prime with context_b (previous is null because we restored above), collect, restore null.
		$this->memoizer->expects( 'swap_current_page' )->with( $context_b )->ordered()->andReturnNull();
		$this->external_repository->expects( 'collect' )->with( 2 )->ordered()->andReturn( [] );
		$this->memoizer->expects( 'swap_current_page' )->with( null )->ordered()->andReturnNull();

		$this->instance->get( 1, 10, 'product' );
	}

	/**
	 * Tests that whatever swap_current_page returned before collect() is the value passed back
	 * after collect() — i.e. an existing current_page cache entry is preserved across the loop.
	 *
	 * @return void
	 */
	public function test_swap_restores_the_previously_cached_current_page(): void {
		$indexable = $this->make_product_indexable( 7 );
		$context   = Mockery::mock( Meta_Tags_Context::class );
		$previous  = Mockery::mock( Meta_Tags_Context::class );

		$this->stub_iteration( [ $indexable ], [ 7 => $context ] );

		$this->memoizer->expects( 'swap_current_page' )->with( $context )->ordered()->andReturn( $previous );
		$this->external_repository->expects( 'collect' )->with( 7 )->ordered()->andReturn( [] );
		$this->memoizer->expects( 'swap_current_page' )->with( $previous )->ordered()->andReturnNull();

		$this->instance->get( 1, 10, 'product' );
	}

	/**
	 * Tests that the previous current_page context is restored even when collect() throws.
	 *
	 * @return void
	 */
	public function test_swap_restores_when_collect_throws(): void {
		$indexable = $this->make_product_indexable( 9 );
		$context   = Mockery::mock( Meta_Tags_Context::class );
		$previous  = Mockery::mock( Meta_Tags_Context::class );

		$this->stub_iteration( [ $indexable ], [ 9 => $context ], false );

		$this->memoizer->expects( 'swap_current_page' )->with( $context )->ordered()->andReturn( $previous );
		$this->external_repository->expects( 'collect' )->with( 9 )->ordered()->andThrow( new RuntimeException( 'boom' ) );
		$this->memoizer->expects( 'swap_current_page' )->with( $previous )->ordered()->andReturnNull();

		$this->expectException( RuntimeException::class );
		$this->instance->get( 1, 10, 'product' );
	}
}
