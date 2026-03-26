<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Yoast_Plugins_Tab\Domain\Yoast_Plugin_Detector;

/**
 * Tests the Yoast_Plugin_Detector is_yoast_plugin method.
 *
 * @group yoast-plugins-tab
 *
 * @covers Yoast\WP\SEO\Yoast_Plugins_Tab\Domain\Yoast_Plugin_Detector::is_yoast_plugin
 */
final class Is_Yoast_Plugin_Test extends Abstract_Yoast_Plugin_Detector_Test {

	/**
	 * Tests that a plugin authored solely by Team Yoast is detected.
	 *
	 * @return void
	 */
	public function test_is_yoast_plugin_with_team_yoast_author() {
		$plugin_data = [ 'AuthorName' => 'Team Yoast' ];

		$this->assertTrue( $this->instance->is_yoast_plugin( $plugin_data ) );
	}

	/**
	 * Tests that a plugin co-authored by Team Yoast is detected.
	 *
	 * @return void
	 */
	public function test_is_yoast_plugin_with_co_authored_plugin() {
		$plugin_data = [ 'AuthorName' => 'Enrico Battocchi & Team Yoast' ];

		$this->assertTrue( $this->instance->is_yoast_plugin( $plugin_data ) );
	}

	/**
	 * Tests that a plugin with multiple authors including Team Yoast is detected.
	 *
	 * @return void
	 */
	public function test_is_yoast_plugin_with_multiple_authors() {
		$plugin_data = [ 'AuthorName' => 'Thomas Kräftner, ViktorFroberg, marol87, pekz0r, angrycreative, Team Yoast' ];

		$this->assertTrue( $this->instance->is_yoast_plugin( $plugin_data ) );
	}

	/**
	 * Tests that a plugin by another author is not detected.
	 *
	 * @return void
	 */
	public function test_is_not_yoast_plugin_with_other_author() {
		$plugin_data = [ 'AuthorName' => 'Automattic' ];

		$this->assertFalse( $this->instance->is_yoast_plugin( $plugin_data ) );
	}

	/**
	 * Tests that a plugin with missing AuthorName is not detected.
	 *
	 * @return void
	 */
	public function test_is_not_yoast_plugin_with_missing_author() {
		$plugin_data = [];

		$this->assertFalse( $this->instance->is_yoast_plugin( $plugin_data ) );
	}

	/**
	 * Tests that a plugin with non-string AuthorName is not detected.
	 *
	 * @return void
	 */
	public function test_is_not_yoast_plugin_with_non_string_author() {
		$plugin_data = [ 'AuthorName' => 123 ];

		$this->assertFalse( $this->instance->is_yoast_plugin( $plugin_data ) );
	}
}
