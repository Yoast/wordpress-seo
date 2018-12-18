<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Notifiers
 */

/**
 * Unit Test Class.
 *
 * @group notifiers
 */
class WPSEO_Post_Type_Archive_Notifier_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the handler when the situation is not applicable for showing it.
	 *
	 * @covers WPSEO_Post_Type_Archive_Notification_Handler::is_applicable()
	 */
	public function test_is_applicable_notice_dismissed() {
		$handler = $this
			->getMockBuilder( 'WPSEO_Post_Type_Archive_Notification_Handler_Double' )
			->setMethods( array( 'is_notice_dismissed' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_notice_dismissed' )
			->will( $this->returnValue( true ) );

		$this->assertFalse( $handler->is_applicable() );
	}

	/**
	 * Tests the handler when the situation is not applicable for showing it.
	 *
	 * @covers WPSEO_Post_Type_Archive_Notification_Handler::is_applicable()
	 */
	public function test_is_applicable_new_install() {
		$handler = $this
			->getMockBuilder( 'WPSEO_Post_Type_Archive_Notification_Handler_Double' )
			->setMethods( array( 'is_notice_dismissed', 'is_new_install' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_notice_dismissed' )
			->will( $this->returnValue( false ) );

		$handler
			->expects( $this->once() )
			->method( 'is_new_install' )
			->will( $this->returnValue( true ) );

		$this->assertFalse( $handler->is_applicable() );
	}

	/**
	 * Tests the handler when the situation is not applicable for showing it.
	 *
	 * @covers WPSEO_Post_Type_Archive_Notification_Handler::is_applicable()
	 */
	public function test_is_applicable_with_empty_post_types() {
		$handler = $this
			->getMockBuilder( 'WPSEO_Post_Type_Archive_Notification_Handler_Double' )
			->setMethods( array( 'is_notice_dismissed', 'is_new_install', 'get_post_types' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_notice_dismissed' )
			->will( $this->returnValue( false ) );

		$handler
			->expects( $this->once() )
			->method( 'is_new_install' )
			->will( $this->returnValue( false ) );

		$handler
			->expects( $this->once() )
			->method( 'get_post_types' )
			->will( $this->returnValue( array() ) );

		$this->assertFalse( $handler->is_applicable() );
	}

	/**
	 * Tests the handler when the situation is not applicable for showing it.
	 *
	 * @covers WPSEO_Post_Type_Archive_Notification_Handler::is_applicable()
	 */
	public function test_is_applicable_with_post_types() {
		$handler = $this
			->getMockBuilder( 'WPSEO_Post_Type_Archive_Notification_Handler_Double' )
			->setMethods( array( 'is_notice_dismissed', 'is_new_install', 'get_post_types' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_notice_dismissed' )
			->will( $this->returnValue( false ) );

		$handler
			->expects( $this->once() )
			->method( 'is_new_install' )
			->will( $this->returnValue( false ) );

		$handler
			->expects( $this->once() )
			->method( 'get_post_types' )
			->will( $this->returnValue( array( 123 ) ) );

		$this->assertTrue( $handler->is_applicable() );
	}
}
