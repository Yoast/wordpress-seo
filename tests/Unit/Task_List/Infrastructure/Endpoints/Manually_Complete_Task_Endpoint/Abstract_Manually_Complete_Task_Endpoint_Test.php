<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Endpoints\Manually_Complete_Task_Endpoint;

use Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Manually_Complete_Task_Endpoint;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the manually complete task endpoint tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Manually_Complete_Task_Endpoint_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Manually_Complete_Task_Endpoint
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Manually_Complete_Task_Endpoint();
	}
}
