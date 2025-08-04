<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Domain\Suggestions_Bucket;

use ReflectionProperty;
use Yoast\WP\SEO\AI_Generator\Domain\Suggestion;

/**
 * Tests the Suggestions_Bucket's add_suggestion method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\Domain\Suggestions_Bucket::add_suggestion
 */
final class Add_Suggestion_Test extends Abstract_Suggestions_Bucket_Test {

	/**
	 * Tests the add_suggestion method.
	 *
	 * @return void
	 */
	public function test_add_suggestion() {
		$this->instance->add_suggestion( new Suggestion( 'test' ) );

		$suggestions = new ReflectionProperty( $this->instance, 'suggestions' );
		$suggestions->setAccessible( true );

		$this->assertArrayHasKey( 0, $suggestions->getValue( $this->instance ) );

		$suggestion = $suggestions->getValue( $this->instance )[0];

		$this->assertInstanceOf( Suggestion::class, $suggestion );
		$this->assertSame( 'test', $suggestion->get_value() );
	}
}
