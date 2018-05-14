<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Framework
 */

/**
 * TestCase base class for convenience methods.
 */
abstract class WPSEO_UnitTestCase extends WP_UnitTestCase {

	/**
	 * @param string $key   Key to be used with PHP superglobals.
	 * @param mixed  $value Value to assign to it.
	 */
	protected function set_post( $key, $value ) {
		$_POST[ $key ]    = addslashes( $value );
		$_REQUEST[ $key ] = $_POST[ $key ];
	}

	/**
	 * @param string $key Key as used with PHP superglobal.
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
	 * Tests for expected output.
	 *
	 * @param string $expected    Expected output.
	 * @param string $description Explanation what why this result is expected.
	 */
	protected function expectOutput( $expected, $description = '' ) {
		$output = ob_get_contents();
		ob_clean();

		$output   = preg_replace( '|\R|', "\r\n", $output );
		$expected = preg_replace( '|\R|', "\r\n", $expected );

		$this->assertEquals( $expected, $output, $description );
	}

	/**
	 * @param string|array $expected Expected output.
	 */
	protected function expectOutputContains( $expected ) {
		$output = preg_replace( '|\R|', "\r\n", ob_get_contents() );
		ob_clean();

		if ( ! is_array( $expected ) ) {
			$expected = array( $expected );
		}

		foreach ( $expected as $needle ) {
			$found = strpos( $output, $needle );
			$this->assertTrue( $found !== false, sprintf( 'Expected "%s" to be found in "%s" but couldn\'t find it.', $needle, $output ) );
		}
	}

	/**
	 * Allows tests to be skipped on single or multisite installs by using @group annotations.
	 *
	 * This is a custom extension of the PHPUnit and WordPress requirements handling.
	 */
	protected function checkRequirements() {
		parent::checkRequirements();

		$annotations = $this->getAnnotations();

		$groups = array();
		if ( ! empty( $annotations['class']['group'] ) ) {
			$groups = array_merge( $groups, $annotations['class']['group'] );
		}

		if ( ! empty( $annotations['method']['group'] ) ) {
			$groups = array_merge( $groups, $annotations['method']['group'] );
		}

		if ( empty( $groups ) ) {
			return;
		}

		if ( in_array( 'ms-required', $groups, true ) ) {
			$this->skipWithoutMultisite();
		}

		if ( in_array( 'ms-excluded', $groups, true ) ) {
			$this->skipWithMultisite();
		}
	}
}
