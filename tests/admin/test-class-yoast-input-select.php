<?php

class Yoast_Input_Select_Test extends PHPUnit_Framework_TestCase {

	/**
	 * Testing with options.
	 *
	 * @covers Yoast_Input_Select::__construct
	 * @covers Yoast_Input_Select::get_html
	 * @covers Yoast_Input_Select::output_html
	 * @covers Yoast_Input_Select::get_select_values
	 * @covers Yoast_Input_Select::get_attributes
	 */
	public function test_html_with_options() {
		$select = new Yoast_Input_Select( 'test-id', 'test-field', array( 'foo' => 'bar', 'baz' => 'foo' ), false );
		$html   = $select->get_html();

		$this->assertContains( '<select name="test-field" id="test-id">', $html );
		$this->assertContains( '<option value="foo">bar</option>', $html );
		$this->assertContains( '<option value="baz">foo</option>', $html );
	}

	/**
	 * Testing without any options.
	 *
	 * @covers Yoast_Input_Select::__construct
	 * @covers Yoast_Input_Select::get_html
	 * @covers Yoast_Input_Select::output_html
	 * @covers Yoast_Input_Select::get_select_values
	 * @covers Yoast_Input_Select::get_attributes
	 */
	public function test_html_without_options() {
		$select = new Yoast_Input_Select( 'test-id', 'test-field', array(), false );
		$html   = $select->get_html();

		$this->assertContains( '<select name="test-field" id="test-id">', $html );
		$this->assertNotContains( '<option', $html );
		$this->assertNotContains( '</option>', $html );
	}

	/**
	 * Testing with options and one being active.
	 *
	 * @covers Yoast_Input_Select::__construct
	 * @covers Yoast_Input_Select::get_html
	 * @covers Yoast_Input_Select::output_html
	 * @covers Yoast_Input_Select::get_select_values
	 */
	public function test_html_with_options_and_one_active() {
		$select = new Yoast_Input_Select( 'test-id', 'test-field', array( 'foo' => 'bar', 'baz' => 'foo' ), 'baz' );
		$html   = $select->get_html();

		$this->assertContains( '<select name="test-field" id="test-id">', $html );
		$this->assertContains( '<option value="foo">bar</option>', $html );
		$this->assertContains( '<option value="baz" selected=\'selected\'>foo</option>', $html );
	}

	/**
	 * Testing with options and one being active.
	 *
	 * @covers Yoast_Input_Select::__construct
	 * @covers Yoast_Input_Select::get_html
	 * @covers Yoast_Input_Select::output_html
	 * @covers Yoast_Input_Select::get_select_values
	 * @covers Yoast_Input_Select::get_attributes
	 */
	public function test_html_with_one_option_without_key() {
		$select = new Yoast_Input_Select( 'test-id', 'test-field', array( '' => 'bar' ), false );
		$html   = $select->get_html();

		$this->assertContains( '<select name="test-field" id="test-id">', $html );
		$this->assertContains( '<option value="" selected=\'selected\'>bar</option>', $html );
	}

	/**
	 * Testing with options and one being active.
	 *
	 * @covers Yoast_Input_Select::__construct
	 * @covers Yoast_Input_Select::get_html
	 * @covers Yoast_Input_Select::output_html
	 * @covers Yoast_Input_Select::get_select_values
	 * @covers Yoast_Input_Select::get_attributes
	 */
	public function test_html_with_one_option_without_value() {
		$select = new Yoast_Input_Select( 'test-id', 'test-field', array( 'foo' => '' ), false );
		$html   = $select->get_html();

		$this->assertContains( '<select name="test-field" id="test-id">', $html );
		$this->assertContains( '<option value="foo"></option>', $html );
	}

	/**
	 * Testing printing the output
	 *
	 * @covers Yoast_Input_Select::__construct
	 * @covers Yoast_Input_Select::output_html
	 * @covers Yoast_Input_Select::get_select_values
	 * @covers Yoast_Input_Select::get_attributes
	 */
	public function test_html_printing_the_output() {
		$select = new Yoast_Input_Select( 'test-id', 'test-field', array(), false );
		$select->output_html();

		// Because the output has empty values.
		$this->expectOutputString( "<select name=\"test-field\" id=\"test-id\">\n\t</select>\n" );
	}


	/**
	 * Testing with options and one being active.
	 *
	 * @covers Yoast_Input_Select::__construct
	 * @covers Yoast_Input_Select::add_attribute
	 * @covers Yoast_Input_Select::get_html
	 * @covers Yoast_Input_Select::get_select_values
	 * @covers Yoast_Input_Select::get_attributes
	 * @covers Yoast_Input_Select::parse_attribute
	 */
	public function test_html_with_adding_attribute() {
		$select = new Yoast_Input_Select( 'test-id', 'test-field', array( 'foo' => '' ), false );
		$select->add_attribute( 'class', 'test');
		$html   = $select->get_html();

		$this->assertContains( '<select class="test" name="test-field" id="test-id">', $html );
	}


}