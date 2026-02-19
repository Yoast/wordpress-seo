<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Pieces\Schema_Piece_Repository;

use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Schema_Enhancement_Factory;
use Yoast\WP\SEO\Schema_Aggregator\Domain\External_Schema_Piece_Repository_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Aggregator_Config;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository_Factory;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Meta_Tags_Context_Memoizer_Adapter;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\WordPress_Global_State_Adapter;

/**
 * Tests for the Schema_Piece_Repository constructor.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Schema_Piece_Repository::__construct
 *
 * @group schema-aggregator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Constructor_Test extends Abstract_Schema_Piece_Repository_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor(): void {
		$this->assertInstanceOf(
			Meta_Tags_Context_Memoizer::class,
			$this->getPropertyValue( $this->instance, 'memoizer' ),
		);

		$this->assertInstanceOf(
			Indexable_Helper::class,
			$this->getPropertyValue( $this->instance, 'indexable_helper' ),
		);

		$this->assertInstanceOf(
			Meta_Tags_Context_Memoizer_Adapter::class,
			$this->getPropertyValue( $this->instance, 'adapter' ),
		);

		$this->assertInstanceOf(
			Aggregator_Config::class,
			$this->getPropertyValue( $this->instance, 'config' ),
		);

		$this->assertInstanceOf(
			Schema_Enhancement_Factory::class,
			$this->getPropertyValue( $this->instance, 'enhancement_factory' ),
		);

		$this->assertInstanceOf(
			Indexable_Repository_Factory::class,
			$this->getPropertyValue( $this->instance, 'indexable_repository_factory' ),
		);

		$this->assertInstanceOf(
			WordPress_Global_State_Adapter::class,
			$this->getPropertyValue( $this->instance, 'global_state_adapter' ),
		);

		$external_repositories = $this->getPropertyValue( $this->instance, 'external_repositories' );
		$this->assertIsArray( $external_repositories );
		$this->assertCount( 1, $external_repositories );
		$this->assertInstanceOf(
			External_Schema_Piece_Repository_Interface::class,
			$external_repositories[0],
		);
	}
}
