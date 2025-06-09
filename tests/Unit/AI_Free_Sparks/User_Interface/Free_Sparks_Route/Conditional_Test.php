<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Free_Sparks\User_Interface\Free_Sparks_Route;

use Yoast\WP\SEO\AI_Free_Sparks\User_Interface\Free_Sparks_Route;
use Yoast\WP\SEO\Conditionals\AI_Conditional;

/**
 * Tests the Free_Sparks_Route's conditional.
 *
 * @group ai-free-sparks
 *
 * @covers \Yoast\WP\SEO\AI_Free_Sparks\User_Interface\Free_Sparks_Route::_conditional
 */
final class Conditional_Test extends Abstract_Free_Sparks_Route_Test {

	/**
	 * Tests the conditional.
	 *
	 * @return void
	 */
	public function test_conditional() {
		$expected = [ AI_Conditional::class ];
		self::assertSame( $expected, Free_Sparks_Route::get_conditionals() );
	}
}
