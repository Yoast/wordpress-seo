<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Configuration;

use Yoast\WP\SEO\Dashboard\User_Interface\Configuration\Site_Kit_Capabilities_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Site_Kit_Capabilities_Integration tests.
 *
 * @group site_kit_capabilities
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Site_Kit_Capabilities_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Site_Kit_Capabilities_Integration
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->instance = new Site_Kit_Capabilities_Integration();
	}
}
