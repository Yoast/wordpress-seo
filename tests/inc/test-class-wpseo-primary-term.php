<?php

class WPSEO_Primary_Term_Test extends WPSEO_UnitTestCase {

    /**
     * Return the correct primary term when primary term already exists.
     *
     * @covers WPSEO_Primary_Term::get_primary_term
     */
    public function test_get_primary_term_WHERE_primary_term_EXISTS() {
        $taxonomy_name = 'yoast';
        $post_id = 3;
        $primary_term_id = 54;

        $class_instance = new WPSEO_Primary_Term( $taxonomy_name, $post_id );

        $class_instance->set_primary_term( $primary_term_id );

        $this->assertEquals( $primary_term_id, $class_instance->get_primary_term() );
    }

    /**
     * When there's no term for the post, return false.
     *
     * @covers WPSEO_Primary_Term::get_primary_term
     */
    public function test_get_primary_term_WHERE_primary_term_DOES_NOT_EXIST_AND_terms_ARE_EMPTY() {
        $taxonomy_name = 'yoast';
        $post_id = 3;

        $class_instance = new WPSEO_Primary_Term( $taxonomy_name, $post_id );

        $this->assertFalse( $class_instance->get_primary_term() );
    }


    /**
     * Test that set_primary_term succesfully updates the primary_term
     *
     * @covers WPSEO_Primary_Term::set_primary_term
     */
    public function test_set_primary_term_UPDATES_post_meta() {
        $taxonomy_name = 'yoast';
        $post_id = 3;
        $primary_term_id = 54;

        $class_instance = new WPSEO_Primary_Term( $taxonomy_name, $post_id );

        $class_instance->set_primary_term( $primary_term_id );

        $this->assertEquals( array( $primary_term_id ), get_post_meta( $post_id, '_yoast_wpseo_primary_' . $taxonomy_name ) );
    }
}