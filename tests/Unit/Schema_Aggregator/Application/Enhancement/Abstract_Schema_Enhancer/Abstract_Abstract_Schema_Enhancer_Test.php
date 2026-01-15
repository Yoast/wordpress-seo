<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Abstract_Schema_Enhancer;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Abstract_Schema_Enhancer tests.
 */
abstract class Abstract_Abstract_Schema_Enhancer_Test extends TestCase {

	/**
	 * The instance under test (concrete implementation for testing).
	 *
	 * @var Concrete_Schema_Enhancer_For_Testing
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Concrete_Schema_Enhancer_For_Testing();
	}
}
