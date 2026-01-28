<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Setup;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit;
use Yoast\WP\SEO\Dashboard\User_Interface\Setup\Setup_Flow_Interceptor;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Setup_Flow_Interceptor tests.
 *
 * @group  site_kit_setup_flow
 *
 * @phpcs  :disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Setup_Flow_Interceptor_Test extends TestCase {

	/**
	 * The Setup_Flow_Interceptor instance.
	 *
	 * @var Setup_Flow_Interceptor
	 */
	protected $instance;

	/**
	 * The current page helper mock.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	protected $current_page_helper;

	/**
	 * The redirect helper mock.
	 *
	 * @var Mockery\MockInterface|Redirect_Helper
	 */
	protected $redirect_helper;

	/**
	 * The site kit mock.
	 *
	 * @var Mockery\MockInterface|Site_Kit
	 */
	protected $site_kit;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Mockery::mock( WP_Error::class );
		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->redirect_helper     = Mockery::mock( Redirect_Helper::class );
		$this->site_kit            = Mockery::mock( Site_Kit::class );

		$this->instance = new Setup_Flow_Interceptor(
			$this->current_page_helper,
			$this->redirect_helper,
			$this->site_kit,
		);
	}
}
