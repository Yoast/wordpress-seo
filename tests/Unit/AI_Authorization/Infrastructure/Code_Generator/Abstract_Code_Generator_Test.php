<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure\Code_Generator;

use Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Generator;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Code_Generator tests.
 *
 * @group ai-authorization
 */
abstract class Abstract_Code_Generator_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Code_Generator
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Code_Generator();
	}
}
