<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Metabox
 */

/**
 * Unit Test Class.
 */
class WPSEO_Metabox_Editor_Test extends PHPUnit_Framework_TestCase {

	/**
	 * @var WPSEO_Metabox_Editor
	 */
	protected $subject;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();
		$this->subject = new WPSEO_Metabox_Editor();
	}

	public function test_register_hooks() {
		$this->subject->register_hooks();
	}

	public function get_flat_version() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();

		return $asset_manager->flatten_version( WPSEO_VERSION );
	}

	public function test_add_css_inside_editor_empty() {
		$expected = home_url() . '/wp-content/plugins/wordpress-seo/css/dist/inside-editor-' . $this->get_flat_version() . WPSEO_CSSJS_SUFFIX . '.css';

		$actual = $this->subject->add_css_inside_editor( '' );

		$this->assertEquals( $expected, $actual );
	}

	public function test_add_css_inside_editor_preexisting() {
		$expected = 'preexisting,' . home_url() . '/wp-content/plugins/wordpress-seo/css/dist/inside-editor-' . $this->get_flat_version() . WPSEO_CSSJS_SUFFIX . '.css';

		$actual = $this->subject->add_css_inside_editor( 'preexisting' );

		$this->assertEquals( $expected, $actual );
	}

	public function test_add_custom_element() {
		$expected = array(
			'custom_elements' => '~yoastmark',
		);

		$actual = $this->subject->add_custom_element( array() );

		$this->assertEquals( $expected, $actual );
	}

	public function test_add_custom_element_preexisting() {
		$expected = array(
			'custom_elements' => 'div,~yoastmark',
		);

		$actual = $this->subject->add_custom_element( array( 'custom_elements' => 'div' ) );

		$this->assertEquals( $expected, $actual );
	}

	public function test_add_custom_element_other_properties() {
		$expected = array(
			'other_property'  => 'hello world',
			'custom_elements' => '~yoastmark',
		);

		$actual = $this->subject->add_custom_element(
			array(
				'custom_elements' => '',
				'other_property'  => 'hello world',
			)
		);

		$this->assertEquals( $expected, $actual );
	}
}
