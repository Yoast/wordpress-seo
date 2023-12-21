<?php

namespace Yoast\WP\SEO\Tests\WP\Admin;

use Yoast\WP\SEO\Tests\WP\TestCase;
use Yoast_Input_Select;

/**
 * Unit Test Class.
 */
final class Input_Select_Test extends TestCase {

	/**
	 * Testing with options.
	 *
	 * @covers Yoast_Input_Select::__construct
	 * @covers Yoast_Input_Select::get_html
	 * @covers Yoast_Input_Select::output_html
	 * @covers Yoast_Input_Select::get_select_values
	 * @covers Yoast_Input_Select::get_attributes
	 *
	 * @return void
	 */
	public function test_html_with_options() {
		$select = new Yoast_Input_Select(
			'test-id',
			'test-field',
			[
				'foo' => 'bar',
				'baz' => 'foo',
			],
			false
		);
		$html   = $select->get_html();

		$this->assertStringContainsString( '<select name="test-field" id="test-id">', $html );
		$this->assertStringContainsString( '<option value="foo">bar</option>', $html );
		$this->assertStringContainsString( '<option value="baz">foo</option>', $html );
	}

	/**
	 * Testing without any options.
	 *
	 * @covers Yoast_Input_Select::__construct
	 * @covers Yoast_Input_Select::get_html
	 * @covers Yoast_Input_Select::output_html
	 * @covers Yoast_Input_Select::get_select_values
	 * @covers Yoast_Input_Select::get_attributes
	 *
	 * @return void
	 */
	public function test_html_without_options() {
		$select = new Yoast_Input_Select( 'test-id', 'test-field', [], false );
		$html   = $select->get_html();

		$this->assertStringContainsString( '<select name="test-field" id="test-id">', $html );
		$this->assertStringNotContainsString( '<option', $html );
		$this->assertStringNotContainsString( '</option>', $html );
	}

	/**
	 * Testing with options and one being active.
	 *
	 * @covers Yoast_Input_Select::__construct
	 * @covers Yoast_Input_Select::get_html
	 * @covers Yoast_Input_Select::output_html
	 * @covers Yoast_Input_Select::get_select_values
	 *
	 * @return void
	 */
	public function test_html_with_options_and_one_active() {
		$select = new Yoast_Input_Select(
			'test-id',
			'test-field',
			[
				'foo' => 'bar',
				'baz' => 'foo',
			],
			'baz'
		);
		$html   = $select->get_html();

		$this->assertStringContainsString( '<select name="test-field" id="test-id">', $html );
		$this->assertStringContainsString( '<option value="foo">bar</option>', $html );
		$this->assertStringContainsString( '<option value="baz" selected=\'selected\'>foo</option>', $html );
	}

	/**
	 * Testing with options and one being active.
	 *
	 * @covers Yoast_Input_Select::__construct
	 * @covers Yoast_Input_Select::get_html
	 * @covers Yoast_Input_Select::output_html
	 * @covers Yoast_Input_Select::get_select_values
	 * @covers Yoast_Input_Select::get_attributes
	 *
	 * @return void
	 */
	public function test_html_with_one_option_without_key() {
		$select = new Yoast_Input_Select( 'test-id', 'test-field', [ '' => 'bar' ], false );
		$html   = $select->get_html();

		$this->assertStringContainsString( '<select name="test-field" id="test-id">', $html );
		$this->assertStringContainsString( '<option value="" selected=\'selected\'>bar</option>', $html );
	}

	/**
	 * Testing with options and one being active.
	 *
	 * @covers Yoast_Input_Select::__construct
	 * @covers Yoast_Input_Select::get_html
	 * @covers Yoast_Input_Select::output_html
	 * @covers Yoast_Input_Select::get_select_values
	 * @covers Yoast_Input_Select::get_attributes
	 *
	 * @return void
	 */
	public function test_html_with_one_option_without_value() {
		$select = new Yoast_Input_Select( 'test-id', 'test-field', [ 'foo' => '' ], false );
		$html   = $select->get_html();

		$this->assertStringContainsString( '<select name="test-field" id="test-id">', $html );
		$this->assertStringContainsString( '<option value="foo"></option>', $html );
	}

	/**
	 * Testing printing the output.
	 *
	 * @covers Yoast_Input_Select::__construct
	 * @covers Yoast_Input_Select::output_html
	 * @covers Yoast_Input_Select::get_select_values
	 * @covers Yoast_Input_Select::get_attributes
	 *
	 * @return void
	 */
	public function test_html_printing_the_output() {
		$select = new Yoast_Input_Select( 'test-id', 'test-field', [], false );
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
	 *
	 * @return void
	 */
	public function test_html_with_adding_attribute() {
		$select = new Yoast_Input_Select( 'test-id', 'test-field', [ 'foo' => '' ], false );
		$select->add_attribute( 'class', 'test' );
		$html = $select->get_html();

		$this->assertStringContainsString( '<select class="test" name="test-field" id="test-id">', $html );
	}
}
