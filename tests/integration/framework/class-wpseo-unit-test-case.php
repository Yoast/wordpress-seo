<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Framework
 */

use Yoast\WP\SEO\Initializers\Migration_Runner;
use Yoast\WPTestUtils\WPIntegration\TestCase;

/**
 * TestCase base class for convenience methods.
 */
abstract class WPSEO_UnitTestCase extends TestCase {

	/**
	 * Make sure to do migrations before WP_UnitTestCase starts messing with the DB.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();

		// Run migrations.
		$migration_runner = YoastSEO()->classes->get( Migration_Runner::class );
		$migration_runner->run_migrations( 'free' );
	}

	/**
	 * Tests for expected output.
	 *
	 * @param string $expected    Expected output.
	 * @param string $description Explanation why this result is expected.
	 */
	protected function expectOutput( $expected, $description = '' ) {
		$output = ob_get_contents();
		ob_clean();

		$output   = preg_replace( '|\R|', "\r\n", $output );
		$expected = preg_replace( '|\R|', "\r\n", $expected );

		$this->assertEquals( $expected, $output, $description );
	}

	/**
	 * Tests whether the output contains the expected value.
	 *
	 * @param string|array $expected Expected output.
	 */
	protected function expectOutputContains( $expected ) {
		$output = preg_replace( '|\R|', "\r\n", ob_get_contents() );
		ob_clean();

		if ( ! is_array( $expected ) ) {
			$expected = [ $expected ];
		}

		foreach ( $expected as $needle ) {
			$found = strpos( $output, $needle );
			$this->assertTrue( $found !== false, sprintf( 'Expected "%s" to be found in "%s" but couldn\'t find it.', $needle, $output ) );
		}
	}

	/**
	 * Bypass the PHP deprecation error which is thrown in PHP 7.4 for the PHPUnit mock builder
	 * in select circumstances.
	 *
	 * In PHP 7.4+ a deprecation warning may be thrown about functionality in the PHPUnit mock builder.
	 * Setting an expectation for this will allow the test to run on PHP 7.4 and report proper
	 * results without the test failing on the deprecation warning.
	 *
	 * For tests which error out on PHP 7.4 because of this, a call to this function should be added
	 * at the top of the test method.
	 * Use selectively and with care !
	 *
	 * {@internal Note: The below way to set the expected exception in only supported in PHPUnit 5+.
	 *            As this functionality will only be used with PHP 7.4, this is fine as that means that
	 *            PHPUnit 5+ will be used anyway.}
	 *
	 * @return void
	 */
	protected function bypass_php74_mockbuilder_deprecation_warning() {
		if ( version_compare( PHP_VERSION_ID, 70399, '>' ) ) {
			$this->expectException( 'PHPUnit_Framework_Error_Deprecated' );
			$this->expectExceptionMessage( 'Function ReflectionType::__toString() is deprecated' );
		}
	}
}
