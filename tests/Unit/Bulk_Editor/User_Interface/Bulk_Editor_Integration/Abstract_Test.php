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
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Bulk_Editor_Integration tests.
 *
 * @group bulk-editor
 */
abstract class Abstract_Test extends TestCase {

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
	 * Holds the User_Helper mock.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->asset_manager            = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->current_page_helper      = Mockery::mock( Current_Page_Helper::class );
		$this->product_helper           = Mockery::mock( Product_Helper::class );
		$this->short_link_helper        = Mockery::mock( Short_Link_Helper::class );
		$this->content_types_repository = Mockery::mock( Content_Types_Repository::class );
		$this->nonce_repository         = Mockery::mock( Nonce_Repository::class );
		$this->endpoints_repository     = Mockery::mock( Endpoints_Repository::class );
		$this->options_helper           = Mockery::mock( Options_Helper::class );
		$this->user_helper              = Mockery::mock( User_Helper::class );

		$this->instance = new Bulk_Editor_Integration(
			$this->asset_manager,
			$this->current_page_helper,
			$this->product_helper,
			$this->short_link_helper,
			$this->content_types_repository,
			$this->nonce_repository,
			$this->endpoints_repository,
			$this->options_helper,
			$this->user_helper,
		);
	}
}
