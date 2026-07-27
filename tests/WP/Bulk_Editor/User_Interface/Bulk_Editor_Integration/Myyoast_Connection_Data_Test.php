<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\WP\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Types_Repository;
use Yoast\WP\SEO\Bulk_Editor\Application\Endpoints\Endpoints_Repository;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Nonces\Nonce_Repository;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Connection_Permission;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Myyoast_Connection_Data_Presenter;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Status_Presenter;
use Yoast\WP\SEO\Routes\Endpoint\Endpoint_List;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * WP integration tests for the myyoastConnection payload produced by get_script_data().
 *
 * Running these as WP integration tests means WordPress functions (wp_create_nonce,
 * self_admin_url, add_query_arg, admin_url, etc.) execute for real, eliminating the
 * Brain\Monkey stubs that the equivalent unit tests would need.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::get_script_data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Myyoast_Connection_Data_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Bulk_Editor_Integration
	 */
	private $instance;

	/**
	 * The MyYoast connection feature-flag conditional mock.
	 *
	 * @var Mockery\MockInterface|MyYoast_Connection_Conditional
	 */
	private $myyoast_connection_conditional;

	/**
	 * The MyYoast connection status presenter mock.
	 *
	 * @var Mockery\MockInterface|Status_Presenter
	 */
	private $status_presenter;

	/**
	 * The MyYoast connection-management permission mock.
	 *
	 * @var Mockery\MockInterface|Connection_Permission
	 */
	private $connection_permission;

	/**
	 * Sets up the test fixtures.
	 *
	 * Mocks all service-layer dependencies. WordPress functions (wp_create_nonce,
	 * self_admin_url, add_query_arg, admin_url, etc.) run for real — no Brain\Monkey
	 * stubs needed.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->myyoast_connection_conditional = Mockery::mock( MyYoast_Connection_Conditional::class );
		$this->status_presenter               = Mockery::mock( Status_Presenter::class );
		$this->connection_permission          = Mockery::mock( Connection_Permission::class );

		$endpoint_list = Mockery::mock( Endpoint_List::class );
		$endpoint_list->allows( 'to_array' )->andReturn( [] );

		$content_types_repository = Mockery::mock( Content_Types_Repository::class );
		$content_types_repository->allows( 'get_content_types' )->andReturn( [] );

		$endpoints_repository = Mockery::mock( Endpoints_Repository::class );
		$endpoints_repository->allows( 'get_all_endpoints' )->andReturn( $endpoint_list );

		$nonce_repository = Mockery::mock( Nonce_Repository::class );
		$nonce_repository->allows( 'get_rest_nonce' )->andReturn( 'nonce' );

		$product_helper = Mockery::mock( Product_Helper::class );
		$product_helper->allows( 'is_premium' )->andReturn( false );

		$options_helper = Mockery::mock( Options_Helper::class );
		$options_helper->allows( 'get' )->andReturn( false );

		$short_link_helper = Mockery::mock( Short_Link_Helper::class );
		$short_link_helper->allows( 'get_query_params' )->andReturn( [] );
		$short_link_helper->allows( 'get' )->andReturn( '' );

		$myyoast_connection_data_presenter = new Myyoast_Connection_Data_Presenter(
			$this->myyoast_connection_conditional,
			$this->status_presenter,
			$this->connection_permission,
			$short_link_helper,
		);

		$this->instance = new Bulk_Editor_Integration(
			Mockery::mock( WPSEO_Admin_Asset_Manager::class ),
			Mockery::mock( Current_Page_Helper::class ),
			$product_helper,
			$short_link_helper,
			$content_types_repository,
			$nonce_repository,
			$endpoints_repository,
			$options_helper,
			$myyoast_connection_data_presenter,
		);
	}

	/**
	 * Tests that myyoastConnection is null when the feature flag is disabled.
	 *
	 * @return void
	 */
	public function test_myyoast_connection_is_null_when_feature_flag_is_disabled() {
		$this->myyoast_connection_conditional->expects( 'is_met' )->once()->andReturn( false );

		$data = $this->instance->get_script_data();

		$this->assertNull( $data['myyoastConnection'] );
	}

	/**
	 * Tests the myyoastConnection payload when the site is provisioned and the user can connect.
	 *
	 * The connectUrl is assembled from real WordPress functions, so we verify its structure
	 * rather than its exact value.
	 *
	 * @return void
	 */
	public function test_myyoast_connection_when_provisioned_and_can_connect() {
		$this->myyoast_connection_conditional->expects( 'is_met' )->once()->andReturn( true );
		$this->status_presenter->expects( 'present' )->once()->andReturn( [ 'is_provisioned' => true ] );
		$this->connection_permission->expects( 'can_manage' )->once()->andReturn( true );

		$data       = $this->instance->get_script_data();
		$connection = $data['myyoastConnection'];

		$this->assertTrue( $connection['isProvisioned'] );
		$this->assertTrue( $connection['canConnect'] );
		$this->assertStringContainsString( 'page=wpseo_integrations', $connection['connectUrl'] );
		$this->assertStringContainsString( 'start-myyoast-connection=1', $connection['connectUrl'] );
		$this->assertStringContainsString( '_wpnonce=', $connection['connectUrl'] );
	}

	/**
	 * Tests the myyoastConnection payload when the site is not provisioned and the user cannot connect.
	 *
	 * @return void
	 */
	public function test_myyoast_connection_when_not_provisioned_and_cannot_connect() {
		$this->myyoast_connection_conditional->expects( 'is_met' )->once()->andReturn( true );
		$this->status_presenter->expects( 'present' )->once()->andReturn( [ 'is_provisioned' => false ] );
		$this->connection_permission->expects( 'can_manage' )->once()->andReturn( false );

		$data       = $this->instance->get_script_data();
		$connection = $data['myyoastConnection'];

		$this->assertFalse( $connection['isProvisioned'] );
		$this->assertFalse( $connection['canConnect'] );
		$this->assertNull( $connection['connectUrl'] );
	}

	/**
	 * Tests that isProvisioned is false when is_provisioned is a non-boolean truthy value.
	 *
	 * @return void
	 */
	public function test_is_provisioned_is_false_when_not_a_boolean() {
		$this->myyoast_connection_conditional->expects( 'is_met' )->once()->andReturn( true );
		$this->status_presenter->expects( 'present' )->once()->andReturn( [ 'is_provisioned' => 1 ] );
		$this->connection_permission->expects( 'can_manage' )->once()->andReturn( false );

		$data = $this->instance->get_script_data();

		$this->assertFalse( $data['myyoastConnection']['isProvisioned'] );
	}
}
