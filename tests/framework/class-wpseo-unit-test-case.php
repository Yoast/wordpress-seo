<?php
/**
 * @package    WPSEO
 * @subpackage Unittests
 */

/**
 * TestCase base class for convenience methods.
 */
class WPSEO_UnitTestCase extends WP_UnitTestCase {

	/**
	 * @param string $key
	 * @param mixed  $value
	 */
	protected function set_post( $key, $value ) {
		$_POST[ $key ] = $_REQUEST[ $key ] = addslashes( $value );
	}

	/**
	 * @param string $key
	 */
	protected function unset_post( $key ) {
		unset( $_POST[ $key ], $_REQUEST[ $key ] );
	}

	/**
	 * Fake a request to the WP front page
	 */
	protected function go_to_home() {
		$this->go_to( home_url( '/' ) );
	}

	/**
	 * @param string $expected
	 */
	protected function expectOutput( $expected ) {
		$output = ob_get_contents();
		ob_clean();
		$output   = preg_replace( '|\R|', "\r\n", $output );
		$expected = preg_replace( '|\R|', "\r\n", $expected );
		$this->assertEquals( $expected, $output );
	}

	/**
	 * @param string $expected
	 */
	protected function expectOutputContains( $expected ) {
		$output = preg_replace( '|\R|', "\r\n", ob_get_contents() );
		ob_clean();

		$found = strpos( $output, $expected );
		$this->assertEquals( true, ( $found !== false ) );
	}
}