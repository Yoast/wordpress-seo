<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Search_Console;

use Mockery;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Api_Call;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Abstract of the tests of the search console adapter.
 *
 * @group search_console_adapter
 */
abstract class Abstract_Search_Console_Adapter_Test extends TestCase {

	/**
	 * The api call mock.
	 *
	 * @var Site_Kit_Search_Console_Api_Call
	 */
	protected $search_console_api_call_mock;

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
		$this->search_console_api_call_mock = Mockery::mock( Site_Kit_Search_Console_Api_Call::class );

		$this->instance = new Site_Kit_Search_Console_Adapter( $this->search_console_api_call_mock );
	}
}
