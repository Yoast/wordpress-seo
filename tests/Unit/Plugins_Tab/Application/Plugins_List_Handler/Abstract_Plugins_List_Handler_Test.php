<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Plugins_Tab\Application\Plugins_List_Handler;

use Mockery;
use Yoast\WP\SEO\Plugins_Tab\Application\Plugins_List_Handler;
use Yoast\WP\SEO\Plugins_Tab\Domain\Plugin_Detector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Plugins_List_Handler tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 *
 * @group plugins-tab
 */
abstract class Abstract_Plugins_List_Handler_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Plugins_List_Handler
	 */
	protected $instance;

	/**
	 * Holds the detector mock.
	 *
	 * @var Mockery\MockInterface|Plugin_Detector
	 */
	protected $detector;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->detector = Mockery::mock( Plugin_Detector::class );
		$this->instance = new Plugins_List_Handler( $this->detector );
	}
}
