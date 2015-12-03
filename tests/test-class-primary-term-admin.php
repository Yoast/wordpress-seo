<?php

class WPSEO_Primary_Term_Admin_Test extends WPSEO_UnitTestCase {

    protected $class_instance;

    public function setUp() {
        parent::setUp();

        $this->class_instance = $this->getMock( 'WPSEO_Primary_Term_Admin', array( 'get_primary_term_taxonomies', 'include_js_templates' ) );
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
     * When there are taxonomies, make sure the following files are registered:
     * css/metabox-primary-category.css, js/w-seo-metabox-category.js
     *
     * @covers WPSEO_Primary_Term_Admin::enqueue_assets()
     */
    public function test_enqueue_assets_WITH_taxonomies_DO_enqueue_scripts() {
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
     *
     * @covers WPSEO_Primary_Term_Admin::save_primary_terms()
     */
    public function save_primary_terms() {
        
    }





}