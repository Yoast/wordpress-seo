<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Pieces\Edd_Schema_Piece_Repository;

/**
 * Test class for the collect method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Edd_Schema_Piece_Repository::collect
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Edd_Schema_Piece_Repository_Collect_Test extends Abstract_Edd_Schema_Piece_Repository_Test {

	/**
	 * Tests that collect returns empty array when EDD is not active.
	 *
	 * @return void
	 */
	public function test_collect_returns_empty_array_when_edd_not_active() {
		$this->edd_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( false );

		$result = $this->instance->collect( 123 );

		$this->assertSame( [], $result );
	}
}
