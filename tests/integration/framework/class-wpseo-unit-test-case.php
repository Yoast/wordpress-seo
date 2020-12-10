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

	use Yoast_SEO_ReflectionToString_Deprecation_Handler;

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
}
