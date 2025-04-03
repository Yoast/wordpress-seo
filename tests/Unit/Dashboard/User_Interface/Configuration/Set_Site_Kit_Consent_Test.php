<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Configuration;

use Mockery;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Test class for the set_site_kit_consent method.
 *
 * @group site_kit_consent_management_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Configuration\Site_Kit_Consent_Management_Route::set_site_kit_consent
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Set_Site_Kit_Consent_Test extends Abstract_Site_Kit_Consent_Management_Route_Test {

	/**
	 * Tests the set_site_kit_consent method.
	 *
	 * @dataProvider set_site_kit_consent_data
	 *
	 * @param bool $consent         The value to set.
	 * @param int  $expected_status The expected status code.
	 *
	 * @return void
	 */
	public function test_set_site_kit_consent( $consent, $expected_status ) {

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'success' => $consent,
				],
				$expected_status
			)
			->once();

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_param' )
			->once()
			->andReturn( $consent );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->set_site_kit_consent( $wp_rest_request )
		);
	}

	/**
	 * Data provider for test_set_site_kit_consent.
	 *
	 * @return array<array<bool, int>>
	 */
	public static function set_site_kit_consent_data() {
		return [
			'Update site_kit_connected succeeded' => [ true, 200 ],
			'Update site_kit_connected failed'    => [ false, 400 ],
		];
	}
}
