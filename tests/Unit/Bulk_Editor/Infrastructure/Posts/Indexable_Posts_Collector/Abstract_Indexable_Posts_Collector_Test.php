<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Indexable_Posts_Collector;

use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Indexable_Posts_Collector;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Indexable_Posts_Collector tests.
 *
 * @group bulk-editor
 */
abstract class Abstract_Indexable_Posts_Collector_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Indexable_Posts_Collector
	 */
	protected $instance;

	/**
	 * Holds the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );

		$this->instance = new Indexable_Posts_Collector( $this->indexable_repository );
	}
}
