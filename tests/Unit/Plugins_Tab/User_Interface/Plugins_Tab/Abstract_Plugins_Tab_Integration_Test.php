<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Plugins_Tab\User_Interface\Plugins_Tab;

use Mockery;
use Yoast\WP\SEO\Plugins_Tab\Application\Plugins_List_Handler;
use Yoast\WP\SEO\Plugins_Tab\User_Interface\Plugins_Tab_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Plugins_Tab_Integration tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 *
 * @group plugins-tab
 */
abstract class Abstract_Plugins_Tab_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Plugins_Tab_Integration
	 */
	protected $instance;

	/**
	 * Holds the handler mock.
	 *
	 * @var Mockery\MockInterface|Plugins_List_Handler
	 */
	protected $handler;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->handler  = Mockery::mock( Plugins_List_Handler::class );
		$this->instance = new Plugins_Tab_Integration( $this->handler );
	}
}
