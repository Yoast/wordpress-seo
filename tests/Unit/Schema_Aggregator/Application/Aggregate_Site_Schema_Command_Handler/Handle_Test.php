<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Aggregate_Site_Schema_Command_Handler;

use Generator;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Command;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection;

/**
 * Tests the Aggregate_Site_Schema_Command_Handler handle method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Command_Handler::handle
 */
final class Handle_Test extends Abstract_Aggregate_Site_Schema_Command_Handler_Test {

	/**
	 * Tests handle method orchestrates the aggregation process correctly.
	 *
	 * @dataProvider handle_orchestration_provider
	 *
	 * @param int                     $page              The page number.
	 * @param int                     $per_page          The items per page.
	 * @param string                  $post_type         The post type.
	 * @param Schema_Piece_Collection $schema_pieces     The schema pieces to return.
	 * @param Schema_Piece_Collection $aggregated_pieces The aggregated pieces.
	 * @param array<string>           $composed_response The composed response.
	 *
	 * @return void
	 */
	public function test_handle_orchestrates_aggregation_process(
		int $page,
		int $per_page,
		string $post_type,
		Schema_Piece_Collection $schema_pieces,
		Schema_Piece_Collection $aggregated_pieces,
		array $composed_response
	) {
		$command = new Aggregate_Site_Schema_Command( $page, $per_page, $post_type );

		$this->schema_piece_repository
			->expects( 'get' )
			->once()
			->with( $page, $per_page, $post_type )
			->andReturn( $schema_pieces );

		$this->schema_piece_aggregator
			->expects( 'aggregate' )
			->once()
			->with( $schema_pieces )
			->andReturn( $aggregated_pieces );

		$this->schema_response_composer
			->expects( 'compose' )
			->once()
			->with( $aggregated_pieces, false )
			->andReturn( $composed_response );

		$result = $this->instance->handle( $command );

		$this->assertSame( $composed_response, $result );
	}

	/**
	 * Tests handle method returns array.
	 *
	 * @return void
	 */
	public function test_handle_returns_array() {
		$command = new Aggregate_Site_Schema_Command( 1, 50, 'post' );

		$this->schema_piece_repository
			->expects( 'get' )
			->andReturn( new Schema_Piece_Collection() );

		$this->schema_piece_aggregator
			->expects( 'aggregate' )
			->andReturn( new Schema_Piece_Collection() );

		$this->schema_response_composer
			->expects( 'compose' )
			->andReturn( [] );

		$result = $this->instance->handle( $command );

		$this->assertIsArray( $result );
	}

	/**
	 * Data provider for handle orchestration tests.
	 *
	 * @return Generator
	 */
	public static function handle_orchestration_provider() {
		$schema_piece_1 = new Schema_Piece( [ '@type' => 'Article' ], 'mainEntity' );
		$schema_piece_2 = new Schema_Piece( [ '@type' => 'Person' ], 'author' );

		yield 'Standard post aggregation' => [
			'page'              => 1,
			'per_page'          => 50,
			'post_type'         => 'post',
			'schema_pieces'     => new Schema_Piece_Collection( [ $schema_piece_1, $schema_piece_2 ] ),
			'aggregated_pieces' => new Schema_Piece_Collection( [ $schema_piece_1 ] ),
			'composed_response' => [ 'response' => 'data' ],
		];

		yield 'Different page controls' => [
			'page'              => 2,
			'per_page'          => 100,
			'post_type'         => 'page',
			'schema_pieces'     => new Schema_Piece_Collection(),
			'aggregated_pieces' => new Schema_Piece_Collection(),
			'composed_response' => [],
		];

		yield 'Custom post type' => [
			'page'              => 1,
			'per_page'          => 25,
			'post_type'         => 'product',
			'schema_pieces'     => new Schema_Piece_Collection(),
			'aggregated_pieces' => new Schema_Piece_Collection( [ $schema_piece_1 ] ),
			'composed_response' => [ 'final' => 'response' ],
		];
	}
}
