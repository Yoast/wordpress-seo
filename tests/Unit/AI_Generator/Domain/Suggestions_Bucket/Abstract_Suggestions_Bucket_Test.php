<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Domain\Suggestions_Bucket;

use Yoast\WP\SEO\AI_Generator\Domain\Suggestions_Bucket;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Suggestions_Bucket tests.
 *
 * @group ai-generator
 */
abstract class Abstract_Suggestions_Bucket_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Suggestions_Bucket
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Suggestions_Bucket( 'test' );
	}
}
