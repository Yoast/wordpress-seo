<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Yoast_Plugins_Tab\User_Interface\Yoast_Plugins_Tab;

use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Yoast_Plugins_Tab\Application\Yoast_Plugins_List_Handler;
use Yoast\WP\SEO\Yoast_Plugins_Tab\User_Interface\Yoast_Plugins_Tab_Integration;

/**
 * Abstract class for the Yoast_Plugins_Tab_Integration tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 *
 * @group yoast-plugins-tab
 */
abstract class Abstract_Yoast_Plugins_Tab_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Yoast_Plugins_Tab_Integration
	 */
	protected $instance;

	/**
	 * Holds the handler mock.
	 *
	 * @var Mockery\MockInterface|Yoast_Plugins_List_Handler
	 */
	protected $handler;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->handler  = Mockery::mock( Yoast_Plugins_List_Handler::class );
		$this->instance = new Yoast_Plugins_Tab_Integration( $this->handler );
	}
}
