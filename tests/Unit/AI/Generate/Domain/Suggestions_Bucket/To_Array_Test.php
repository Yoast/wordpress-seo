<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\Domain\Suggestions_Bucket;

use Yoast\WP\SEO\AI\Generate\Domain\Suggestion;

/**
 * Tests the Suggestions_Bucket's to_array method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generate\Domain\Suggestions_Bucket::to_array
 */
final class To_Array_Test extends Abstract_Suggestions_Bucket_Test {

	/**
	 * Tests the to_array method.
	 *
	 * @return void
	 */
	public function test_to_array() {
		$this->instance->add_suggestion( new Suggestion( 'test' ) );

		$this->assertContains( 'test', $this->instance->to_array() );
	}
}
