<?php

class WPSEO_Primary_Term_Admin_Test extends WPSEO_UnitTestCase {

    protected $class_instance;

    public function setUp() {
        parent::setUp();

        $this->class_instance = $this->getMock( 'WPSEO_Primary_Term_Admin', array( 'get_category', 'get_primary_term_taxonomies', 'include_js_templates', 'save_primary_term', 'get_primary_term' ) );
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
            ->will( $this->returnValue( array() ));

        $this->class_instance
            ->expects( $this->never() )
            ->method( 'include_js_templates' );

        $this->class_instance->wp_footer();
    }

    /**
     * When there are taxonomies, make sure the js-template-primary-term view is included
     *
     * @covers WPSEO_Primary_Term_Admin::wp_footer
     */
    public function test_wp_footer_INCLUDE_WITH_taxonomies() {
        $taxonomies = array(
            'category' => ( object ) array()
        );

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
     * css/metabox-primary-category.css, js/w-seo-metabox-category.js
     *
     * @covers WPSEO_Primary_Term_Admin::enqueue_assets()
     */
    public function test_enqueue_assets_EMPTY_taxonomies_DO_NOT_enqueue_scripts() {
        $this->class_instance->enqueue_assets();

        $this->assertFalse( wp_style_is( 'wpseo-primary-category', 'registered' ) );
        $this->assertFalse( wp_script_is( 'wpseo-primary-category', 'registered' ) );
    }

    /**
     * Do not enqueue the following scripts when the page is not post edit
     * css/metabox-primary-category.css, js/w-seo-metabox-category.js
     *
     * @covers WPSEO_Primary_Term_Admin::enqueue_assets()
     */
    public function test_enqueue_assets_DO_NOT_enqueue_scripts() {
        $taxonomies = array(
            'category' => ( object ) array(
                'labels' => ( object ) array(
                    'singular_name' => 'Category',
                ),
                'name' => 'category',
            ),
        );

        $this->class_instance
            ->expects( $this->once() )
            ->method( 'get_primary_term_taxonomies' )
            ->will( $this->returnValue( $taxonomies ) );

        $this->class_instance->enqueue_assets();

        $this->assertTrue( wp_style_is( 'wpseo-primary-category', 'registered' ) );
        $this->assertTrue( wp_script_is( 'wpseo-primary-category', 'registered' ) );
    }

    /**
     * When there are taxonomies and the page is post-new, make sure the following files are registered:
     * css/metabox-primary-category.css, js/w-seo-metabox-category.js
     *
     * @covers WPSEO_Primary_Term_Admin::enqueue_assets()
     */
    public function test_enqueue_assets_WITH_taxonomies_DO_enqueue_scripts() {
        global $pagenow;

        $pagenow = 'post-new.php';

        $taxonomies = array(
            'category' => ( object ) array(
                'labels' => ( object ) array(
                    'singular_name' => 'Category',
                ),
                'name' => 'category',
            ),
        );

        $this->class_instance
            ->expects( $this->once() )
            ->method( 'get_primary_term_taxonomies' )
            ->will( $this->returnValue( $taxonomies ) );

        $this->class_instance->enqueue_assets();

        $this->assertTrue( wp_style_is( 'wpseo-primary-category', 'registered' ) );
        $this->assertTrue( wp_script_is( 'wpseo-primary-category', 'registered' ) );
    }

    /**
     * Make sure the primary terms are saved
     *
     * @covers WPSEO_Primary_Term_Admin::save_primary_terms()
     */
    public function test_save_primary_terms_CALLS_save_primary_term() {
        $taxonomies = array(
            'category' => ( object ) array(
                'labels' => ( object ) array(
                    'name' => 'Categories',
                    'singular_name' => 'Category',
                    'search_items' => 'Search Categories',
                    'all_items' => 'All Categories',
                    'parent_item' => 'Parent Category',
                    'parent_item_colon' => 'Parent Category:',
                    'edit_item' => 'Edit Category',
                    'view_item' => 'View Category',
                    'update_item' => 'Update Category',
                    'add_new_item' => 'Add New Category',
                    'new_item_name' => 'New Category Name',
                    'not_found' => 'No categories found.',
                    'no_terms' => 'No categories',
                    'menu_name' => 'Categories',
                    'name_admin_bar' => 'category',
                ),
                'description' => '',
                'public' => true,
                'hierarchical' => true,
                'show_ui' => true,
                'show_in_menu' => true,
                'show_in_nav_menus' => true,
                'show_tagcloud' => true,
                'show_in_quick_edit' => true,
                'meta_box_cb' => 'post_categories_meta_box',
                'rewrite' => array(
                    'with_font' => true,
                    'hierarchical' => true,
                    'ep_mask' => 512,
                    'slug' => 'category',
                ),
                'query_var' => 'category_name',
                '_builtin' => true,
                'cap' => ( object ) array(
                    'manage_terms' => 'manage_categories',
                    'edit_terms' => 'manage_categories',
                    'delete_terms' => 'manage_categories',
                    'assign_terms' => 'edit_posts'
                ),
                'name' => 'category',
                'object_type' => array(
                    '0' => 'post',
                    '1' => 'movie',
                ),
                'label' => 'categories',
            ),
        );

        $this->class_instance
            ->expects( $this->once() )
            ->method( 'get_primary_term_taxonomies' )
            ->will( $this->returnValue( $taxonomies ) );

        $this->class_instance
            ->expects( $this->once() )
            ->method( 'save_primary_term' );

        $this->class_instance->save_primary_terms( 1 );
    }

    /**
     * When the primary term id is not equal to the category id, the id should get updated.
     *
     * @covers WPSEO_Primary_Term_Admin::post_link_category
     */
    public function test_post_link_category_primary_term_IS_NOT_category_id() {
        $this->class_instance
            ->expects ( $this->once() )
            ->method( 'get_primary_term' )
            ->will ( $this->returnValue( '54' ) );

        $get_category = ( object ) array(
            'term_id' => 54
        );

        $this->class_instance
            ->expects( $this->once() )
            ->method( 'get_category' )
            ->will( $this->returnValue( $get_category ) );

        $category = ( object ) array(
            'term_id' => 52,
            'name' => 'test',
            'term_taxonomy_id' => 52,
            'cat_ID' => 52,
        );

        $this->assertEquals( $get_category, $this->class_instance->post_link_category( $category ) );
    }

    /**
     * When the primary term is equal to the category id, return the category
     *
     * @covers WPSEO_Primary_Term_Admin::post_link_category
     */
    public function test_post_link_category_primary_term_IS_category_id() {
        $this->class_instance
            ->expects ( $this->once() )
            ->method( 'get_primary_term' )
            ->will ( $this->returnValue( 1 ) );

        $this->class_instance
            ->expects( $this->never() )
            ->method( 'get_category' );

        $category = ( object ) array(
            'term_id' => 1,
            'name' => 'test',
            'term_taxonomy_id' => 1,
            'cat_ID' => 1,
        );

        $this->assertEquals( $category, $this->class_instance->post_link_category( $category ) );
    }

}