<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\User_Interface\Get_Usage_Route;

use Yoast\WP\SEO\AI_Generator\User_Interface\Get_Usage_Route;
use Yoast\WP\SEO\Conditionals\AI_Conditional;

/**
 * Tests the Get_Usage_Route's conditional.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\User_Interface\Get_Usage_Route::get_conditionals
 */
final class Conditional_Test extends Abstract_Get_Usage_Route_Test {

	/**
	 * Tests the conditional.
	 *
	 * @return void
	 */
	public function test_conditional() {
		$expected = [ AI_Conditional::class ];
		$this->assertSame( $expected, Get_Usage_Route::get_conditionals() );
	}
}
