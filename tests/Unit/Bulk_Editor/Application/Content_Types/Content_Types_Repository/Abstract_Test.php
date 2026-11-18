<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Application\Content_Types\Content_Types_Repository;

use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Types_Repository;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Content_Types\Content_Types_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Content_Types_Repository tests.
 *
 * @group bulk-editor
 */
abstract class Abstract_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Content_Types_Repository
	 */
	protected $instance;

	/**
	 * Holds the content types collector.
	 *
	 * @var Mockery\MockInterface|Content_Types_Collector
	 */
	protected $content_types_collector;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->content_types_collector = Mockery::mock( Content_Types_Collector::class );

		$this->instance = new Content_Types_Repository( $this->content_types_collector );
	}
}
