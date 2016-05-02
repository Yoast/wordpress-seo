<?php

class WPSEO_Primary_Term_Double extends WPSEO_Primary_Term {

    /**
     * Overwrite the get_terms method, because it uses a dependency
     *
     * @return array
     */
    protected function get_terms() {
        return array(
            ( object ) array(
                'term_id' => 54,
            )
        );
    }
}

class WPSEO_Primary_Term_Test extends WPSEO_UnitTestCase {

    /**
     * @var string name of the taxonomy
     */
    private $taxonomy_name = 'category';

    /**
     * @var int post id
     */
    private $post_id = 1;

    /**
     * @var int id of the primary term
     */
    private $primary_term_id = 54;

    /**
     * Return the correct primary term when primary term already exists.
     *
     * @covers WPSEO_Primary_Term::get_primary_term
     */
    public function test_get_primary_term_WHERE_primary_term_EXISTS() {
        $class_instance = new WPSEO_Primary_Term_Double( $this->taxonomy_name, $this->post_id );
        $class_instance->set_primary_term( $this->primary_term_id );

        $this->assertEquals( $this->primary_term_id, $class_instance->get_primary_term() );

    }

    /**
     * When there's no term for the post, return false.
     *
     * @covers WPSEO_Primary_Term::get_primary_term
     */
    public function test_get_primary_term_WHERE_primary_term_DOES_NOT_EXIST_AND_terms_ARE_EMPTY() {
        $class_instance = new WPSEO_Primary_Term( $this->taxonomy_name, $this->post_id );

        $this->assertFalse( $class_instance->get_primary_term() );
    }

    /**
     * Return the term id when there's no primary term set
     *
     * @covers WPSEO_Primary_Term::get_primary_term
     */
    public function test_get_primary_term_WHERE_primary_term_DOES_NOT_EXIST_AND_term_EXISTS() {
        $post_id = $this->factory->post->create();

        $class_instance = new WPSEO_Primary_Term( $this->taxonomy_name, $post_id );

        $this->assertFalse( $class_instance->get_primary_term() );
    }

    /**
     * When there is more than one term, set the term with the lowest id as primary term.
     *
     * @covers WPSEO_Primary_Term::get_primary_term
     */
    public function test_get_primary_term_WHERE_primary_term_DOES_NOT_EXIST_AND_terms_EXIST() {
        wp_insert_term( 'yoast', 'category' );
        wp_insert_term( 'seo', 'category' );

        $term_first = get_term_by( 'name', 'yoast', 'category' );
        $term_second = get_term_by( 'name', 'seo', 'category' );

        $post_id = $this->factory->post->create( array( 'post_category' => array( $term_first->term_id, $term_second->term_id ) ) );

        $class_instance = new WPSEO_Primary_Term( $this->taxonomy_name, $post_id );

        $this->assertFalse( $class_instance->get_primary_term() );
    }

    /**
     * Test that set_primary_term succesfully updates the primary_term
     *
     * @covers WPSEO_Primary_Term::set_primary_term
     */
    public function test_set_primary_term_UPDATES_post_meta() {
        $class_instance = new WPSEO_Primary_Term( $this->taxonomy_name, $this->post_id );

        $class_instance->set_primary_term( $this->primary_term_id );

        $this->assertEquals( array( $this->primary_term_id ), get_post_meta( $this->post_id, '_yoast_wpseo_primary_' . $this->taxonomy_name ) );
    }
}
