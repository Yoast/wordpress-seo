<?php

/**
 * Class Yoast_Form_Select_Test
 *
 * @group test
 */
class Yoast_Form_Select_Test extends PHPUnit_Framework_TestCase {

	/**
	 * Testing with valid options.
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::get_html
	 * @covers Yoast_Form_Select::parse_options
	 * @covers Yoast_Form_Select::sanitize_options
	 * @covers Yoast_Form_Select::sanitize_option
	 * @covers Yoast_Form_Select::parse_option
	 */
	public function test_with_valid_options() {
		$select = new Yoast_Form_Select( 'test-field', 'test-field', array( 'foo' => 'bar', 'baz' => 'foo' ), false );
		$html   = $select->get_html();

		$this->assertContains('<select class="select" name="test-field" id="test-field">', $html);
		$this->assertContains('<option value="foo">bar</option>', $html);
		$this->assertContains('<option value="baz">foo</option>', $html);
	}
	/**
	 * Testing with valid options and one option being active.
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::get_html
	 * @covers Yoast_Form_Select::parse_options
	 * @covers Yoast_Form_Select::sanitize_options
	 * @covers Yoast_Form_Select::sanitize_option
	 * @covers Yoast_Form_Select::parse_option
	 */
	public function test_with_active_option() {
		$select = new Yoast_Form_Select( 'test-field', 'test-field', array( 'foo' => 'bar', 'baz' => 'foo' ), 'baz' );
		$html   = $select->get_html();

		$this->assertContains('<select class="select" name="test-field" id="test-field">', $html);
		$this->assertContains('<option value="foo">bar</option>', $html);
		$this->assertContains('<option value="baz" selected=\'selected\'>foo</option>', $html);
	}

	/**
	 * Testing what will happen when one options is totally blank
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::get_html
	 * @covers Yoast_Form_Select::parse_options
	 * @covers Yoast_Form_Select::sanitize_options
	 * @covers Yoast_Form_Select::sanitize_option
	 * @covers Yoast_Form_Select::parse_option
	 */
	public function test_with_empty_option() {
		$select = new Yoast_Form_Select( 'test-field', 'test-field', array( '' => '', 'foo' => 'bar' ), false );
		$html   = $select->get_html();

		$this->assertContains('<select class="select" name="test-field" id="test-field">', $html);
		$this->assertContains('<option value="" selected=\'selected\'></option>', $html);
		$this->assertContains('<option value="foo">bar</option>', $html);
	}

	/**
	 * Test if invalid options will be sanitized
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::get_html
	 * @covers Yoast_Form_Select::parse_options
	 * @covers Yoast_Form_Select::sanitize_options
	 * @covers Yoast_Form_Select::sanitize_option
	 * @covers Yoast_Form_Select::parse_option
	 */
	public function test_with_invalid_option() {
		$select = new Yoast_Form_Select( 'test-field', 'test-field', array( 'no-label' => '', 'foo' => 'bar' ), false );
		$html   = $select->get_html();

		$this->assertContains('<select class="select" name="test-field" id="test-field">', $html);
		$this->assertNotContains('<option value="no-label"></option>', $html);
		$this->assertContains('<option value="foo">bar</option>', $html);
	}

	/**
	 * Test if invalid options will be sanitized
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::get_html
	 * @covers Yoast_Form_Select::parse_options
	 * @covers Yoast_Form_Select::sanitize_options
	 * @covers Yoast_Form_Select::sanitize_option
	 */
	public function test_with_only_one_invalid_option() {
		$select = new Yoast_Form_Select( 'test-field', 'test-field', array( 'no-label' => '' ), false );
		$html   = $select->get_html();

		$this->assertContains('<select class="select" name="test-field" id="test-field">', $html);
		$this->assertNotContains('<option value="no-label"></option>', $html);
	}

	/**
	 * Test what happens when no options are given.
	 *
	 * @covers Yoast_Form_Select::__construct
	 * @covers Yoast_Form_Select::get_html
	 * @covers Yoast_Form_Select::parse_options
	 */
	public function test_without_options() {
		$select = new Yoast_Form_Select( 'test-field', 'test-field', array(), false );
		$html   = $select->get_html();

		$this->assertContains('<select class="select" name="test-field" id="test-field">', $html);
		$this->assertNotContains('<option', $html);
		$this->assertNotContains('</option>', $html);
	}


}