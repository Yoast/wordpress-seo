<?php

namespace Yoast\WP\SEO\Tests\WP\Taxonomy;

use WPSEO_Taxonomy_Fields_Presenter;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Taxonomy_Fields_Presenter_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Taxonomy_Fields_Presenter
	 */
	private $class_instance;

	/**
	 * The created term.
	 *
	 * @var stdClass
	 */
	private $term;

	/**
	 * Adding a term and set the class instance.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->term           = $this->factory->term->create_and_get();
		$this->class_instance = new WPSEO_Taxonomy_Fields_Presenter( $this->term );
	}

	/**
	 * Test the result of the display_fields, with one field given.
	 *
	 * @covers WPSEO_Taxonomy_Fields_Presenter::html
	 *
	 * @return void
	 */
	public function test_display_fields() {
		$output = $this->class_instance->html(
			[
				'fieldname' => [
					'label'       => 'test field',
					'type'        => 'text',
					'description' => 'this is a test field',
					'options'     => '',
				],
			]
		);

		$expected = '<label for="wpseo_fieldname">test field</label><input name="wpseo_fieldname" id="wpseo_fieldname"  type="text" value="" size="40" aria-describedby="wpseo_fieldname-desc"/><p id="wpseo_fieldname-desc" class="yoast-metabox__description">this is a test field</p>';
		$expected = \sprintf( $expected, \plugins_url( 'images/question-mark.png', \WPSEO_FILE ) );

		$this->assertEquals( $expected, $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field has no label set.
	 *
	 * @covers WPSEO_Taxonomy_Fields_Presenter::html
	 *
	 * @return void
	 */
	public function test_display_fields_no_label() {
		$output = $this->class_instance->html(
			[
				'fieldname' => [
					'label'       => '',
					'type'        => 'text',
					'description' => 'this is a test field',
					'options'     => '',
				],
			]
		);

		$expected = '<input name="wpseo_fieldname" id="wpseo_fieldname"  type="text" value="" size="40" aria-describedby="wpseo_fieldname-desc"/><p id="wpseo_fieldname-desc" class="yoast-metabox__description">this is a test field</p>';
		$expected = \sprintf( $expected, \plugins_url( 'images/question-mark.png', \WPSEO_FILE ) );

		$this->assertEquals( $expected, $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field has no description.
	 *
	 * @covers WPSEO_Taxonomy_Fields_Presenter::html
	 *
	 * @return void
	 */
	public function test_display_fields_no_description() {
		$output = $this->class_instance->html(
			[
				'fieldname' => [
					'label'       => 'test field',
					'type'        => 'text',
					'description' => '',
					'options'     => [],
				],
			]
		);

		$this->assertEquals( '<label for="wpseo_fieldname">test field</label><input name="wpseo_fieldname" id="wpseo_fieldname"  type="text" value="" size="40"/>', $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field is a select.
	 *
	 * @covers WPSEO_Taxonomy_Fields_Presenter::html
	 *
	 * @return void
	 */
	public function test_display_fields_select() {
		$output = $this->class_instance->html(
			[
				'fieldname' => [
					'label'       => 'test field',
					'type'        => 'select',
					'description' => '',
					'options'     => [
						'options' => [
							'value' => 'option_value',
						],
					],
				],
			]
		);

		$this->assertStringContainsString(
			'<select name="wpseo_fieldname" id="wpseo_fieldname"><option  value="value">option_value</option></select>',
			$output
		);
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field is a select.
	 *
	 * @covers WPSEO_Taxonomy_Fields_Presenter::html
	 *
	 * @return void
	 */
	public function test_display_fields_checkbox() {
		$output = $this->class_instance->html(
			[
				'fieldname' => [
					'label'       => 'test field',
					'type'        => 'checkbox',
					'description' => '',
					'options'     => [
						'options' => [
							'value' => 'option_value',
						],
					],
				],
			]
		);

		$this->assertStringContainsString(
			'<input name="wpseo_fieldname" id="wpseo_fieldname" type="checkbox" />',
			$output
		);
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field is a select.
	 *
	 * @covers WPSEO_Taxonomy_Fields_Presenter::html
	 *
	 * @return void
	 */
	public function test_display_fields_hidden() {
		$output = $this->class_instance->html(
			[
				'fieldname' => [
					'label'       => 'test field',
					'type'        => 'hidden',
					'description' => '',
					'options'     => '',
				],
			]
		);

		$this->assertStringContainsString(
			'<input name="wpseo_fieldname" id="hidden_wpseo_fieldname" type="hidden" value="" />',
			$output
		);
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field is a select.
	 *
	 * @covers WPSEO_Taxonomy_Fields_Presenter::html
	 *
	 * @return void
	 */
	public function test_display_fields_with_description() {
		$output = $this->class_instance->html(
			[
				'fieldname' => [
					'label'       => 'test field',
					'type'        => 'upload',
					'description' => 'description for the field',
					'options'     => '',
				],
			]
		);

		$this->assertStringContainsString(
			'<p id="wpseo_fieldname-desc" class="yoast-metabox__description">description for the field</p>',
			$output
		);
	}
}
