<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\User_Interface\Bust_Subscription_Cache_Route;

use Yoast\WP\SEO\AI\Generate\User_Interface\Bust_Subscription_Cache_Route;
use Yoast\WP\SEO\Conditionals\AI_Conditional;

/**
 * Tests the Bust_Subscription_Cache_Route's conditional.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\User_Interface\Bust_Subscription_Cache_Route::get_conditionals
 */
final class Conditional_Test extends Abstract_Bust_Subscription_Cache_Route_Test {

	/**
	 * Tests the conditional.
	 *
	 * @return void
	 */
	public function test_conditional() {
		$expected = [ AI_Conditional::class ];
		$this->assertSame( $expected, Bust_Subscription_Cache_Route::get_conditionals() );
	}
}
