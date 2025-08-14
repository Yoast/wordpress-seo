<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Domain\Suggestions_Bucket;

use Yoast\WP\SEO\AI_Generator\Domain\Suggestions_Bucket;

/**
 * Tests the Suggestions_Bucket constructor.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\Domain\Suggestions_Bucket::__construct
 */
final class Constructor_Test extends Abstract_Suggestions_Bucket_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Suggestions_Bucket::class, $this->instance );
	}
}
