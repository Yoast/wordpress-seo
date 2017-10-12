<?php
/**
 * @package WPSEO\Tests\Premium
 */

/**
 * Test double for testing the result of the match_redirect_regex which is protected in the import manager.
 */
class WPSEO_Redirect_CSV_Loader_Double extends WPSEO_Redirect_CSV_Loader {

	/**
	 * Checks if a parsed CSV row is has a valid redirect format.
	 *
	 * @param array $item The parsed CSV row.
	 *
	 * @return bool Whether or not the parsed CSV row is valid.
	 */
	public function return_validate_item( $item ) {
		return $this->validate_item( $item );
	}

}

/**
 * Test class for the WPSEO Premium Import Manager
 */
class WPSEO_Redirect_CSV_Loader_Test extends WPSEO_UnitTestCase {

	/**
	 * Test the validate_item function with valid items.
	 *
	 * @dataProvider valid_item_provider
	 *
	 * @param array $item Item details.
	 */
	public function test_valid_item( $item ) {
		$instance = new WPSEO_Redirect_CSV_Loader_Double( '' );

		$this->assertTrue( $instance->return_validate_item( $item ) );
	}

	/**
	 * Test the validate_item function with invalid items.
	 *
	 * @dataProvider invalid_item_provider
	 *
	 * @param array $item Item details.
	 */
	public function test_match_plain_redirects_regex_with_quotes( $item ) {
		$instance = new WPSEO_Redirect_CSV_Loader_Double( '' );

		$this->assertFalse( $instance->return_validate_item( $item ) );

	}

	/**
	 * Returns valid items. Returns an array of arrays in arrays so the first argument is an array.
	 *
	 * @return array
	 */
	public function valid_item_provider() {
		return array(
			array( array( 'old', 'new', '301', 'plain' ) ),
			array( array( 'old', '', '410', 'regex' ) ),
		);
	}

	/**
	 * Returns invalid items. Returns an array of arrays in arrays so the first argument is an array.
	 *
	 * @return array
	 */
	public function invalid_item_provider() {
		return array(
			array( array( 'old', 'new', 'type', 'format' ) ),
			array( array( 'Bob', 'Bobson', 'M', '46' ) ),
			array( array( 'old', 'new' ) ),
			array( array( '1', '12', '123', '1234' ) ),
		);
	}
}
