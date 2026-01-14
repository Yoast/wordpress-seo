<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Search_Console;

use Google\Site_Kit\Plugin;
use ReflectionProperty;
use Yoast\WP\SEO\Dashboard\Domain\Search_Console\Failed_Request_Exception;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Search_Console_Parameters;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Api_Call;

/**
 * Test class for the get_comparison_data() method when there's no permissions.
 *
 * @group search_console_adapter
 *
 * @requires PHP >= 7.4
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::build_parameters
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::get_comparison_data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Search_Console_Adapter_Get_Comparison_Data_Failed_Request_Test extends Abstract_Search_Console_Adapter_Test {

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// Site Kit is loaded as a prereq plugin in the parent test setup. Depending on the WP test bootstrap,
		// hooks can be reset between tests while Site Kit's singleton remains set, causing routes not to
		// be registered in CI. Reset the singleton so Plugin::load() reliably wires hooks.
		$site_kit_instance = new ReflectionProperty( Plugin::class, 'instance' );
		$site_kit_instance->setAccessible( true );
		$site_kit_instance->setValue( null, null );

		// Create an admin user with manage_options capability (required by Site Kit).
		$user = $this->factory->user->create_and_get( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $user->ID );

		Plugin::load( \GOOGLESITEKIT_PLUGIN_MAIN_FILE );

		\do_action( 'init' );
		\do_action( 'rest_api_init' );
	}

	/**
	 * Tests get_comparison_data() for unauthenticated requests.
	 *
	 * @return void
	 */
	public function test_get_comparison_data_no_permissions() {
		$search_console_api_call = new Site_Kit_Search_Console_Api_Call();

		$instance           = new Site_Kit_Search_Console_Adapter( $search_console_api_call );
		$request_parameters = new Search_Console_Parameters();

		$request_parameters->set_start_date( '01-03-2025' );
		$request_parameters->set_end_date( '12-03-2025' );
		$request_parameters->set_compare_start_date( '01-02-2025' );
		$request_parameters->set_dimensions( [ 'date' ] );

		$expected_message = 'The Search Console request failed: Site Kit can’t access the relevant data from Search Console because you haven’t granted all permissions requested during setup.';

		$this->expectException( Failed_Request_Exception::class );
		$this->expectExceptionMessage( $expected_message );

		$instance->get_comparison_data( $request_parameters );
	}
}
