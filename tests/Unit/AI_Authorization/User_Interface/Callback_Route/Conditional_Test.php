<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\User_Interface\Callback_Route;

use Yoast\WP\SEO\AI_Authorization\User_Interface\Callback_Route;
use Yoast\WP\SEO\Conditionals\AI_Conditional;

/**
 * Tests the Abstract_Callback_Route's conditional.
 *
 * @group ai-authorization
 *
 * @covers \Yoast\WP\SEO\AI_Authorization\User_Interface\Abstract_Callback_Route::get_conditionals
 */
final class Conditional_Test extends Abstract_Callback_Route_Test {

	/**
	 * Tests the conditional.
	 *
	 * @return void
	 */
	public function test_conditional() {
		$expected = [ AI_Conditional::class ];
		$this->assertSame( $expected, Callback_Route::get_conditionals() );
	}
}
