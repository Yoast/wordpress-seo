<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Pieces\Schema_Piece_Repository;

use Mockery;
use RuntimeException;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository_Interface;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use YoastSEO_Vendor\Psr\Log\LoggerInterface;

/**
 * Tests that get() primes the memoizer's current_page cache with the per-indexable context
 * before the external collect() call, and that reset_global_state() runs even when collect throws.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Schema_Piece_Repository::get
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Sets_Current_Page_Context_Test extends Abstract_Schema_Piece_Repository_Test {

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
	 * Stubs every collaborator that is not relevant to the prime behaviour, leaving the
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
			$this->indexable_helper->expects( 'get_page_type_for_indexable' )->with( $indexable )->andReturn( 'Product' );
			$this->memoizer->expects( 'get' )->with( $indexable, 'Product' )->andReturn( $contexts[ $indexable->id ] );
			$this->adapter->expects( 'meta_tags_context_to_array' )->with( $contexts[ $indexable->id ] )->andReturn( [ '@graph' => [] ] );
			if ( $expects_reset ) {
				$this->global_state_adapter->expects( 'reset_global_state' );
			}
		}

		$this->external_repository->shouldReceive( 'supports' )->with( 'product' )->andReturnTrue();
		$this->enhancement_factory->shouldReceive( 'get_enhancer' )->andReturnNull();
	}

	/**
	 * Tests that for each indexable, set_global_state is called with the indexable and its
	 * own context (so the adapter primes the memoizer's current_page slot) before collect().
	 *
	 * @return void
	 */
	public function test_set_global_state_is_called_with_per_indexable_context(): void {
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

		// Iteration 1: set_global_state primes with context_a, then collect.
		$this->global_state_adapter->expects( 'set_global_state' )->with( $indexable_a, $context_a )->ordered();
		$this->external_repository->expects( 'collect' )->with( 1 )->ordered()->andReturn( [] );

		// Iteration 2: set_global_state primes with context_b, then collect.
		$this->global_state_adapter->expects( 'set_global_state' )->with( $indexable_b, $context_b )->ordered();
		$this->external_repository->expects( 'collect' )->with( 2 )->ordered()->andReturn( [] );

		$this->instance->get( 1, 10, 'product' );
	}

	/**
	 * Tests that reset_global_state still runs when collect() throws — the iteration body
	 * is wrapped in try/finally to guarantee teardown (which clears the memoizer slot).
	 *
	 * @return void
	 */
	public function test_reset_global_state_runs_when_collect_throws(): void {
		$indexable = $this->make_product_indexable( 9 );
		$context   = Mockery::mock( Meta_Tags_Context::class );

		$this->stub_iteration( [ $indexable ], [ 9 => $context ] );

		$this->global_state_adapter->expects( 'set_global_state' )->with( $indexable, $context )->ordered();
		$this->external_repository->expects( 'collect' )->with( 9 )->ordered()->andThrow( new RuntimeException( 'boom' ) );

		$this->expectException( RuntimeException::class );
		$this->instance->get( 1, 10, 'product' );
	}
}
