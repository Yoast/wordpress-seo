<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Types_Repository;
use Yoast\WP\SEO\Bulk_Editor\Application\Endpoints\Endpoints_Repository;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Nonces\Nonce_Repository;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Connection_Permission;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Status_Presenter;

/**
 * Tests the Bulk_Editor_Integration constructor.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::__construct
 */
final class Constructor_Test extends Abstract_Bulk_Editor_Integration_Test {

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
			Current_Page_Helper::class,
			$this->getPropertyValue( $this->instance, 'current_page_helper' ),
		);
		$this->assertInstanceOf(
			Product_Helper::class,
			$this->getPropertyValue( $this->instance, 'product_helper' ),
		);
		$this->assertInstanceOf(
			Short_Link_Helper::class,
			$this->getPropertyValue( $this->instance, 'short_link_helper' ),
		);
		$this->assertInstanceOf(
			Content_Types_Repository::class,
			$this->getPropertyValue( $this->instance, 'content_types_repository' ),
		);
		$this->assertInstanceOf(
			Nonce_Repository::class,
			$this->getPropertyValue( $this->instance, 'nonce_repository' ),
		);
		$this->assertInstanceOf(
			Endpoints_Repository::class,
			$this->getPropertyValue( $this->instance, 'endpoints_repository' ),
		);
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' ),
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
			Connection_Permission::class,
			$this->getPropertyValue( $this->instance, 'connection_permission' ),
		);
	}
}
