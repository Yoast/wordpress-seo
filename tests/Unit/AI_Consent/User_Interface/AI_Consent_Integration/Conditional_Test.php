<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Consent\User_Interface\AI_Consent_Integration;

use Yoast\WP\SEO\AI_Consent\User_Interface\Ai_Consent_Integration;
use Yoast\WP\SEO\Conditionals\User_Profile_Conditional;

/**
 * Tests the Ai_Consent_Integration's conditional.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI_Consent\User_Interface\Ai_Consent_Integration::get_conditionals
 */
final class Conditional_Test extends Abstract_AI_Consent_Integration_Test {

	/**
	 * Tests the conditional.
	 *
	 * @return void
	 */
	public function test_conditional() {
		$expected = [ User_Profile_Conditional::class ];
		$this->assertSame( $expected, Ai_Consent_Integration::get_conditionals() );
	}
}
