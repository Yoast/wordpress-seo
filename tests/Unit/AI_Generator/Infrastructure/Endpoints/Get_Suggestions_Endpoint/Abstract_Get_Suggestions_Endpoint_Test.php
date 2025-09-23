<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Infrastructure\Endpoints\Get_Suggestions_Endpoint;

use Yoast\WP\SEO\AI_Generator\Infrastructure\Endpoints\Get_Suggestions_Endpoint;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Get_Suggestions_Endpoint tests.
 *
 * @group ai-generator
 */
abstract class Abstract_Get_Suggestions_Endpoint_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Get_Suggestions_Endpoint
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Get_Suggestions_Endpoint();
	}
}
