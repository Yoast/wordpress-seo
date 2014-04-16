<?php

class WPSEO_Sitemaps_Test extends WPSEO_UnitTestCase {

    /**
     * @var array
     */
    private $wp_actions;

    /**
     * @var array
     */
    private $wp_filter;

    /**
     * @var WPSEO_Sitemaps
     */
    private $class_instance;

    /**
     * @var WP_POST
     */
    private $_post;

	public function setUp() {
        parent::setUp();

		global $wp_filter, $wp_actions;

		$this->factory->post->create_many( 5 );
		$post_id = $this->factory->post->create(
			array( 
				'post_title' => 'Sample Post', 
				'post_type' => 'post', 
				'post_status' => 'publish'
			) 
		);

		$this->_post = get_post( $post_id );

		$this->wp_filter = $wp_filter;
		$this->wp_actions = $wp_actions;

		$this->class_instance = new WPSEO_Sitemaps();
	}

    public function tearDown() {
        parent::tearDown();

        wp_delete_post( $this->_post->ID );
    }

	/**
	 * @covers WPSEO_Sitemaps::canonical
	 */
	public function test_canonical() {
		$url = site_url();
		$this->assertNotEmpty( $this->class_instance->canonical( $url ) );

		set_query_var('sitemap', 'sitemap_value');
		$this->assertFalse( $this->class_instance->canonical( $url ) );

		set_query_var('xsl', 'xsl_value');
		$this->assertFalse( $this->class_instance->canonical( $url ) );
	}

	/**
	 * @covers WPSEO_Sitemaps::get_last_modified
	 */
	public function test_get_last_modified() {
		$date = $this->class_instance->get_last_modified( array( 'post' ) );

		$this->assertEquals( $date, date( 'c', strtotime( $this->_post->post_modified_gmt ) ) );
	}

}