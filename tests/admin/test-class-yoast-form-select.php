<?php

class Yoast_Form_Select_Test extends PHPUnit_Framework_TestCase {

	/**
	 * Testing with valid options.
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 * @covers Yoast_Form_Select::get_select_values
	 * @covers Yoast_Form_Select::filter_invalid_options
	 * @covers Yoast_Form_Select::is_valid_option
	 */
	public function test_with_valid_options() {
		$attributes = array( 'select_id' => 'test-id', 'select_name' => 'test-field', 'select_class' => 'test');
		$select     = new Yoast_Form_Select( $attributes, array( 'foo' => 'bar', 'baz' => 'foo' ), false );
		$values     = $select->get_select_values();

		$this->assertEquals( 'test-id', $values['select_id'] );
		$this->assertEquals( 'test-field', $values['select_name'] );
		$this->assertEquals( 'test', $values['select_class'] );
		$this->assertEquals(  array( 'foo' => 'bar', 'baz' => 'foo' ) , $values['select_options'] );
		$this->assertEquals(  false, $values['selected_option'] );
	}

	/**
	 * Testing with valid options and one option being active.
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 * @covers Yoast_Form_Select::get_select_values
	 * @covers Yoast_Form_Select::filter_invalid_options
	 * @covers Yoast_Form_Select::is_valid_option
	 */
	public function test_with_active_option() {
		$attributes = array( 'select_id' => 'test-id', 'select_name' => 'test-field', 'select_class' => 'test');
		$select     = new Yoast_Form_Select( $attributes, array( 'foo' => 'bar', 'baz' => 'foo' ), 'baz' );
		$values     = $select->get_select_values();

		$this->assertEquals(  'baz', $values['selected_option'] );
	}

	/**
	 * Testing what will happen when one option is totally blank
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 * @covers Yoast_Form_Select::get_select_values
	 * @covers Yoast_Form_Select::filter_invalid_options
	 * @covers Yoast_Form_Select::is_valid_option
	 */
	public function test_with_empty_option() {
		$attributes = array( 'select_id' => 'test-id', 'select_name' => 'test-field', 'select_class' => 'test');
		$select     = new Yoast_Form_Select( $attributes, array( '' => '', 'foo' => 'bar' ), false );
		$values     = $select->get_select_values();

		$this->assertEquals( array( '' => '', 'foo' => 'bar' ), $values['select_options'] );
	}

	/**
	 * Test if invalid options will be sanitized
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 * @covers Yoast_Form_Select::get_select_values
	 * @covers Yoast_Form_Select::filter_invalid_options
	 * @covers Yoast_Form_Select::is_valid_option
	 */
	public function test_with_invalid_option() {
		$attributes = array( 'select_id' => 'test-id', 'select_name' => 'test-field', 'select_class' => 'test');
		$select     = new Yoast_Form_Select( $attributes, array( 'no-label' => '', 'foo' => 'bar' ), false );
		$values     = $select->get_select_values();

		$this->assertEquals(  array( 'foo' => 'bar' ), $values['select_options'] );
	}

	/**
	 * Test if invalid options will be sanitized
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 * @covers Yoast_Form_Select::get_select_values
	 * @covers Yoast_Form_Select::filter_invalid_options
	 * @covers Yoast_Form_Select::is_valid_option
	 */
	public function test_with_only_one_invalid_option() {
		$attributes = array( 'select_id' => 'test-id', 'select_name' => 'test-field', 'select_class' => 'test');
		$select     = new Yoast_Form_Select( $attributes, array( 'no-label' => '' ), false );
		$values     = $select->get_select_values();

		$this->assertEquals(  array( ), $values['select_options'] );
	}

	/**
	 * Test what happens when no options are given.
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 * @covers Yoast_Form_Select::get_select_values
	 */
	public function test_without_options() {
		$attributes = array( 'select_id' => 'test-id', 'select_name' => 'test-field', 'select_class' => 'test');
		$select     = new Yoast_Form_Select( $attributes, array(), false );
		$values     = $select->get_select_values();

		$this->assertEquals(  array( ), $values['select_options'] );
	}

	/**
	 * Test what happens when the select_id isn't given
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 *
	 * @expectedException InvalidArgumentException
	 * @expectedExceptionMessage The select attributes should contain a `select_id` value
	 */
	public function test_with_missing_select_id() {
		$attributes = array( 'select_name' => 'test-field', 'select_class' => 'test' );
		$select     = new Yoast_Form_Select( $attributes, array(), false );
	}

	/**
	 * Test what happens when the select_name isn't given
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 *
	 * @expectedException InvalidArgumentException
	 * @expectedExceptionMessage The select attributes should contain a `select_name` value
	 */
	public function test_with_missing_select_name() {
		$attributes = array( 'select_id' => 'test-id', 'select_class' => 'test' );
		$select     = new Yoast_Form_Select( $attributes, array(), false );
	}

	/**
	 * Test what happens when the select_class isn't given
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::validate_attributes
	 *
	 * @expectedException InvalidArgumentException
	 * @expectedExceptionMessage The select attributes should contain a `select_class` value
	 */
	public function test_with_missing_select_class() {
		$attributes = array( 'select_id' => 'test-id', 'select_name' => 'test-field');
		$select     = new Yoast_Form_Select( $attributes, array(), false );
	}


}