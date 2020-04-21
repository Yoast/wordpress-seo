<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Taxonomy
 */

/**
 * Unit Test Class.
 */
class WPSEO_Taxonomy_Presenter_Test extends WPSEO_UnitTestCase {

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
	 */
	public function setUp() {
		parent::setUp();

		$this->term           = $this->factory->term->create_and_get();
		$this->class_instance = new WPSEO_Taxonomy_Fields_Presenter( $this->term );
	}

	/**
	 * Test the result of the display_fields, with one field given.
	 *
	 * @covers WPSEO_Taxonomy_Fields_Presenter::html
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

		// There should be a label with 'test field' as label text.
		$this->assertContains( '<label for="wpseo_fieldname">test field</label>', $output );

		// There should be help link.
		$this->assertContains( '<a class="yoast-help"', $output );

		// There should be an input of type 'text', with 'fieldname' in the name, id and aria-describedby.
		$this->assertContains( '<input name="wpseo_fieldname" id="wpseo_fieldname"  type="text" value="" size="40" aria-describedby="wpseo_fieldname-desc"/>', $output );

		// There should be a description with 'fieldname' in the id, and 'this is a test field' as the description inside the <p>.
		$this->assertContains( '<p id="wpseo_fieldname-desc" class="yoast-metabox__description">this is a test field</p>', $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field has no label set.
	 *
	 * @covers WPSEO_Taxonomy_Fields_Presenter::html
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

		// There should be no label.
		$this->assertNotContains( '<label', $output );

		// There should be help link.
		$this->assertContains( '<a class="yoast-help"', $output );

		// There should be an input of type 'text', with 'fieldname' in the name, id and aria-describedby.
		$this->assertContains( '<input name="wpseo_fieldname" id="wpseo_fieldname"  type="text" value="" size="40" aria-describedby="wpseo_fieldname-desc"/>', $output );

		// There should be a description with 'fieldname' in the id, and 'this is a test field' as the description inside the <p>.
		$this->assertContains( '<p id="wpseo_fieldname-desc" class="yoast-metabox__description">this is a test field</p>', $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field has no description.
	 *
	 * @covers WPSEO_Taxonomy_Fields_Presenter::html
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

		// There should be a label with 'test field' as label text.
		$this->assertContains( '<label for="wpseo_fieldname">test field</label>', $output );

		// There should be help link.
		$this->assertContains( '<a class="yoast-help"', $output );

		// There should be an input of type 'text', with 'fieldname' in the name, id and aria-describedby.
		$this->assertContains( '<input name="wpseo_fieldname" id="wpseo_fieldname"  type="text" value="" size="40"', $output );

		// There should not be a description.
		$this->assertNotContains( '<p id="wpseo_fieldname-desc"', $output );

		// There should be an aria-describedby pointing to the (non-existing) description.
		$this->assertNotContains( 'aria-describedby="wpseo_fieldname-desc"', $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field is a select.
	 *
	 * @covers WPSEO_Taxonomy_Fields_Presenter::html
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

		$this->assertContains( '<select name="wpseo_fieldname" id="wpseo_fieldname"><option  value="value">option_value</option></select>', $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field is a select.
	 *
	 * @covers WPSEO_Taxonomy_Fields_Presenter::html
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

		$this->assertContains( '<input name="wpseo_fieldname" id="wpseo_fieldname" type="checkbox" />', $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field is a select.
	 *
	 * @covers WPSEO_Taxonomy_Fields_Presenter::html
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

		$this->assertContains( '<input name="wpseo_fieldname" id="hidden_wpseo_fieldname" type="hidden" value="" />', $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field is a select.
	 *
	 * @covers WPSEO_Taxonomy_Fields_Presenter::html
	 */
	public function test_display_fields_upload() {
		$output = $this->class_instance->html(
			[
				'fieldname' => [
					'label'       => 'test field',
					'type'        => 'upload',
					'description' => '',
					'options'     => '',
				],
			]
		);

		$this->assertContains( '<input id="wpseo_fieldname" type="text" size="36" name="wpseo_fieldname" value="" readonly="readonly" />', $output );
		$this->assertContains(
			'<input id="wpseo_fieldname_button" class="wpseo_image_upload_button button" data-target="wpseo_fieldname" data-target-id="hidden_wpseo_fieldname-id" type="button" value="Upload Image" />',
			$output
		);
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field is a select.
	 *
	 * @covers WPSEO_Taxonomy_Fields_Presenter::html
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

		$this->assertContains( '<p id="wpseo_fieldname-desc" class="yoast-metabox__description">description for the field</p>', $output );
	}
}
