<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Indexable_Repository;

use Mockery;
use Yoast\WP\SEO\Repositories\Indexable_Repository as Base_Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests for the Indexable_Repository constructor.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository::__construct
 *
 * @group schema-aggregator
 */
final class Constructor_Test extends TestCase {

	/**
	 * The instance of Indexable_Repository being tested.
	 *
	 * @var Indexable_Repository
	 */
	protected $instance;

	/**
	 * The base indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Base_Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->indexable_repository = Mockery::mock( Base_Indexable_Repository::class );
		$this->instance             = new Indexable_Repository( $this->indexable_repository );
	}

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor(): void {
		$this->assertInstanceOf(
			Base_Indexable_Repository::class,
			$this->getPropertyValue( $this->instance, 'indexable_repository' )
		);
	}
}
