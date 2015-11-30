<?php

class WPSEO_Primary_Term_Admin_Test extends WPSEO_UnitTestCase {

    protected $class_instance;

    public function setUp() {
        parent::setUp();

        $this->class_instance = $this->getMock( 'WPSEO_Primary_Term_Admin', array( 'get_primary_term_taxonomies', 'include_js_templates' ) );
    }

    /**
     * When there are no taxonomies, make sure the js-templates-primary-term view is not included.
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
     */
    public function test_wp_footer_INCLUDE_WITH_taxonomies() {
    }

    public function test_enqueue_assets_EMPTY_taxonomies() {
        global $wp_scripts;

        $this->class_instance->enqueue_assets();

        $this->assertFalse( wp_script_is( 'wpseo-primary-category', 'registered' ) );
    }



}