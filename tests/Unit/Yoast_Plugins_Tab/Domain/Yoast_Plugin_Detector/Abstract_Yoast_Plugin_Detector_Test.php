<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Yoast_Plugins_Tab\Domain\Yoast_Plugin_Detector;

use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Yoast_Plugins_Tab\Domain\Yoast_Plugin_Detector;

/**
 * Abstract class for the Yoast_Plugin_Detector tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 *
 * @group yoast-plugins-tab
 */
abstract class Abstract_Yoast_Plugin_Detector_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Yoast_Plugin_Detector
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Yoast_Plugin_Detector();
	}
}
