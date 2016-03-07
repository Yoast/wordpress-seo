<?php

class Yoast_Input_Select_Test extends PHPUnit_Framework_TestCase {

	/**
	 * Default attributes, used in mostly all tests.
	 * @var array
	 */
	private $attributes = array(
		'id'    => 'test-id',
		'name'  => 'test-field',
		'class' => 'test',
	);

	/**
	 * Test what happens when the id isn't given
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 *
	 * @expectedException InvalidArgumentException
	 * @expectedExceptionMessage The select attributes should contain a `id` value
	 */
	public function test_validate_without_id() {
		$attributes = array( 'name' => 'test-field', 'class' => 'test' );
		$select     = new Yoast_Input_Select( $attributes, array(), false );
	}

	/**
	 * Test what happens when the name isn't given
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 *
	 * @expectedException InvalidArgumentException
	 * @expectedExceptionMessage The select attributes should contain a `name` value
	 */
	public function test_validate_without_name() {
		$attributes = array( 'id' => 'test-id', 'class' => 'test' );
		$select     = new Yoast_Input_Select( $attributes, array(), false );
	}

	/**
	 * Test what happens when the class isn't given
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 *
	 * @expectedException InvalidArgumentException
	 * @expectedExceptionMessage The select attributes should contain a `class` value
	 */
	public function test_validate_without_class() {
		$attributes = array( 'id' => 'test-id', 'name' => 'test-field');
		$select     = new Yoast_Input_Select( $attributes, array(), false );
	}

	/**
	 * Testing with options.
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 * @covers Yoast_Form_Select::get_html
	 * @covers Yoast_Form_Select::get_select_values
	 */
	public function test_html_with_options() {
		$select = new Yoast_Input_Select( $this->attributes, array( 'foo' => 'bar', 'baz' => 'foo' ), false );
		$html   = $select->get_html();

		$this->assertContains( '<select class="test" name="test-field" id="test-id">', $html );
		$this->assertContains( '<option value="foo">bar</option>', $html );
		$this->assertContains( '<option value="baz">foo</option>', $html );
	}

	/**
	 * Testing without any options.
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 * @covers Yoast_Form_Select::get_html
	 * @covers Yoast_Form_Select::get_select_values
	 */
	public function test_html_without_options() {
		$select = new Yoast_Input_Select( $this->attributes, array(), false );
		$html   = $select->get_html();

		$this->assertContains( '<select class="test" name="test-field" id="test-id">', $html );
		$this->assertNotContains( '<option', $html );
		$this->assertNotContains( '</option>', $html );
	}

	/**
	 * Testing with options and one being active.
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 * @covers Yoast_Form_Select::get_html
	 * @covers Yoast_Form_Select::get_select_values
	 */
	public function test_html_with_options_and_one_active() {
		$select = new Yoast_Input_Select( $this->attributes, array( 'foo' => 'bar', 'baz' => 'foo' ), 'baz' );
		$html   = $select->get_html();

		$this->assertContains( '<select class="test" name="test-field" id="test-id">', $html );
		$this->assertContains( '<option value="foo">bar</option>', $html );
		$this->assertContains( '<option value="baz" selected=\'selected\'>foo</option>', $html );
	}

	/**
	 * Testing with options and one being active.
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 * @covers Yoast_Form_Select::get_html
	 * @covers Yoast_Form_Select::get_select_values
	 */
	public function test_html_with_one_option_without_key() {
		$select = new Yoast_Input_Select( $this->attributes, array( '' => 'bar' ), false );
		$html   = $select->get_html();

		$this->assertContains( '<select class="test" name="test-field" id="test-id">', $html );
		$this->assertContains( '<option value="" selected=\'selected\'>bar</option>', $html );
	}

	/**
	 * Testing with options and one being active.
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 * @covers Yoast_Form_Select::get_html
	 * @covers Yoast_Form_Select::get_select_values
	 */
	public function test_html_with_one_option_without_value() {
		$select = new Yoast_Input_Select( $this->attributes, array( 'foo' => '' ), false );
		$html   = $select->get_html();

		$this->assertContains( '<select class="test" name="test-field" id="test-id">', $html );
		$this->assertContains( '<option value="foo"></option>', $html );
	}

	/**
	 * Testing printing the output
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 * @covers Yoast_Form_Select::print_html
	 * @covers Yoast_Form_Select::get_html
	 * @covers Yoast_Form_Select::get_select_values
	 */
	public function test_html_printing_the_output() {
		$select = new Yoast_Input_Select( $this->attributes, array(), false );
		$select->output_html();

		// Because the output has empty values.
		$this->expectOutputString( "<select class=\"test\" name=\"test-field\" id=\"test-id\">\n\t</select>\n" );
	}


}