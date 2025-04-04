<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Analytics_4;

use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter;
use Yoast\WP\SEO\Tests\WP\Doubles\Dashboard\Infrastructure\Analytics_4\Analytics_4_Module_Mock;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Abstract of the tests of the analytics 4 adapter.
 *
 * @group analytics_4_adapter
 */
abstract class Abstract_Analytics_4_Adapter_Test extends TestCase {

	/**
	 * The analytics 4 module.
	 *
	 * @var Analytics_4_Module_Mock
	 */
	protected static $analytics_4_module;

	/**
	 * Plugin basename of the plugin dependency this group of tests has.
	 *
	 * @var string
	 */
	public $prereq_plugin_basename = 'google-site-kit/google-site-kit.php';

	/**
	 * Holds the instance.
	 *
	 * @var Site_Kit_Analytics_4_Adapter
	 */
	protected $instance;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Site_Kit_Analytics_4_Adapter();
	}
}
