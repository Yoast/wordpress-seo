<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Framework
 */

/**
 * Helper to set an expected exception for select tests.
 */
trait Yoast_SEO_ReflectionToString_Deprecation_Handler {

	/**
	 * Sets an expectation for a deprecation warning being thrown when the test in being run
	 * on PHP >= 7.4 in combination with PHPUnit < 7.
	 *
	 * On PHP 7.4+ a deprecation warning may be thrown about functionality in the PHPUnit mock builder
	 * in select circumstances.
	 * Setting an expectation for this will allow the test to run on PHP 7.4 with PHPUnit 5 and 6,
	 * and report proper results, without the test failing on the deprecation warning.
	 *
	 * For tests which error out on PHP 7.4 because of this warning, a call to this function
	 * should be added at the top of the test method.
	 * Use selectively and with care !
	 *
	 * {@internal Note: The below way to set the expected exception is specific to PHPUnit 5/6.
	 *            As this functionality will only be used with PHP 7.4 and the PHPUnit version
	 *            is locked via Composer to PHPUnit 5.7, this is fine.}
	 *
	 * @return void
	 */
	protected function expect_reflection_deprecation_warning_php74() {
		$phpunit_version = tests_get_phpunit_version();
		if ( PHP_VERSION_ID > 70399 && PHP_VERSION_ID < 80000
			&& version_compare( $phpunit_version, '7.0.0', '<' )
		) {
			$exception = 'PHPUnit_Framework_Error_Deprecated';
			if ( version_compare( $phpunit_version, '6.0.0', '>=' ) ) {
				$exception = 'PHPUnit\Framework\Error\Deprecated';
			}

			$this->expectException( $exception );
			$this->expectExceptionMessage( 'Function ReflectionType::__toString() is deprecated' );
		}
	}
}
