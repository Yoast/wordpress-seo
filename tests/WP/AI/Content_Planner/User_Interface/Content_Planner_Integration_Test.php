<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\WP\AI\Content_Planner\User_Interface;

use WP_Scripts;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI\Content_Planner\User_Interface\Content_Planner_Integration;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration tests for Content_Planner_Integration.
 *
 * Uses the real asset registration to verify that the content planner data is attached to the block editor script,
 * which bundles and initializes the content planner.
 *
 * @group ai-content-planner
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Content_Planner_Integration
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Content_Planner_Integration_Test extends TestCase {

	/**
	 * The scripts registry from before the test.
	 *
	 * @var WP_Scripts|null
	 */
	private $original_wp_scripts;

	/**
	 * Starts each test with a fresh scripts registry.
	 *
	 * The generated asset list is a stub in the test environment, so the block editor script is registered here when
	 * it is missing, in the header like the real one.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->original_wp_scripts = ( $GLOBALS['wp_scripts'] ?? null );
		$GLOBALS['wp_scripts']     = new WP_Scripts();

		( new WPSEO_Admin_Asset_Manager() )->register_assets();
		if ( ! \wp_script_is( WPSEO_Admin_Asset_Manager::PREFIX . 'block-editor', 'registered' ) ) {
			\wp_register_script( WPSEO_Admin_Asset_Manager::PREFIX . 'block-editor', 'http://example.org/js/dist/block-editor.js', [], 'test', false );
		}
	}

	/**
	 * Restores the original scripts registry.
	 *
	 * @return void
	 */
	public function tear_down() {
		$GLOBALS['wp_scripts'] = $this->original_wp_scripts;

		parent::tear_down();
	}

	/**
	 * Tests that, on admin_enqueue_scripts, the content planner data is printed in the header right before the block
	 * editor script, which the post edit script depends on.
	 *
	 * @covers ::register_hooks
	 * @covers ::enqueue_assets
	 *
	 * @return void
	 */
	public function test_enqueue_assets_localizes_the_block_editor_script() {
		\remove_all_actions( 'admin_enqueue_scripts' );
		\YoastSEO()->classes->get( Content_Planner_Integration::class )->register_hooks();
		\do_action( 'admin_enqueue_scripts', 'post.php' );

		$block_editor_handle = WPSEO_Admin_Asset_Manager::PREFIX . 'block-editor';

		$this->assertStringContainsString(
			'var wpseoContentPlanner = ',
			\wp_scripts()->get_data( $block_editor_handle, 'data' ),
		);

		$this->assertContains( $block_editor_handle, \wp_scripts()->registered[ WPSEO_Admin_Asset_Manager::PREFIX . 'post-edit' ]->deps );

		\wp_enqueue_script( $block_editor_handle );

		\ob_start();
		\wp_scripts()->do_head_items();
		$output = \ob_get_clean();

		$data_position   = \strpos( $output, 'var wpseoContentPlanner = ' );
		$script_position = \strpos( $output, \wp_scripts()->registered[ $block_editor_handle ]->src );

		$this->assertNotFalse( $data_position );
		$this->assertNotFalse( $script_position );
		$this->assertLessThan( $script_position, $data_position );
	}
}
