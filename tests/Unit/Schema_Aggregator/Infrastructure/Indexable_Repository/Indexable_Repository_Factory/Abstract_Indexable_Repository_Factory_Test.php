<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository_Factory;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository_Factory;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\WordPress_Query_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract test class for Indexable_Repository_Factory tests.
 */
abstract class Abstract_Indexable_Repository_Factory_Test extends TestCase {

	/**
	 * The instance of Indexable_Repository_Factory being tested.
	 *
	 * @var Indexable_Repository_Factory
	 */
	protected $instance;

	/**
	 * The indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The WordPress query repository mock.
	 *
	 * @var Mockery\MockInterface|WordPress_Query_Repository
	 */
	protected $wordpress_query_repository;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->indexable_repository       = Mockery::mock( Indexable_Repository::class );
		$this->wordpress_query_repository = Mockery::mock( WordPress_Query_Repository::class );
		$this->instance                   = new Indexable_Repository_Factory(
			$this->indexable_repository,
			$this->wordpress_query_repository
		);
	}
}
