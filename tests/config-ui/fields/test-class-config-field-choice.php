<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\ConfigUI\Fields
 */

/**
 * Class WPSEO_Config_Field_Choice_Test
 */
class WPSEO_Config_Field_Choice_Test extends PHPUnit_Framework_TestCase {

	/**
	 * @covers WPSEO_Config_Field_Choice::__construct
	 */
	public function test_component() {
		$field = new WPSEO_Config_Field_Choice( 'field' );

		$this->assertEquals( 'Choice', $field->get_component() );
	}

	/**
	 * Test choices exist as property
	 */
	public function test_choices_property() {
		$field = new WPSEO_Config_Field_Choice( 'field' );
		$this->assertEquals( array( 'choices' => array() ), $field->get_properties() );
	}

	/**
	 * @covers WPSEO_Config_Field_Choice::add_choice()
	 */
	public function test_add_choice() {
		$value              = 'yes';
		$label              = 'Yes';
		$screen_reader_text = 'no';

		$expected = array(
			'choices' => array(
				$value => array(
					'label'            => $label,
					'screenReaderText' => $screen_reader_text,
				),
			),
		);

		$field = new WPSEO_Config_Field_Choice( 'field' );

		$this->assertEquals( null, $field->add_choice( $value, $label, $screen_reader_text ) );
		$this->assertEquals( $expected, $field->get_properties() );
	}
}
