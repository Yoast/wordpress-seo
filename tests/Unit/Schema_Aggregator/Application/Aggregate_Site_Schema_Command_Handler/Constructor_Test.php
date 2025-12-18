<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Aggregate_Site_Schema_Command_Handler;

use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Aggregator_Response_Composer;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Pieces_Aggregator;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Schema_Piece_Repository;

/**
 * Tests the Aggregate_Site_Schema_Command_Handler constructor.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Command_Handler::__construct
 */
final class Constructor_Test extends Abstract_Aggregate_Site_Schema_Command_Handler_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Schema_Piece_Repository::class,
			$this->getPropertyValue( $this->instance, 'schema_piece_repository' )
		);
		$this->assertInstanceOf(
			Schema_Pieces_Aggregator::class,
			$this->getPropertyValue( $this->instance, 'schema_piece_aggregator' )
		);
		$this->assertInstanceOf(
			Schema_Aggregator_Response_Composer::class,
			$this->getPropertyValue( $this->instance, 'schema_response_composer' )
		);
	}
}
