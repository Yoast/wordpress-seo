<?php

class OnPage_Option_Mock extends WPSEO_OnPage_Option {
	private $enabled;
	private $status;
	private $can_fetch;

	public function __construct( $enabled, $status, $can_fetch ) {
		$this->enabled = $enabled;
		$this->status = $status;
		$this->can_fetch = $can_fetch;
	}

	public function is_enabled() {
		return $this->enabled;
	}

	public function get_status() {
		return $this->status;
	}

	public function should_be_fetched() {
		return $this->can_fetch;
	}
}

class WPSEO_Ryte_Service_Test extends WPSEO_UnitTestCase {
	public function test_cannot_view_ryte() {
		$onpage     = new OnPage_Option_Mock( false, WPSEO_OnPage_Option::IS_INDEXABLE, true );

		$class_instance = new WPSEO_Ryte_Service( $onpage );
		$rest_response  = $class_instance->get_statistics();
		$response_data  = $rest_response->get_data();

		$this->assertFalse( $response_data['ryte'] );
	}

	public function test_can_view_ryte() {
		$user = wp_get_current_user();
		$user->add_cap( 'manage_options' );

		$onpage     = new OnPage_Option_Mock( true, WPSEO_OnPage_Option::IS_INDEXABLE, true );

		$class_instance = new WPSEO_Ryte_Service( $onpage );
		$rest_response  = $class_instance->get_statistics();
		$response_data  = $rest_response->get_data();

		$this->assertEquals( 'good', $response_data['ryte']['score'] );

		$user->remove_cap( 'manage_options' );
	}
}
