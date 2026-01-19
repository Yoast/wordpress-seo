<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Schema_Aggregator_Conditional tests.
 *
 * @group schema-aggregator
 */
abstract class Abstract_Schema_Aggregator_Conditional_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Schema_Aggregator_Conditional
	 */
	protected $instance;

	/**
	 * Holds the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options = Mockery::mock( Options_Helper::class );

		$this->instance = new Schema_Aggregator_Conditional(
			$this->options
		);
	}
}
