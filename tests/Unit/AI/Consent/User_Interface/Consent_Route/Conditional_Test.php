<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Consent\User_Interface\Consent_Route;

use Yoast\WP\SEO\AI\Consent\User_Interface\Consent_Route;
use Yoast\WP\SEO\Conditionals\AI_Conditional;

/**
 * Tests the Consent_Route's conditional.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI\Consent\User_Interface\Consent_Route::get_conditionals
 */
final class Conditional_Test extends Abstract_Consent_Route_Test {

	/**
	 * Tests the conditional.
	 *
	 * @return void
	 */
	public function test_conditional() {
		$expected = [ AI_Conditional::class ];
		$this->assertSame( $expected, Consent_Route::get_conditionals() );
	}
}
