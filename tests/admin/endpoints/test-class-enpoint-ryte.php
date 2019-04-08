<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Endpoints
 */
class WPSEO_Endpoint_Ryte_Test extends WPSEO_UnitTestCase {

	/**
	 * @test
	 *
	 * @see https://github.com/Yoast/wordpress-seo/issues/12621
	 */
	public function it_can_retrieve_data_depending_on_capability() {

		$service = $this->createMock( 'WPSEO_Ryte_Service' );
		$subject = new WPSEO_Endpoint_Ryte( $service );

		$current_user = wp_get_current_user();
		$has_cap      = $current_user->has_cap( Yoast_Dashboard_Widget::DISPLAY_CAPABILITY );

		if ( ! $has_cap ) {
			$current_user->add_cap( Yoast_Dashboard_Widget::DISPLAY_CAPABILITY );
		}

		$this->assertTrue(
			$subject->can_retrieve_data(),
			'The current user should have capability:' . Yoast_Dashboard_Widget::DISPLAY_CAPABILITY
		);

		$current_user->remove_cap( Yoast_Dashboard_Widget::DISPLAY_CAPABILITY );

		$this->assertFalse(
			$subject->can_retrieve_data(),
			'The current user should NOT have capability:' . Yoast_Dashboard_Widget::DISPLAY_CAPABILITY
		);

		if ( $has_cap ) {
			$current_user->add_cap( Yoast_Dashboard_Widget::DISPLAY_CAPABILITY );
		}
	}
}