<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test whether we can detect plugin data to import successfully.
 */
class WPSEO_Import_External_Detector_Test extends WPSEO_UnitTestCase {

	/**
	 *  Test whether we can return properly when there's no plugin data.
	 *
	 * @covers WPSEO_Import_Plugins_Detector::detect
	 */
	public function test_detect_no_data() {
		$detector = new WPSEO_Import_Plugins_Detector();
		$detector->detect();

		$this->assertEquals( array(), $detector->needs_import );
	}

	/**
	 * Test whether we can detect a plugin's data.
	 *
	 * @covers WPSEO_Import_Plugins_Detector::detect
	 */
	public function test_detect_with_data() {
		$this->setup_post();
		$detector = new WPSEO_Import_Plugins_Detector();
		$detector->detect();

		$this->assertCount( 1, $detector->needs_import );
	}

	/**
	 * Sets up a test post.
	 *
	 * @return int $post_id ID for the post created.
	 */
	private function setup_post() {
		$post_id = $this->factory()->post->create();
		update_post_meta( $post_id, '_aioseop_title', 'Test title' );
		update_post_meta( $post_id, '_aioseop_description', 'Test description' );

		return $post_id;
	}
}
