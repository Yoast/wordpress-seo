<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\OnPage
 */

/**
 * Unit Test Class.
 */
class WPSEO_Ryte_Service_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the response data is false when the Ryte is disabled.
	 *
	 * @covers WPSEO_Ryte_Service::get_statistics
	 */
	public function test_cannot_view_ryte() {
		$ryte = new Ryte_Option_Mock( false, WPSEO_Ryte_Option::IS_INDEXABLE, true );

		$class_instance = new WPSEO_Ryte_Service( $ryte );
		$rest_response  = $class_instance->get_statistics();
		$response_data  = $rest_response->get_data();

		$this->assertFalse( $response_data['ryte'] );
	}

	/**
	 * Tests the response data is as expected when the Ryte is enabled.
	 *
	 * @covers WPSEO_Ryte_Service::get_statistics
	 */
	public function test_can_view_ryte() {
		$user = wp_get_current_user();
		$user->add_cap( 'manage_options' );

		$ryte = new Ryte_Option_Mock( true, WPSEO_Ryte_Option::IS_INDEXABLE, true );

		$class_instance = new WPSEO_Ryte_Service( $ryte );
		$rest_response  = $class_instance->get_statistics();
		$response_data  = $rest_response->get_data();

		$this->assertEquals( 'good', $response_data['ryte']['score'] );

		$user->remove_cap( 'manage_options' );
	}
}
