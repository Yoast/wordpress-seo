<?php

namespace Yoast\WP\Free\Tests\Admin\Metabox;

use \WPSEO_Admin_Asset_Manager;
use \WPSEO_Metabox_Editor;
use \Brain\Monkey;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @group Metabox
 */
class Metabox_Editor_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var \WPSEO_Metabox_Editor
	 */
	protected $subject;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();
		$this->subject = new WPSEO_Metabox_Editor();
	}

	public function get_flat_version() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();

		return $asset_manager->flatten_version( \WPSEO_VERSION );
	}

	public function test_add_css_inside_editor_empty() {
		Monkey\Functions\expect( 'plugins_url' )
			->once()
			->with( 'css/dist/inside-editor-' . $this->get_flat_version() . \WPSEO_CSSJS_SUFFIX . '.css', \realpath( __DIR__ . '/../../../wp-seo.php' ) )
			->andReturn( 'example.org' );

		$actual   = $this->subject->add_css_inside_editor( '' );
		$expected = 'example.org';

		$this->assertSame( $expected, $actual );
	}

	public function test_add_css_inside_editor_preexisting() {
		Monkey\Functions\expect( 'plugins_url' )
			->once()
			->with( 'css/dist/inside-editor-' . $this->get_flat_version() . \WPSEO_CSSJS_SUFFIX . '.css', \realpath( __DIR__ . '/../../../wp-seo.php' ) )
			->andReturn( 'example.org' );


		$expected = 'preexisting,example.org';

		$actual = $this->subject->add_css_inside_editor( 'preexisting' );

		$this->assertSame( $expected, $actual );
	}

	public function test_add_custom_element() {
		$expected = array(
			'custom_elements' => '~yoastmark',
		);

		$actual = $this->subject->add_custom_element( array() );

		$this->assertSame( $expected, $actual );
	}

	public function test_add_custom_element_preexisting() {
		$expected = array(
			'custom_elements' => 'div,~yoastmark',
		);

		$actual = $this->subject->add_custom_element( array( 'custom_elements' => 'div' ) );

		$this->assertSame( $expected, $actual );
	}

	public function test_add_custom_element_other_properties() {
		$expected = array(
			'custom_elements' => '~yoastmark',
			'other_property'  => 'hello world',
		);

		$actual = $this->subject->add_custom_element(
			array(
				'custom_elements' => '',
				'other_property'  => 'hello world',
			)
		);
		ksort( $actual );

		$this->assertSame( $expected, $actual );
	}
}
