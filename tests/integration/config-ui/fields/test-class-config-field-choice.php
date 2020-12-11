<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\ConfigUI\Fields
 */

use Yoast\WPTestUtils\WPIntegration\TestCase;

/**
 * Class WPSEO_Config_Field_Choice_Test.
 */
class WPSEO_Config_Field_Choice_Test extends TestCase {

	/**
	 * Tests the retrieval of the set component.
	 *
	 * @covers WPSEO_Config_Field_Choice::__construct
	 */
	public function test_component() {
		$field = new WPSEO_Config_Field_Choice( 'field' );

		$this->assertEquals( 'Choice', $field->get_component() );
	}

	/**
	 * Test choices exist as property.
	 *
	 * @covers WPSEO_Config_Field_Choice::__construct
	 */
	public function test_choices_property() {
		$field = new WPSEO_Config_Field_Choice( 'field' );
		$this->assertEquals( [ 'choices' => [] ], $field->get_properties() );
	}

	/**
	 * Tests if choices are added to the field.
	 *
	 * @covers WPSEO_Config_Field_Choice::add_choice
	 */
	public function test_add_choice() {
		$value              = 'yes';
		$label              = 'Yes';
		$screen_reader_text = 'no';

		$expected = [
			'choices' => [
				$value => [
					'label'            => $label,
					'screenReaderText' => $screen_reader_text,
				],
			],
		];

		$field = new WPSEO_Config_Field_Choice( 'field' );

		$this->assertEquals( null, $field->add_choice( $value, $label, $screen_reader_text ) );
		$this->assertEquals( $expected, $field->get_properties() );
	}
}
