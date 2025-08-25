<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\User_Interface\Generator_Integration;

use Yoast\WP\SEO\AI\Generate\User_Interface\Generator_Integration;
use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Conditionals\AI_Editor_Conditional;

/**
 * Tests the AI_Generator_Integration's conditional.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generator\User_Interface\Generator_Integration::get_conditionals
 */
final class Conditional_Test extends Abstract_Generator_Integration_Test {

	/**
	 * Tests the conditional.
	 *
	 * @return void
	 */
	public function test_conditional() {
		$expected = [ AI_Conditional::class, AI_Editor_Conditional::class ];
		$this->assertSame( $expected, Generator_Integration::get_conditionals() );
	}
}
