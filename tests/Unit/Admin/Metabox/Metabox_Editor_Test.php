<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Metabox;

use Brain\Monkey;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Metabox_Editor;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group Metabox
 */
class Metabox_Editor_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Metabox_Editor
	 */
	protected $subject;

	/**
	 * Set up the class which will be tested.
	 */
	protected function set_up() {
		parent::set_up();
		$this->subject = new WPSEO_Metabox_Editor();

		// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound
		if ( ! \defined( 'WPSEO_FILE' ) ) {
			\define( 'WPSEO_FILE', $this->get_wpseo_file() );
		}
		// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound
		if ( ! \defined( 'WPSEO_VERSION' ) ) {
			\define( 'WPSEO_VERSION', '16.6' );
		}
	}

	/**
	 * Get the path to wordpress-seo
	 *
	 * @return false|string
	 */
	protected function get_wpseo_file() {
		return \realpath( __DIR__ . '/../../../../wp-seo.php' );
	}

	/**
	 * Retrieves the flat version from the asset manager.
	 *
	 * @return string The flatten version.
	 */
	public function get_flat_version() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();

		return $asset_manager->flatten_version( \WPSEO_VERSION );
	}

	/**
	 * Tests adding the css inside the editor.
	 *
	 * @covers WPSEO_Metabox_Editor::add_css_inside_editor
	 */
	public function test_add_css_inside_editor_empty() {
		Monkey\Functions\expect( 'plugins_url' )
			->once()
			->with( 'css/dist/inside-editor-' . $this->get_flat_version() . '.css', $this->get_wpseo_file() )
			->andReturn( 'example.org' );

		Monkey\Functions\expect( 'is_rtl' )->andReturn( false );

		$actual   = $this->subject->add_css_inside_editor( '' );
		$expected = 'example.org';

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests adding the css inside the editor with having preexisting css.
	 *
	 * @covers WPSEO_Metabox_Editor::add_css_inside_editor
	 */
	public function test_add_css_inside_editor_preexisting() {
		Monkey\Functions\expect( 'plugins_url' )
			->once()
			->with( 'css/dist/inside-editor-' . $this->get_flat_version() . '.css', $this->get_wpseo_file() )
			->andReturn( 'example.org' );

		Monkey\Functions\expect( 'is_rtl' )->andReturn( false );

		$expected = 'preexisting,example.org';

		$actual = $this->subject->add_css_inside_editor( 'preexisting' );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests adding a custom element.
	 *
	 * @covers WPSEO_Metabox_Editor::add_custom_element
	 */
	public function test_add_custom_element() {
		$expected = [
			'custom_elements' => '~yoastmark',
		];

		$actual = $this->subject->add_custom_element( [] );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests adding a custom element with having preexistings elements.
	 *
	 * @covers WPSEO_Metabox_Editor::add_custom_element
	 */
	public function test_add_custom_element_preexisting() {
		$expected = [
			'custom_elements' => 'div,~yoastmark',
		];

		$actual = $this->subject->add_custom_element( [ 'custom_elements' => 'div' ] );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests adding a custom element that also contains other properties.
	 *
	 * @covers WPSEO_Metabox_Editor::add_custom_element
	 */
	public function test_add_custom_element_other_properties() {
		$expected = [
			'custom_elements' => '~yoastmark',
			'other_property'  => 'hello world',
		];

		$actual = $this->subject->add_custom_element(
			[
				'custom_elements' => '',
				'other_property'  => 'hello world',
			]
		);
		\ksort( $actual );

		$this->assertSame( $expected, $actual );
	}
}
