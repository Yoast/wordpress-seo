<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Analytics_4;

use Google\Site_Kit\Context;
use Google\Site_Kit\Core\Authentication\Authentication;
use Google\Site_Kit\Core\Dismissals\Dismissed_Items;
use Google\Site_Kit\Core\Modules\Modules;
use Google\Site_Kit\Core\Permissions\Permissions;
use Google\Site_Kit\Core\REST_API\REST_Routes;
use Google\Site_Kit\Core\Storage\Options;
use Google\Site_Kit\Core\Storage\User_Options;
use Yoast\WP\SEO\Dashboard\Domain\Analytics_4\Failed_Request_Exception;
use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Analytics_4_Parameters;
use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter;
use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Api_Call;

/**
 * Test class for the get_comparison_data() method when there's no permissions.
 *
 * @group analytics_4_adapter
 *
 * @requires PHP >= 7.4
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::build_parameters
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::get_comparison_data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Analytics_4_Adapter_Get_Comparison_Data_Failed_Request_Test extends Abstract_Analytics_4_Adapter_Test {

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// Create an admin user with manage_options capability (required by Site Kit).
		$user = $this->factory->user->create_and_get( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $user->ID );

		// Ensure Analytics 4 module is active before Site Kit bootstraps modules.
		$active = (array) \get_option( 'googlesitekit_active_modules', [] );
		if ( ! \in_array( 'analytics-4', $active, true ) ) {
			$active[] = 'analytics-4';
		}
		\update_option( 'googlesitekit_active_modules', $active );

		// Manually bootstrap Site Kit's REST routes without firing 'init' again.
		// Site Kit normally registers its modules and routes on 'init', but by the time
		// tests run, 'init' has already fired. We instantiate the required components directly.
		$context        = new Context( \GOOGLESITEKIT_PLUGIN_MAIN_FILE );
		$options        = new Options( $context );
		$user_options   = new User_Options( $context, \get_current_user_id() );
		$authentication = new Authentication( $context, $options, $user_options );
		$modules        = new Modules( $context, $options, $user_options, $authentication );

		// Register modules to add routes to the googlesitekit_rest_routes filter.
		$modules->register();

		// Register permissions to grant Site Kit capabilities to the user.
		$dismissed_items = new Dismissed_Items( $user_options );
		$permissions     = new Permissions( $context, $authentication, $modules, $user_options, $dismissed_items );
		$permissions->register();

		// Register REST routes to collect from the filter and register with WordPress.
		$rest_routes = new REST_Routes( $context );
		$rest_routes->register();

		// Trigger rest_api_init to actually register the routes with WordPress.
		\do_action( 'rest_api_init' );
	}

	/**
	 * Tests get_comparison_data() for unauthenticated requests.
	 *
	 * @return void
	 */
	public function test_get_comparison_data_no_permissions() {
		$search_console_api_call = new Site_Kit_Analytics_4_Api_Call();

		$instance           = new Site_Kit_Analytics_4_Adapter( $search_console_api_call );
		$request_parameters = new Analytics_4_Parameters();

		$request_parameters->set_start_date( '01-03-2025' );
		$request_parameters->set_end_date( '12-03-2025' );
		$request_parameters->set_compare_start_date( '01-02-2025' );
		$request_parameters->set_compare_end_date( '28-02-2025' );
		$request_parameters->set_metrics( [ 'sessions' ] );
		$request_parameters->set_dimension_filters( [ 'sessionDefaultChannelGrouping' => [ 'Organic Search' ] ] );

		$expected_message = 'The Analytics 4 request failed: Site Kit can’t access the relevant data from Analytics because you haven’t granted all permissions requested during setup.';

		$this->expectException( Failed_Request_Exception::class );
		$this->expectExceptionMessage( $expected_message );

		$instance->get_comparison_data( $request_parameters );
	}
}
