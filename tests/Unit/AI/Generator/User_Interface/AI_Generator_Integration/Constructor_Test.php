<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\User_Interface\AI_Generator_Integration;

use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Introductions\Infrastructure\Introductions_Seen_Repository;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Status_Presenter;

/**
 * Tests the AI_Generator_Integration's construct method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generator\User_Interface\Ai_Generator_Integration::__construct
 */
final class Constructor_Test extends Abstract_AI_Generator_Integration_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			$this->getPropertyValue( $this->instance, 'asset_manager' ),
		);
		$this->assertInstanceOf(
			WPSEO_Addon_Manager::class,
			$this->getPropertyValue( $this->instance, 'addon_manager' ),
		);
		$this->assertInstanceOf(
			API_Client::class,
			$this->getPropertyValue( $this->instance, 'api_client' ),
		);
		$this->assertInstanceOf(
			Current_Page_Helper::class,
			$this->getPropertyValue( $this->instance, 'current_page_helper' ),
		);
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' ),
		);
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' ),
		);
		$this->assertInstanceOf(
			Introductions_Seen_Repository::class,
			$this->getPropertyValue( $this->instance, 'introductions_seen_repository' ),
		);
		$this->assertInstanceOf(
			MyYoast_Connection_Conditional::class,
			$this->getPropertyValue( $this->instance, 'myyoast_connection_conditional' ),
		);
		$this->assertInstanceOf(
			Status_Presenter::class,
			$this->getPropertyValue( $this->instance, 'status_presenter' ),
		);
		$this->assertInstanceOf(
			Short_Link_Helper::class,
			$this->getPropertyValue( $this->instance, 'short_link_helper' ),
		);
	}
}
