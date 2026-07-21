<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Types_Repository;
use Yoast\WP\SEO\Bulk_Editor\Application\Endpoints\Endpoints_Repository;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Nonces\Nonce_Repository;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Connection_Permission;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Status_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Bulk_Editor_Integration tests.
 *
 * @group bulk-editor
 */
abstract class Abstract_Bulk_Editor_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Bulk_Editor_Integration
	 */
	protected $instance;

	/**
	 * Holds the WPSEO_Admin_Asset_Manager mock.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Holds the Current_Page_Helper mock.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	protected $current_page_helper;

	/**
	 * Holds the Product_Helper mock.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	protected $product_helper;

	/**
	 * Holds the Short_Link_Helper mock.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * Holds the Content_Types_Repository mock.
	 *
	 * @var Mockery\MockInterface|Content_Types_Repository
	 */
	protected $content_types_repository;

	/**
	 * Holds the Nonce_Repository mock.
	 *
	 * @var Mockery\MockInterface|Nonce_Repository
	 */
	protected $nonce_repository;

	/**
	 * Holds the Endpoints_Repository mock.
	 *
	 * @var Mockery\MockInterface|Endpoints_Repository
	 */
	protected $endpoints_repository;

	/**
	 * Holds the Options_Helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Holds the MyYoast_Connection_Conditional mock.
	 *
	 * @var Mockery\MockInterface|MyYoast_Connection_Conditional
	 */
	protected $myyoast_connection_conditional;

	/**
	 * Holds the Status_Presenter mock.
	 *
	 * @var Mockery\MockInterface|Status_Presenter
	 */
	protected $status_presenter;

	/**
	 * Holds the Connection_Permission mock.
	 *
	 * @var Mockery\MockInterface|Connection_Permission
	 */
	protected $connection_permission;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->asset_manager                  = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->current_page_helper            = Mockery::mock( Current_Page_Helper::class );
		$this->product_helper                 = Mockery::mock( Product_Helper::class );
		$this->short_link_helper              = Mockery::mock( Short_Link_Helper::class );
		$this->content_types_repository       = Mockery::mock( Content_Types_Repository::class );
		$this->nonce_repository               = Mockery::mock( Nonce_Repository::class );
		$this->endpoints_repository           = Mockery::mock( Endpoints_Repository::class );
		$this->options_helper                 = Mockery::mock( Options_Helper::class );
		$this->myyoast_connection_conditional = Mockery::mock( MyYoast_Connection_Conditional::class );
		$this->status_presenter               = Mockery::mock( Status_Presenter::class );
		$this->connection_permission          = Mockery::mock( Connection_Permission::class );

		$this->instance = new Bulk_Editor_Integration(
			$this->asset_manager,
			$this->current_page_helper,
			$this->product_helper,
			$this->short_link_helper,
			$this->content_types_repository,
			$this->nonce_repository,
			$this->endpoints_repository,
			$this->options_helper,
			$this->myyoast_connection_conditional,
			$this->status_presenter,
			$this->connection_permission,
		);
	}
}
