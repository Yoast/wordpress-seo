<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Consent\Application\Consent_Handler;

/**
 * Tests the Consent_Handler's grant_consent method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI_Consent\Application\Consent_Handler::grant_consent
 */
final class Grant_Consent_Test extends Abstract_Consent_Handler_Test {

	/**
	 * Tests granting the consent.
	 *
	 * @return void
	 */
	public function test_grant_consent() {
		// Current user ID is used for the consent permission.
		$user_id = 1;
		// Has consent.
		$this->user_helper->expects( 'update_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_consent', true )
			->andReturn( true );

		$this->instance->grant_consent( $user_id );
	}
}
