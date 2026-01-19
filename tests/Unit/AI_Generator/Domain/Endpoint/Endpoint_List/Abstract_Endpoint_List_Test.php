<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Domain\Endpoint\Endpoint_List;

use Yoast\WP\SEO\AI_Generator\Domain\Endpoint\Endpoint_List;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Endpoint_List tests.
 *
 * @group ai-generator
 */
abstract class Abstract_Endpoint_List_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Endpoint_List
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Endpoint_List();
	}
}
