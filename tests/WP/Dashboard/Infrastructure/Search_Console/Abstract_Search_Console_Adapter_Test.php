<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Search_Console;

use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter;
use Yoast\WP\SEO\Tests\WP\Doubles\Dashboard\Infrastructure\Search_Console\Search_Console_Module_Mock;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Tests the search console adapter.
 *
 * @group search_console_adapter
 */
abstract class Abstract_Search_Console_Adapter_Test extends TestCase {

	/**
	 * The search console module.
	 *
	 * @var Search_Console_Module_Mock
	 */
	protected static $search_console_module;

	/**
	 * Plugin basename of the plugin dependency this group of tests has.
	 *
	 * @var string
	 */
	public $prereq_plugin_basename = 'google-site-kit/google-site-kit.php';

	/**
	 * Holds the instance.
	 *
	 * @var Site_Kit_Search_Console_Adapter
	 */
	protected $instance;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Site_Kit_Search_Console_Adapter();
	}
}
