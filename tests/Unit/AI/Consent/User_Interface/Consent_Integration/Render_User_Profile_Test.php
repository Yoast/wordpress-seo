<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Consent\User_Interface\Consent_Integration;

/**
 * Tests the AI_Consent_Integration's render_user_profile method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI\Consent\User_Interface\Consent_Integration::render_user_profile
 */
final class Render_User_Profile_Test extends Abstract_Consent_Integration_Test {

	/**
	 * Tests rendering the user profile.
	 *
	 * @return void
	 */
	public function test_render_user_profile() {
		$this->stubTranslationFunctions();

		$this->expectOutputString( '<label for="ai-generator-consent-button">AI features</label><div id="ai-generator-consent" style="display:inline-block; margin-top: 28px; padding-left:5px;"></div>' );

		$this->instance->render_user_profile();
	}
}
