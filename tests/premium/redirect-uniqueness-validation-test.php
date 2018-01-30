<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for testing the uniqueness validation class
 *
 * @covers WPSEO_Redirect_Uniqueness_Validation
 */
class WPSEO_Redirect_Uniqueness_Validation_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_Uniqueness_Validation
	 */
	private $class_instance;

	/**
	 * Array with redirects to test against.
	 *
	 * @var array
	 */
	private $redirects = array(
		'old_url'    => 'new_url',
		'older_url'  => 'newer_url',
		'my_old_url' => 'old_url',
	);

	/**
	 * Setting the class_instance with an instance of WPSEO_Redirect_Uniqueness_Validation
	 */
	public function setUp() {
		$this->class_instance = new WPSEO_Redirect_Uniqueness_Validation();
	}

	/**
	 * Test with redirects which do exists already in unique_url modus. This is the case when redirects are added.
	 * The result will be true, because the redirect already exists.
	 *
	 * @dataProvider existing_redirect_provider
	 *
	 * @param string $old_url    The origin url.
	 * @param string $new_url    The url to redirect to.
	 * @param int    $type       Type of the redirect.
	 *
	 * @covers WPSEO_Redirect_Uniqueness_Validation::run
	 * @covers WPSEO_Redirect_Uniqueness_Validation::get_error
	 */
	public function test_validate_redirect_exists_unique( $old_url, $new_url, $type ) {
		$this->assertFalse(
			$this->class_instance->run(
				new WPSEO_Redirect( $old_url, $new_url, $type ),
				null,
				$this->redirects
			)
		);

		$this->assertEquals(
			new WPSEO_Validation_Error( 'The old URL already exists as a redirect.', 'origin' ),
			$this->class_instance->get_error()
		);
	}

	/**
	 * Test with redirects which do exists already in non unique url modus. This is the case when redirects are being
	 * edited. The result will be true, because there are no validation errors
	 *
	 * @dataProvider non_existing_redirect_provider
	 *
	 * @param string $old_url The origin url.
	 * @param string $new_url The url to redirect to.
	 * @param int    $type    Type of the redirect.
	 *
	 * @covers WPSEO_Redirect_Uniqueness_Validation::run
	 */
	public function test_validate_redirect_exists_not_unique( $old_url, $new_url, $type ) {
		$this->assertTrue(
			$this->class_instance->run(
				new WPSEO_Redirect( $old_url, $new_url, $type ),
				null,
				$this->redirects
			)
		);
	}

	/**
	 * Test the validation of a redirect being edited (in that case to redirects objects are given.
	 *
	 * @covers WPSEO_Redirect_Uniqueness_Validation::run
	 */
	public function test_validate_edit_redirect_equal_origin() {
		$this->assertTrue(
			$this->class_instance->run(
				new WPSEO_Redirect( 'old_url', 'target', 301 ),
				new WPSEO_Redirect( 'old_url', 'target', 301 ),
				$this->redirects
			)
		);
	}

	/**
	 * Provide array with redirects that already exists
	 *
	 * @return array
	 */
	public function existing_redirect_provider() {
		return array(
			array( 'old_url', 'my_old_url', 301 ),
			array( 'older_url', 'my_older_url', 301 ),
			array( 'my_old_url', '', 410 ),
			array( 'my_old_url', '', 451 ),
		);
	}

	/**
	 * Provide array with redirects that already exists
	 *
	 * @return array
	 */
	public function non_existing_redirect_provider() {
		return array(
			array( 'the_old_url', 'my_old_url', 301 ),
			array( 'the_older_url', 'my_older_url', 301 ),
			array( 'the_deleted_url', '', 410 ),
			array( 'the_deleted_url', '', 451 ),
		);
	}

}
