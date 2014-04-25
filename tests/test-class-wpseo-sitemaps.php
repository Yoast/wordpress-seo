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
     * @var int
     */
    private $post_id;

	/**
	 * @var WPSEO_Sitemaps
	 */
	private static $class_instance;

	public static function setUpBeforeClass() {
		self::$class_instance = new WPSEO_Sitemaps;
	}

	public function setUp() {
        parent::setUp();

		global $wp_filter, $wp_actions;
		$this->wp_filter = $wp_filter;
		$this->wp_actions = $wp_actions;

		$this->factory->post->create_many( 5 );
		$post_id = $this->factory->post->create(
			array( 
				'post_title' => 'Sample Post', 
				'post_type' => 'post', 
				'post_status' => 'publish'
			) 
		);

		$this->post_id = $post_id;
	}

    public function tearDown() {
        parent::tearDown();

        wp_delete_post( $this->post_id );
    }

	/**
	 * @covers WPSEO_Sitemaps::canonical
	 */
	public function test_canonical() {
		$url = site_url();
		$this->assertNotEmpty( self::$class_instance->canonical( $url ) );

		set_query_var('sitemap', 'sitemap_value');
		$this->assertFalse( self::$class_instance->canonical( $url ) );

		set_query_var('xsl', 'xsl_value');
		$this->assertFalse( self::$class_instance->canonical( $url ) );
	}

	/**
	 * @covers WPSEO_Sitemaps::get_last_modified
	 */
	public function test_get_last_modified() {
		$date = self::$class_instance->get_last_modified( array( 'post' ) );
		$post = get_post( $this->post_id );

		$this->assertEquals( $date, date( 'c', strtotime( $post->post_modified_gmt ) ) );
	}

}