<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Infrastructure\Endpoints\Banner_Permanent_Dismissal_Endpoint;

use Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Endpoints\Banner_Permanent_Dismissal_Endpoint;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Banner_Permanent_Dismissal_Endpoint tests.
 *
 * @group ai-content-planner
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Banner_Permanent_Dismissal_Endpoint_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Banner_Permanent_Dismissal_Endpoint
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Banner_Permanent_Dismissal_Endpoint();
	}
}
