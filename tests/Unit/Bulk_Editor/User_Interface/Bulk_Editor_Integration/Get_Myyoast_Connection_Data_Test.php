<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

use Brain\Monkey\Functions;

/**
 * Tests the get_myyoast_connection_data method.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::get_myyoast_connection_data
 */
final class Get_Myyoast_Connection_Data_Test extends Abstract_Bulk_Editor_Integration_Test {

	/**
	 * Tests that null is returned when the feature flag is disabled.
	 *
	 * @return void
	 */
	public function test_returns_null_when_feature_flag_is_disabled() {
		$this->myyoast_connection_conditional->expects( 'is_met' )->once()->andReturn( false );

		$this->assertNull( $this->instance->get_myyoast_connection_data() );
	}

	/**
	 * Tests the payload when the site is provisioned and the user can connect.
	 *
	 * @return void
	 */
	public function test_returns_payload_when_provisioned_and_can_connect() {
		$this->myyoast_connection_conditional->expects( 'is_met' )->once()->andReturn( true );
		$this->status_presenter->expects( 'present' )->once()->andReturn( [ 'is_provisioned' => true ] );
		$this->connection_permission->expects( 'can_manage' )->once()->andReturn( true );

		Functions\expect( 'wp_create_nonce' )
			->once()
			->with( 'wpseo-start-myyoast-connection' )
			->andReturn( 'test-nonce' );
		Functions\expect( 'self_admin_url' )
			->once()
			->andReturn( 'https://example.com/wp-admin/admin.php?page=wpseo_integrations&start-myyoast-connection=1' );
		Functions\expect( 'add_query_arg' )
			->once()
			->andReturn( 'https://example.com/wp-admin/admin.php?page=wpseo_integrations&start-myyoast-connection=1&_wpnonce=test-nonce' );

		$result = $this->instance->get_myyoast_connection_data();

		$this->assertSame(
			[
				'isProvisioned' => true,
				'canConnect'    => true,
				'connectUrl'    => 'https://example.com/wp-admin/admin.php?page=wpseo_integrations&start-myyoast-connection=1&_wpnonce=test-nonce',
			],
			$result,
		);
	}

	/**
	 * Tests the payload when the site is not provisioned and the user cannot connect.
	 *
	 * @return void
	 */
	public function test_returns_payload_when_not_provisioned_and_cannot_connect() {
		$this->myyoast_connection_conditional->expects( 'is_met' )->once()->andReturn( true );
		$this->status_presenter->expects( 'present' )->once()->andReturn( [ 'is_provisioned' => false ] );
		$this->connection_permission->expects( 'can_manage' )->once()->andReturn( false );

		$result = $this->instance->get_myyoast_connection_data();

		$this->assertSame(
			[
				'isProvisioned' => false,
				'canConnect'    => false,
				'connectUrl'    => null,
			],
			$result,
		);
	}

	/**
	 * Tests that isProvisioned is false when is_provisioned is not a boolean.
	 *
	 * @return void
	 */
	public function test_is_provisioned_is_false_when_not_a_boolean() {
		$this->myyoast_connection_conditional->expects( 'is_met' )->once()->andReturn( true );
		$this->status_presenter->expects( 'present' )->once()->andReturn( [ 'is_provisioned' => 1 ] );
		$this->connection_permission->expects( 'can_manage' )->once()->andReturn( false );

		$result = $this->instance->get_myyoast_connection_data();

		$this->assertFalse( $result['isProvisioned'] );
	}
}
