<?php
/**
 * @package WPSEO\Unittests
 */

require_once 'class-wpseo-sitemaps-double.php';

/**
 * Class WPSEO_Sitemaps_Test
 */
class WPSEO_Sitemaps_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Sitemaps
	 */
	private static $class_instance;

	/**
	 * Set up our double class
	 */
	public function setUp() {
		self::$class_instance = new WPSEO_Sitemaps_Double;
	}

	/**
	 * We cannot test this, the cache is set on a static variable
	 * Other tests pre-heat it and provide an erronous value for slow tests (coverage/CI)
	 *
	 * @covers WPSEO_Sitemaps::get_last_modified
	 *
	public function test_get_last_modified() {
		// Create and go to post.
		$post_id = $this->factory->post->create();
		$post    = get_post( $post_id );

		$this->go_to( get_permalink( $post_id ) );

		$date = self::$class_instance->get_last_modified( array( 'post' ) );

		$this->assertEquals( date( 'c', strtotime( $post->post_modified_gmt ) ), $date );
	}
	/*/

	/**
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_index_links
	 */
	public function test_post_sitemap() {
		$post_id   = $this->factory->post->create();
		$permalink = get_permalink( $post_id );

		set_query_var( 'sitemap', 'post' );

		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		$this->expectOutputContains( array(
			'<?xml',
			'<urlset ',
			'<loc>' . $permalink . '</loc>',
		) );
	}
}
