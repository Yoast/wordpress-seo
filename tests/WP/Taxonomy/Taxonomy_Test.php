<?php

namespace Yoast\WP\SEO\Tests\WP\Taxonomy;

use WPSEO_Admin_Asset_Manager;
use WPSEO_Taxonomy;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Taxonomy
 */
final class Taxonomy_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Taxonomy
	 */
	private $class_instance;

	/**
	 * Holds the term identifier.
	 *
	 * @var int
	 */
	private $term_id;

	/**
	 * Sets up the tests by setting the class instance.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// Create a new term.
		$this->class_instance = new WPSEO_Taxonomy();
		$this->term_id        = \wp_create_term( 'cat', 'post_tag' )['term_id'];

		// Create a user and set it as the current user.
		$user = $this->factory->user->create_and_get();
		\wp_set_current_user( $user->ID );

		// Register the assets.
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->register_assets();
	}

	/**
	 * Tears down the tests by resetting the scripts and styles.
	 *
	 * @return void
	 */
	public function tear_down() {
		// Dequeue all Yoast SEO scripts and styles.
		$wp_scripts = \wp_scripts();
		$wp_styles  = \wp_styles();

		foreach ( $wp_scripts->registered as $wp_script ) {
			if ( \strpos( $wp_script->src, 'wordpress-seo' ) !== false ) {
				\wp_dequeue_script( $wp_script->handle );
			}
		}

		foreach ( $wp_styles->registered as $wp_style ) {
			if ( \strpos( $wp_style->src, 'wordpress-seo' ) !== false ) {
				\wp_dequeue_style( $wp_style->handle );
			}
		}

		parent::tear_down();
	}

	/**
	 * Tests that the right scripts are enqueued on pages unrelated to terms.
	 *
	 * @covers ::admin_enqueue_scripts
	 *
	 * @return void
	 */
	public function test_admin_enqueue_scripts_default() {
		// Verify that yoast-seo-scoring is registered but not enqueued.
		$this->assertTrue( \wp_style_is( 'yoast-seo-scoring', 'registered' ) );
		$this->assertFalse( \wp_style_is( 'yoast-seo-scoring' ) );

		// Verify that on a page unrelated to terms, no scripts are enqueued.
		$this->class_instance->admin_enqueue_scripts();
		$this->assertFalse( \wp_style_is( 'yoast-seo-scoring' ) );
	}

	/**
	 * Tests that the right scripts are enqueued on the term overview.
	 *
	 * @covers ::admin_enqueue_scripts
	 *
	 * @return void
	 */
	public function test_admin_enqueue_scripts_term_overview() {
		// Go to the term overview page.
		global $pagenow;
		$pagenow = 'edit-tags.php';

		// Verify no scripts are enqueued yet.
		$this->assertTrue( \wp_style_is( 'yoast-seo-scoring', 'registered' ) );
		$this->assertFalse( \wp_style_is( 'yoast-seo-scoring' ) );

		// Verify that the right scripts are enqueued.
		$this->class_instance->admin_enqueue_scripts();
		$this->assertTrue( \wp_style_is( 'yoast-seo-scoring' ) );
		$this->assertTrue( \wp_style_is( 'yoast-seo-monorepo' ) );
		$this->assertTrue( \wp_script_is( 'yoast-seo-edit-page' ) );
	}

	/**
	 * Tests that the right scripts are enqueued on the term edit page.
	 *
	 * @covers ::admin_enqueue_scripts
	 * @covers ::localize_term_scraper_script
	 *
	 * @return void
	 */
	public function test_admin_enqueue_scripts_term_edit() {
		// Go to the term edit page.
		global $pagenow;
		$pagenow = 'term.php';

		// Set the _GET variables.
		$_GET['tag_ID']   = (string) $this->term_id;
		$_GET['taxonomy'] = 'post_tag';

		// Verify no scripts are enqueued yet.
		$this->assertTrue( \wp_style_is( 'yoast-seo-scoring', 'registered' ) );
		$this->assertFalse( \wp_style_is( 'yoast-seo-scoring' ) );

		// Verify that the right scripts are enqueued.
		$this->class_instance->admin_enqueue_scripts();
		$this->assertTrue( \wp_style_is( 'yoast-seo-scoring' ) );
		$this->assertTrue( \wp_style_is( 'yoast-seo-monorepo' ) );
		$this->assertTrue( \wp_style_is( 'yoast-seo-metabox-css' ) );
		$this->assertTrue( \wp_style_is( 'yoast-seo-ai-generator' ) );
	}

	/**
	 * Make sure certain pages are marked as term edit.
	 *
	 * @covers ::is_term_edit
	 *
	 * @return void
	 */
	public function test_is_term_edit() {
		$this->assertTrue( WPSEO_Taxonomy::is_term_edit( 'term.php' ) );
		$this->assertFalse( WPSEO_Taxonomy::is_term_edit( '' ) );
		$this->assertFalse( WPSEO_Taxonomy::is_term_edit( 'random' ) );
	}

	/**
	 * Make sure certain pages are marked as term overview.
	 *
	 * @covers ::is_term_overview
	 *
	 * @return void
	 */
	public function test_is_term_overview() {
		$this->assertFalse( WPSEO_Taxonomy::is_term_overview( 'term.php' ) );
		$this->assertTrue( WPSEO_Taxonomy::is_term_overview( 'edit-tags.php' ) );
		$this->assertFalse( WPSEO_Taxonomy::is_term_overview( '' ) );
		$this->assertFalse( WPSEO_Taxonomy::is_term_overview( 'random' ) );
	}

	/**
	 * Test get_labels function.
	 *
	 * @covers ::get_labels
	 *
	 * @return void
	 */
	public function test_get_labels() {
		$_GET['taxonomy'] = 'category';
		$this->assertEquals( 'Categories', WPSEO_Taxonomy::get_labels()->name );
	}

	/**
	 * Test get_labels function when the parameter is something other than a string.
	 *
	 * @covers ::get_labels
	 *
	 * @return void
	 */
	public function test_get_labels_get_parameter_overwritten() {
		$_GET['taxonomy'] = 13;
		$this->assertEquals( null, WPSEO_Taxonomy::get_labels() );
	}

	/**
	 * Test get_labels function when the parameter is not set.
	 *
	 * @covers ::get_labels
	 *
	 * @return void
	 */
	public function test_get_labels_get_parameter_not_set() {
		$this->assertEquals( null, WPSEO_Taxonomy::get_labels() );
	}
}
