<?php
/**
 * @package WPSEO\Tests\Sitemaps
 */

/**
 * Class WPSEO_Post_Type_Sitemap_Provider_Test
 *
 * @group sitemaps
 */
class WPSEO_Post_Type_Sitemap_Provider_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Post_Type_Sitemap_Provider
	 */
	private static $class_instance;

	/**
	 * Set up our double class
	 */
	public function setUp() {
		parent::setUp();

		self::$class_instance = new WPSEO_Post_Type_Sitemap_Provider();
	}

	/**
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_index_links
	 */
	public function test_get_index_links() {

		$index_links = self::$class_instance->get_index_links( 1 );
		$this->assertEmpty( $index_links );

		$this->factory->post->create();
		$index_links = self::$class_instance->get_index_links( 1 );
		$this->assertNotEmpty( $index_links );
		$this->assertContains( 'http://example.org/post-sitemap.xml', $index_links[0] );

		$this->factory->post->create();
		$index_links = self::$class_instance->get_index_links( 1 );
		$this->assertContains( 'http://example.org/post-sitemap1.xml', $index_links[0] );
		$this->assertContains( 'http://example.org/post-sitemap2.xml', $index_links[1] );
	}

	/**
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_sitemap_links
	 */
	public function test_get_sitemap_links() {

		$sitemap_links = self::$class_instance->get_sitemap_links( 'post', 1, 1 );
		$this->assertContains( WPSEO_Utils::home_url(), $sitemap_links[0] );

		$post_id       = $this->factory->post->create();
		$sitemap_links = self::$class_instance->get_sitemap_links( 'post', 1, 1 );
		$this->assertContains( get_permalink( $post_id ), $sitemap_links[1] );
	}

	/**
	 * Tests the excluded posts with the usage of the filter.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_excluded_posts()
	 */
	public function test_get_excluded_posts_with_set_filter() {
		$sitemap_provider = new WPSEO_Post_Type_Sitemap_Provider_Double();

		add_filter( 'wpseo_exclude_from_sitemap_by_post_ids', array( $this, 'filter_with_output' ) );

		$this->assertEquals( array( 5, 600, 23, 0, 0, 3 ), $sitemap_provider->get_excluded_posts() );

		remove_filter( 'wpseo_exclude_from_sitemap_by_post_ids', array( $this, 'filter_with_output' ) );
	}

	/**
	 * Tests the excluded posts with the usage of a filter that returns an invalid value.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_excluded_posts()
	 */
	public function test_get_excluded_posts_with_set_filter_that_has_invalid_return_value() {
		$sitemap_provider = new WPSEO_Post_Type_Sitemap_Provider_Double();

		add_filter( 'wpseo_exclude_from_sitemap_by_post_ids', array( $this, 'filter_with_invalid_output' ) );

		$this->assertEquals( array(), $sitemap_provider->get_excluded_posts( '1,2,3,4' ) );

		remove_filter( 'wpseo_exclude_from_sitemap_by_post_ids', array( $this, 'filter_with_invalid_output' ) );
	}

	/**
	 * Filter method for test.
	 *
	 * @param array $excluded_post_ids The excluded post ids.
	 *
	 * @return array The post ids.
	 */
	public function filter_with_output( $excluded_post_ids ) {
		$excluded_post_ids[] = 5;
		$excluded_post_ids[] = 600;
		$excluded_post_ids[] = '23books';
		$excluded_post_ids[] = '';
		$excluded_post_ids[] = array();
		$excluded_post_ids[] = '    3';

		return $excluded_post_ids;
	}

	/**
	 * Filter method for test.
	 *
	 * @param array $excluded_post_ids The excluded post ids.
	 *
	 * @return string An invalid value.
	 */
	public function filter_with_invalid_output( $excluded_post_ids ) {
		return '';
	}

	/**
	 * Tests if external URLs are not being included in the sitemap
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_url
	 */
	public function test_get_url() {
		$instance = $this->getMockBuilder( 'WPSEO_Post_Type_Sitemap_Provider_Double' )
			->setMethods( array( 'get_home_url' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_home_url' )
			->will( $this->returnValue( 'http://example.org' ) );

		add_filter( 'wpseo_xml_sitemap_post_url', array( $this, 'set_post_sitemap_url' ) );

		/** @var WPSEO_Post_Type_Sitemap_Provider_Double $instance */
		$instance->set_classifier( null );
		$this->assertFalse( $instance->get_url( $this->factory->post->create() ) );

		remove_filter( 'wpseo_xml_sitemap_post_url', array( $this, 'set_post_sitemap_url' ) );
	}

	/**
	 * Helper function to mock sitemap URL.
	 *
	 * @param string $url URL to mock.
	 *
	 * @return string URL to use.
	 */
	public function set_post_sitemap_url( $url ) {
		return 'http://example.com';
	}
}
