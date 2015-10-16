<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_Taxonomy_Presenter_Test extends WPSEO_UnitTestCase {


	/**
	 * @var WPSEO_Taxonomy_Presenter
	 */
	private  $class_instance;

	/**
	 * @var stdClass The created term.
	 */
	private $term;

	/**
	 * Adding a term and set the class instance
	 */
	public function setUp() {
		parent::setUp();

		$this->term           = $this->factory->term->create_and_get();
		$this->class_instance = new WPSEO_Taxonomy_Presenter( $this->term );
	}

	/**
	 * Test the result of the display_fields, with one field given
	 *
	 * @covers WPSEO_Taxonomy_Presenter::display_fields
	 */
	public function test_display_fields() {

		ob_start();

		$this->class_instance->display_fields(
			array(
				'fieldname' => array(
					'label'       => 'test field',
					'type'        => 'text',
					'description' => 'this is a test field',
					'options'     => ''
				)
			)
		);

		$output = ob_get_clean();

		$this->assertEquals( '<tr><th scope="row"><label for="wpseo_fieldname">test field</label><img src="http://example.org/wp-content/plugins/wordpress-seo/images/question-mark.png" class="alignright yoast_help" id="wpseo_fieldnamehelp" alt="this is a test field" /></th><td><input name="wpseo_fieldname" id="wpseo_fieldname"  type="text" value="" size="40"/></td></tr>', $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field has no label set.
	 *
	 * @covers WPSEO_Taxonomy_Presenter::display_fields
	 */
	public function test_display_fields_no_label() {

		ob_start();

		$this->class_instance->display_fields(
			array(
				'fieldname' => array(
					'label'       => '',
					'type'        => 'text',
					'description' => 'this is a test field',
					'options'     => ''
				)
			)
		);

		$output = ob_get_clean();

		$this->assertEquals( '<tr><th scope="row"><img src="http://example.org/wp-content/plugins/wordpress-seo/images/question-mark.png" class="alignright yoast_help" id="wpseo_fieldnamehelp" alt="this is a test field" /></th><td><input name="wpseo_fieldname" id="wpseo_fieldname"  type="text" value="" size="40"/></td></tr>', $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field has no description.
	 *
	 * @covers WPSEO_Taxonomy_Presenter::display_fields
	 */
	public function test_display_fields_no_description() {

		ob_start();

		$this->class_instance->display_fields(
			array(
				'fieldname' => array(
					'label'       => 'test field',
					'type'        => 'text',
					'description' => '',
					'options'     => array()
				)
			)
		);

		$output = ob_get_clean();

		$this->assertEquals( '<tr><th scope="row"><label for="wpseo_fieldname">test field</label></th><td><input name="wpseo_fieldname" id="wpseo_fieldname"  type="text" value="" size="40"/></td></tr>', $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field is a select.
	 *
	 * @covers WPSEO_Taxonomy_Presenter::display_fields
	 */
	public function test_display_fields_select() {

		ob_start();

		$this->class_instance->display_fields(
			array(
				'fieldname' => array(
					'label'       => 'test field',
					'type'        => 'select',
					'description' => '',
					'options'     => array(
						'options' => array(
							'value' => 'option_value'
						)
					)
				)
			)
		);

		$output = ob_get_clean();

		$this->assertContains( '<select name="wpseo_fieldname" id="wpseo_fieldname"><option  value="value">option_value</option></select>', $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field is a select.
	 *
	 * @covers WPSEO_Taxonomy_Presenter::display_fields
	 */
	public function test_display_fields_checkbox() {

		ob_start();

		$this->class_instance->display_fields(
			array(
				'fieldname' => array(
					'label'       => 'test field',
					'type'        => 'checkbox',
					'description' => '',
					'options'     => array(
						'options' => array(
							'value' => 'option_value'
						)
					)
				)
			)
		);

		$output = ob_get_clean();

		$this->assertContains( '<input name="wpseo_fieldname" id="wpseo_fieldname" type="checkbox" />', $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field is a select.
	 *
	 * @covers WPSEO_Taxonomy_Presenter::display_fields
	 */
	public function test_display_fields_hidden() {

		ob_start();

		$this->class_instance->display_fields(
			array(
				'fieldname' => array(
					'label'       => 'test field',
					'type'        => 'hidden',
					'description' => '',
					'options'     => '',
				)
			)
		);

		$output = ob_get_clean();

		$this->assertContains( '<input name="wpseo_fieldname" id="hidden_wpseo_fieldname" type="hidden" value="" />', $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field is a select.
	 *
	 * @covers WPSEO_Taxonomy_Presenter::display_fields
	 */
	public function test_display_fields_upload() {

		ob_start();

		$this->class_instance->display_fields(
			array(
				'fieldname' => array(
					'label'       => 'test field',
					'type'        => 'upload',
					'description' => '',
					'options'     => ''
				)
			)
		);

		$output = ob_get_clean();

		$this->assertContains( '<input id="wpseo_fieldname" type="text" size="36" name="wpseo_fieldname" value="" />', $output );
		$this->assertContains( '<input id="wpseo_fieldname_button" class="wpseo_image_upload_button button" type="button" value="Upload Image" />', $output );
	}

	/**
	 * Test the result of the display_fields, with one field given. The given field is a select.
	 *
	 * @covers WPSEO_Taxonomy_Presenter::display_fields
	 */
	public function test_display_fields_with_description() {

		ob_start();

		$this->class_instance->display_fields(
			array(
				'fieldname' => array(
					'label'       => 'test field',
					'type'        => 'upload',
					'description' => '',
					'options'     => array(
						'description' => 'description for the field'
					)
				)
			)
		);

		$output = ob_get_clean();

		$this->assertContains( '<p class="description">description for the field</p>', $output );
	}

}
