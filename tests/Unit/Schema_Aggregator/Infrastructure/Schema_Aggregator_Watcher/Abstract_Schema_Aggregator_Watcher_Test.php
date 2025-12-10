<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Aggregator_Watcher;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Schema_Aggregator_Watcher tests.
 *
 * @group schema-aggregator
 */
abstract class Abstract_Schema_Aggregator_Watcher_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Schema_Aggregator_Watcher
	 */
	protected $instance;

	/**
	 * Holds the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->instance = new Schema_Aggregator_Watcher(
			$this->options_helper
		);
	}
}
