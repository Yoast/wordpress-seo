<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Yoast_Plugins_Tab\Application\Yoast_Plugins_List_Handler;

use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Yoast_Plugins_Tab\Application\Yoast_Plugins_List_Handler;
use Yoast\WP\SEO\Yoast_Plugins_Tab\Domain\Yoast_Plugin_Detector;

/**
 * Abstract class for the Yoast_Plugins_List_Handler tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 *
 * @group yoast-plugins-tab
 */
abstract class Abstract_Yoast_Plugins_List_Handler_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Yoast_Plugins_List_Handler
	 */
	protected $instance;

	/**
	 * Holds the detector mock.
	 *
	 * @var Mockery\MockInterface|Yoast_Plugin_Detector
	 */
	protected $detector;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->detector = Mockery::mock( Yoast_Plugin_Detector::class );
		$this->instance = new Yoast_Plugins_List_Handler( $this->detector );
	}
}
