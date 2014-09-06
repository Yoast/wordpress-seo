<?php

class WPSEO_Locales_Test extends WPSEO_UnitTestCase {

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors
	 */
	public function test_class_is_tested() {
		$this->assertTrue( true );
	}

	/**
	 * @dataProvider calculationsProvider
	 * @group locales
	 * @covers wpseo_calc

	 * @param $number1
	 * @param $action
	 * @param $number2
	 * @param $expected
	 */
	public function test_locale_en_us($number1, $action, $number2, $expected) {
		setlocale(LC_ALL, "en_US.utf8");

		$result = wpseo_calc($number1, $action, $number2);
		$this->assertEquals($expected, $result, '', .2);
	}

	/**
	 * @dataProvider calculationsProvider
	 * @group locales
	 * @covers wpseo_calc

	 * @param $number1
	 * @param $action
	 * @param $number2
	 * @param $expected
	 */
	public function test_locale_nl($number1, $action, $number2, $expected) {
		setlocale(LC_ALL, "nl_NL.utf8");

		$result = wpseo_calc($number1, $action, $number2);
		$this->assertEquals($expected, $result, '', .2);
	}

	/**
	 * DataProvider for tests
	 *
	 * @return array
	 */
	public function calculationsProvider() {

		return array(
				array(1.1, "+", 2.2, 3.3),
				array(2.1, "+", 3.2, 5.3),
				array(3.2, "+", 3.1, 6.3),
				array(1.2, "+", 2.3, 3.5),
				array(2.2, "+", 2.2, 4.4),

				array(1.1, "*", 2.2, 2.42),
				array(2.1, "*", 3.2, 6.72),
				array(3.2, "*", 3.1, 9.92),
				array(1.2, "*", 2.3, 2.76),
				array(2.2, "*", 2.2, 4.84),
		);

	}

}