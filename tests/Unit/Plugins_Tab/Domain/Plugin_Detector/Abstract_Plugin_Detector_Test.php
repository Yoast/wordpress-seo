<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Plugins_Tab\Domain\Plugin_Detector;

use Yoast\WP\SEO\Plugins_Tab\Domain\Plugin_Detector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Plugin_Detector tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 *
 * @group plugins-tab
 */
abstract class Abstract_Plugin_Detector_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Plugin_Detector
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Plugin_Detector();
	}
}
