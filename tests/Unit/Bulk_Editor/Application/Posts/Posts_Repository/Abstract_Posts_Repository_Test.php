<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Application\Posts\Posts_Repository;

use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Application\Posts\Posts_Repository;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Indexable_Posts_Collector;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Posts_Repository tests.
 *
 * @group bulk-editor
 */
abstract class Abstract_Posts_Repository_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Posts_Repository
	 */
	protected $instance;

	/**
	 * Holds the indexable posts collector.
	 *
	 * @var Mockery\MockInterface|Indexable_Posts_Collector
	 */
	protected $indexable_posts_collector;

	/**
	 * Holds the post meta posts collector.
	 *
	 * @var Mockery\MockInterface|Post_Meta_Posts_Collector
	 */
	protected $post_meta_posts_collector;

	/**
	 * Holds the indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_posts_collector = Mockery::mock( Indexable_Posts_Collector::class );
		$this->post_meta_posts_collector = Mockery::mock( Post_Meta_Posts_Collector::class );
		$this->indexable_helper          = Mockery::mock( Indexable_Helper::class );

		$this->instance = new Posts_Repository(
			$this->indexable_posts_collector,
			$this->post_meta_posts_collector,
			$this->indexable_helper,
		);
	}
}
