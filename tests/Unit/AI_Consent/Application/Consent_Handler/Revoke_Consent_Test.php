<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Consent\Application\Consent_Handler;

/**
 * Tests the Consent_Handler's revoke_consent method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI_Consent\Application\Consent_Handler::revoke_consent
 */
final class Revoke_Consent_Test extends Abstract_Consent_Handler_Test {

	/**
	 * Tests revoking the consent.
	 *
	 * @return void
	 */
	public function test_revoke_consent() {
		// Current user ID is used for the consent permission.
		$user_id = 1;

		$this->user_helper->expects( 'delete_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_consent' )
			->andReturn( true );

		$this->instance->revoke_consent( $user_id );
	}
}
