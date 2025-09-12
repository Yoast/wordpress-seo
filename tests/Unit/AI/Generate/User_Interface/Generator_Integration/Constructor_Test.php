<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\User_Interface\Generator_Integration;

use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI\Free_Sparks\Application\Free_Sparks_Endpoints_Repository;
use Yoast\WP\SEO\AI\Generate\Application\Generator_Endpoints_Repository;
use Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Introductions\Infrastructure\Introductions_Seen_Repository;


/**
 * Tests the AI_Generator_Integration's construct method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generate\User_Interface\Generator_Integration::__construct
 */
final class Constructor_Test extends Abstract_Generator_Integration_Test {

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
			WPSEO_Addon_Manager::class,
			$this->getPropertyValue( $this->instance, 'addon_manager' )
		);
		$this->assertInstanceOf(
			API_Client::class,
			$this->getPropertyValue( $this->instance, 'api_client' )
		);
		$this->assertInstanceOf(
			Current_Page_Helper::class,
			$this->getPropertyValue( $this->instance, 'current_page_helper' )
		);
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);
		$this->assertInstanceOf(
			Introductions_Seen_Repository::class,
			$this->getPropertyValue( $this->instance, 'introductions_seen_repository' )
		);
		$this->assertInstanceOf(
			Generator_Endpoints_Repository::class,
			$this->getPropertyValue( $this->instance, 'generator_endpoints_repository' )
		);
		$this->assertInstanceOf(
			Free_Sparks_Endpoints_Repository::class,
			$this->getPropertyValue( $this->instance, 'free_sparks_endpoints_repository' )
		);
	}
}
