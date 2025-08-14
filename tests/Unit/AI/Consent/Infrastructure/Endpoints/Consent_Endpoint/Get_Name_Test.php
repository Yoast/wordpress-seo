<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Consent\Infrastructure\Endpoints\Consent_Endpoint;

/**
 * Tests the Consent_Endpoint constructor.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI\Consent\Infrastructure\Endpoints\Consent_Endpoint::get_name
 */
final class Get_Name_Test extends Abstract_Consent_Endpoint_Test {

	/**
	 * Tests the get_name method.
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'consent', $this->instance->get_name() );
	}
}
