<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\User_Interface\Get_Suggestions_Route;

use Yoast\WP\SEO\AI\Generate\User_Interface\Get_Suggestions_Route;
use Yoast\WP\SEO\Conditionals\AI_Conditional;

/**
 * Tests the Get_Suggestions_Route's conditional.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\User_Interface\Get_Suggestions_Route::get_conditionals
 */
final class Conditional_Test extends Abstract_Get_Suggestions_Route_Test {

	/**
	 * Tests the conditional.
	 *
	 * @return void
	 */
	public function test_conditional() {
		$expected = [ AI_Conditional::class ];
		$this->assertSame( $expected, Get_Suggestions_Route::get_conditionals() );
	}
}
