<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\Domain\Suggestions_Bucket;

use Yoast\WP\SEO\AI\Generate\Domain\Suggestion;

/**
 * Tests the Suggestions_Bucket's add_suggestion method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generate\Domain\Suggestions_Bucket::add_suggestion
 */
final class Add_Suggestion_Test extends Abstract_Suggestions_Bucket_Test {

	/**
	 * Tests the add_suggestion method.
	 *
	 * @return void
	 */
	public function test_add_suggestion() {
		$this->instance->add_suggestion( new Suggestion( 'test' ) );

		$suggestions = $this->getPropertyValue( $this->instance, 'suggestions' );

		$this->assertArrayHasKey( 0, $suggestions );
		$this->assertInstanceOf( Suggestion::class, $suggestions[0] );
		$this->assertSame( 'test', $suggestions[0]->get_value() );
	}
}
