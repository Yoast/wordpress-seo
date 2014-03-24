<?php

class WPSEO_Sitemaps_Test extends WPSEO_UnitTestCase {

	private $wp_actions;

	private $wp_filter;

	public function setUp() {
		global $wp_filter, $wp_actions;

		parent::setUp();

		$this->factory->post->create_many( 5 );
		$post_id = $this->factory->post->create(
			array( 
				'post_title' => 'Sample Post', 
				'post_type' => 'post', 
				'post_status' => 'publish'
			) 
		);

		$this->recent_post = get_post( $post_id );

		$this->wp_filter = $wp_filter;
		$this->wp_actions = $wp_actions;

		$this->sitemap = new WPSEO_Sitemaps();
	}

	// dummy test to prevent warning
	public function test_true_is_true() {
		$this->assertTrue( true );
	}

	public function test_canonical() {
		$url = site_url();
		$this->assertNotEmpty( $this->sitemap->canonical( $url ) );

		set_query_var('sitemap', 'sitemap_value');
		$this->assertFalse( $this->sitemap->canonical( $url ) );

		set_query_var('xsl', 'xsl_value');
		$this->assertFalse( $this->sitemap->canonical( $url ) );
	}

	public function test_get_last_modified() {
		$date = $this->sitemap->get_last_modified( array( 'post' ) );

		$this->assertEquals( $date, date( 'c', strtotime( $this->recent_post->post_modified_gmt ) ) );
	}

}