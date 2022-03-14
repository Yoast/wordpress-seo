<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Primary_Term_Admin_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Primary_Term_Admin
	 */
	protected $class_instance;

	/**
	 * Set up the class which will be tested.
	 */
	public function set_up() {
		parent::set_up();

		$this->class_instance = $this->getMockBuilder( 'WPSEO_Primary_Term_Admin' )
			->setMethods( [ 'get_primary_term_taxonomies', 'include_js_templates', 'save_primary_term', 'get_primary_term' ] )
			->getMock();
	}

	/**
	 * When there are no taxonomies, make sure the js-templates-primary-term view is not included.
	 *
	 * @covers WPSEO_Primary_Term_Admin::wp_footer
	 */
	public function test_wp_footer_INCLUDE_NO_taxonomies() {
		$this->class_instance
			->expects( $this->once() )
			->method( 'get_primary_term_taxonomies' )
			->will( $this->returnValue( [] ) );

		$this->class_instance
			->expects( $this->never() )
			->method( 'include_js_templates' );

		$this->class_instance->wp_footer();
	}

	/**
	 * When there are taxonomies, make sure the js-template-primary-term view is included.
	 *
	 * @covers WPSEO_Primary_Term_Admin::wp_footer
	 */
	public function test_wp_footer_INCLUDE_WITH_taxonomies() {
		$taxonomies = [
			'category' => (object) [],
		];

		$this->class_instance
			->expects( $this->once() )
			->method( 'get_primary_term_taxonomies' )
			->will( $this->returnValue( $taxonomies ) );

		$this->class_instance
			->expects( $this->once() )
			->method( 'include_js_templates' );

		$this->class_instance->wp_footer();
	}

	/**
	 * When there are no taxonomies, make sure the following files are not registered:
	 * - css/metabox-primary-category.css;
	 * - js/dist/wp-seo-metabox-category.js.
	 *
	 * @covers WPSEO_Primary_Term_Admin::enqueue_assets
	 */
	public function test_enqueue_assets_EMPTY_taxonomies_DO_NOT_enqueue_scripts() {
		$this->class_instance->enqueue_assets();

		$this->assertFalse( wp_style_is( 'wpseo-primary-category', 'registered' ) );
	}

	/**
	 * Do not enqueue the following scripts when the page is not post edit:
	 * - css/metabox-primary-category.css;
	 * - js/dist/wp-seo-metabox-category.js.
	 *
	 * @covers WPSEO_Primary_Term_Admin::enqueue_assets
	 */
	public function test_enqueue_assets_DO_NOT_enqueue_scripts() {
		$this->class_instance
			->expects( $this->never() )
			->method( 'get_primary_term_taxonomies' );

		$this->class_instance->enqueue_assets();

		$this->assertFalse( wp_style_is( 'wpseo-primary-category', 'registered' ) );
	}

	/**
	 * When there are taxonomies and the page is post-new, make sure the following files are registered:
	 * - css/metabox-primary-category.css;
	 * - js/dist/wp-seo-metabox-category.js.
	 *
	 * @covers WPSEO_Primary_Term_Admin::enqueue_assets
	 */
	public function test_enqueue_assets_WITH_taxonomies_DO_enqueue_scripts() {
		global $pagenow;

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->register_assets();

		$pagenow = 'post-new.php';

		$taxonomies = [
			'category' => (object) [
				'labels'    => (object) [
					'singular_name' => 'Category',
				],
				'name'      => 'category',
				'rest_base' => 'categories',
			],
		];

		$this->class_instance
			->expects( $this->once() )
			->method( 'get_primary_term_taxonomies' )
			->will( $this->returnValue( $taxonomies ) );

		$this->class_instance->enqueue_assets();

		$this->assertTrue( wp_style_is( WPSEO_Admin_Asset_Manager::PREFIX . 'primary-category', 'registered' ) );
	}
}
