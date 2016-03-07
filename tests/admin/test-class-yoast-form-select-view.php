<?php

class Yoast_Form_Select_View_Test extends PHPUnit_Framework_TestCase {

	/**
	 * Testing with options.
	 *
	 * @covers Yoast_Form_Select_View::__construct
	 * @covers Yoast_Form_Select_View::get_html
	 */
	public function test_with_options() {
		$select = new Yoast_Form_Select( 'test-id', 'test-field', 'test', array( 'foo' => 'bar', 'baz' => 'foo' ), false );
		$view   = new Yoast_Form_Select_View( $select );
		$html   = $view->get_html();

		$this->assertContains( '<select class="test" name="test-field" id="test-id">', $html );
		$this->assertContains( '<option value="foo">bar</option>', $html );
		$this->assertContains( '<option value="baz">foo</option>', $html );
	}

	/**
	 * Testing without any options.
	 *
	 * @covers Yoast_Form_Select_View::__construct
	 * @covers Yoast_Form_Select_View::get_html
	 */
	public function test_without_options() {
		$select = new Yoast_Form_Select( 'test-id', 'test-field', 'test', array(), false );
		$view   = new Yoast_Form_Select_View( $select );
		$html   = $view->get_html();

		$this->assertContains( '<select class="test" name="test-field" id="test-id">', $html );
		$this->assertNotContains( '<option', $html );
		$this->assertNotContains( '</option>', $html );
	}

	/**
	 * Testing with options and one being active.
	 *
	 * @covers Yoast_Form_Select_View::__construct
	 * @covers Yoast_Form_Select_View::get_html
	 */
	public function test_with_options_and_one_active() {
		$select = new Yoast_Form_Select( 'test-id', 'test-field', 'test', array( 'foo' => 'bar', 'baz' => 'foo' ), 'baz' );
		$view   = new Yoast_Form_Select_View( $select );
		$html   = $view->get_html();

		$this->assertContains( '<select class="test" name="test-field" id="test-id">', $html );
		$this->assertContains( '<option value="foo">bar</option>', $html );
		$this->assertContains( '<option value="baz" selected=\'selected\'>foo</option>', $html );
	}

	/**
	 * Testing printing the output
	 *
	 * @covers Yoast_Form_Select_View::__construct
	 * @covers Yoast_Form_Select_View::print_html
	 * @covers Yoast_Form_Select_View::get_html
	 */
	public function test_printing_the_output() {
		$select = new Yoast_Form_Select( 'test-id', 'test-field', 'test', array(), false );
		$view   = new Yoast_Form_Select_View( $select );

		$view->print_html();

		// Because the output has empty values.
		$this->expectOutputString( "<select class=\"test\" name=\"test-field\" id=\"test-id\">\n\t</select>\n" );
	}

}
