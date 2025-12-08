<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Aggregate_Site_Schema_Command_Handler;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Command_Handler;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Aggregator_Response_Composer;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Pieces_Aggregator;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Schema_Piece_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Aggregate_Site_Schema_Command_Handler tests.
 */
abstract class Abstract_Aggregate_Site_Schema_Command_Handler_Test extends TestCase {

	/**
	 * The schema piece repository mock.
	 *
	 * @var Mockery\MockInterface|Schema_Piece_Repository
	 */
	protected $schema_piece_repository;

	/**
	 * The schema piece aggregator mock.
	 *
	 * @var Mockery\MockInterface|Schema_Pieces_Aggregator
	 */
	protected $schema_piece_aggregator;

	/**
	 * The schema response composer mock.
	 *
	 * @var Mockery\MockInterface|Schema_Aggregator_Response_Composer
	 */
	protected $schema_response_composer;

	/**
	 * The instance under test.
	 *
	 * @var Aggregate_Site_Schema_Command_Handler
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->schema_piece_repository  = Mockery::mock( Schema_Piece_Repository::class );
		$this->schema_piece_aggregator  = Mockery::mock( Schema_Pieces_Aggregator::class );
		$this->schema_response_composer = Mockery::mock( Schema_Aggregator_Response_Composer::class );

		$this->instance = new Aggregate_Site_Schema_Command_Handler(
			$this->schema_piece_repository,
			$this->schema_piece_aggregator,
			$this->schema_response_composer
		);
	}
}
