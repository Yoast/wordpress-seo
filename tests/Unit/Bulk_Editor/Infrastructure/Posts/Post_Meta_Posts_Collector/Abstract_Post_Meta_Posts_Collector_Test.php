<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector;

use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Post_Meta_Posts_Collector tests.
 *
 * @group bulk-editor
 */
abstract class Abstract_Post_Meta_Posts_Collector_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * The WP_Query is instantiated internally, so we partial-mock the query_posts seam.
	 *
	 * @var Mockery\MockInterface|Post_Meta_Posts_Collector
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = Mockery::mock( Post_Meta_Posts_Collector::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}
}
