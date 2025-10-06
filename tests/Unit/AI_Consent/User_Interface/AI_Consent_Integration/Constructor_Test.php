<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Consent\User_Interface\AI_Consent_Integration;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Tests the Consent_Route's construct method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI_Consent\User_Interface\Ai_Consent_Integration::__construct
 */
final class Constructor_Test extends Abstract_AI_Consent_Integration_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			$this->getPropertyValue( $this->instance, 'asset_manager' )
		);
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);
		$this->assertInstanceOf(
			Short_Link_Helper::class,
			$this->getPropertyValue( $this->instance, 'short_link_helper' )
		);
	}
}
