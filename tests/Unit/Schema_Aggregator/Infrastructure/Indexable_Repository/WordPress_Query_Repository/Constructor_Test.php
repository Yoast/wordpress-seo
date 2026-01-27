<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Indexable_Repository\WordPress_Query_Repository;

use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Repositories\Indexable_Repository as Pure_Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\WordPress_Query_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests for the WordPress_Query_Repository constructor.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\WordPress_Query_Repository::__construct
 *
 * @group schema-aggregator
 */
final class Constructor_Test extends TestCase {

	/**
	 * The instance of WordPress_Query_Repository being tested.
	 *
	 * @var WordPress_Query_Repository
	 */
	protected $instance;

	/**
	 * The indexable builder mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	protected $indexable_builder;

	/**
	 * The indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Pure_Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->indexable_builder    = Mockery::mock( Indexable_Builder::class );
		$this->indexable_repository = Mockery::mock( Pure_Indexable_Repository::class );
		$this->instance             = new WordPress_Query_Repository( $this->indexable_builder, $this->indexable_repository );
	}

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor(): void {
		$this->assertInstanceOf(
			Indexable_Builder::class,
			$this->getPropertyValue( $this->instance, 'indexable_builder' )
		);

		$this->assertInstanceOf(
			Pure_Indexable_Repository::class,
			$this->getPropertyValue( $this->instance, 'indexable_repository' )
		);
	}
}
