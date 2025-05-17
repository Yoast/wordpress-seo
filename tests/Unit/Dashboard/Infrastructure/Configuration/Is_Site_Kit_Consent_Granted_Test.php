<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Configuration;

/**
 * Test class for the is_consent_granted method.
 *
 * @group Site_Kit_Consent_Repository
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Site_Kit_Consent_Repository::is_consent_granted
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Is_Site_Kit_Consent_Granted_Test extends Abstract_Site_Kit_Consent_Repository_Test {

	/**
	 * Tests if Site kit consent is granted.
	 *
	 * @return void
	 */
	public function test_is_consent_granted() {
		$this->options_helper->shouldReceive( 'get' )
			->with( 'site_kit_connected', false )
			->andReturn( true );

		$this->assertTrue( $this->instance->is_consent_granted() );
	}
}
