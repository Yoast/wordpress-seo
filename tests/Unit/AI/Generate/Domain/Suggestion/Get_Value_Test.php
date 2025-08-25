<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\Domain\Suggestion;

/**
 * Tests the Suggestion's get_value method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\Domain\Suggestion::get_value
 */
final class Get_Value_Test extends Abstract_Suggestion_Test {

	/**
	 * Tests the get_value method.
	 *
	 * @return void
	 */
	public function test_get_value() {
		$this->assertSame( 'test', $this->instance->get_value() );
	}
}
