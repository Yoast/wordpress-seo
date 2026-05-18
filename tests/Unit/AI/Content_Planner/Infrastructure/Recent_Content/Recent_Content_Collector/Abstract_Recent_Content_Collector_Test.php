<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Infrastructure\Recent_Content\Recent_Content_Collector;

use Mockery;
use Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Recent_Content\Recent_Content_Collector;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Recent_Content_Collector tests.
 *
 * @group ai-content-planner
 */
abstract class Abstract_Recent_Content_Collector_Test extends TestCase {

	/**
	 * The indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The primary term repository mock.
	 *
	 * @var Mockery\MockInterface|Primary_Term_Repository
	 */
	protected $primary_term_repository;

	/**
	 * The instance under test.
	 *
	 * @var Recent_Content_Collector
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository    = Mockery::mock( Indexable_Repository::class );
		$this->primary_term_repository = Mockery::mock( Primary_Term_Repository::class );

		$this->instance = new Recent_Content_Collector(
			$this->indexable_repository,
			$this->primary_term_repository,
		);
	}
}
