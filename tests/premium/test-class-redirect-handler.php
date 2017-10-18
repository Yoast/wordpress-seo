<?php
/**
 * @package WPSEO\Tests\Premium
 */

/**
 * Class double for overriding the method visibility.
 */
class WPSEO_Redirect_Handler_Double extends WPSEO_Redirect_Handler {

	/**
	 * Check if request URL matches one of the regex redirects
	 *
	 * @param string $regex    The reqular expression to match.
	 * @param array  $redirect The URL that might be matched with the regex.
	 */
	public function match_regex_redirect( $regex, array $redirect ) {
		parent::match_regex_redirect( $regex, $redirect );
	}
}

/**
 * Test class for testing the redirect handler
 *
 * @covers WPSEO_Redirect_Handler
 */
class WPSEO_Redirect_Handler_Test extends WPSEO_UnitTestCase {

	/**
	 * Testing a regex redirect that will match the request uri.
	 */
	public function test_a_regex_redirect_that_will_match_the_request_uri() {
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'get_request_uri', 'do_redirect' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'get_request_uri' )
			->will( $this->returnValue( 'http://example.com/page/get/it' ) );

		$class_instance
			->expects( $this->once() )
			->method( 'do_redirect' );

		$class_instance->load();
		$class_instance->match_regex_redirect( 'page.*', array( 'url' => 'page-hi', 'type' => 301 ) );
	}

	/**
	 * Testing the regex redirect that will not match the request uri.
	 */
	public function test_a_regex_redirect_that_will_not_match_the_request_uri() {
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Redirect_Handler_Double' )
			->setMethods( array( 'get_request_uri', 'do_redirect' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'get_request_uri' )
			->will( $this->returnValue( 'http://example.com/page/get/it' ) );

		$class_instance
			->expects( $this->never() )
			->method( 'do_redirect' );

		$class_instance->load();
		$class_instance->match_regex_redirect( 'paige.*', array( 'url' => 'page-hi', 'type' => 301 ) );
	}

}
