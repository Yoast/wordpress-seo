<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * OpenGraph tests.
 *
 * @group OpenGraph
 */
class WPSEO_OpenGraph_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_OpenGraph
	 */
	private static $class_instance;

	/**
	 * Set up class instance.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		self::$class_instance = new WPSEO_OpenGraph();
	}

	/**
	 * Provision tests.
	 */
	public function setUp() {
		parent::setUp();
		WPSEO_Frontend::get_instance()->reset();
		remove_all_actions( 'wpseo_opengraph' );

		// Start each test on the home page.
		$this->go_to_home();
	}

	/**
	 * Clean output buffer after each test.
	 */
	public function tearDown() {
		parent::tearDown();

		ob_clean();
	}

	/**
	 * @covers WPSEO_OpenGraph::opengraph
	 */
	public function test_opengraph() {
		self::$class_instance->opengraph();
		$this->assertEquals( 1, did_action( 'wpseo_opengraph' ) );
		ob_clean();
	}

	/**
	 * @covers WPSEO_OpenGraph::og_tag
	 */
	public function test_og_tag() {

		// There should be no output when $content is empty.
		$this->assertFalse( self::$class_instance->og_tag( 'property', '' ) );
		$this->expectOutput( '' );

		// Expect true when $content is not empty.
		$this->assertTrue( self::$class_instance->og_tag( 'property', 'content' ) );
		$this->expectOutput( '<meta property="property" content="content" />' . "\n" );

		// Test escaping.
		$this->assertTrue( self::$class_instance->og_tag( 'property "with quotes"', 'content "with quotes"' ) );
		$this->expectOutput( '<meta property="property &quot;with quotes&quot;" content="content &quot;with quotes&quot;" />' . "\n" );
	}

	/**
	 * Test if the function og_tag gets called when there is a front page image.
	 *
	 * @covers WPSEO_OpenGraph::image
	 */
	public function test_image_HAS_front_page_image() {

		$stub =
			$this
				->getMockBuilder( 'WPSEO_OpenGraph' )
				->setMethods( array( 'og_tag' ) )
				->getMock();

		WPSEO_Options::set( 'og_frontpage_image', get_site_url() . '/wp-content/uploads/2015/01/iphone5_ios7-300x198.jpg' );

		$stub
			->expects( $this->once() )
			->method( 'og_tag' );

		$stub->image();
	}

	/**
	 * Test if the function og_tag does not get called when there is no front page image.
	 *
	 * @covers WPSEO_OpenGraph::image
	 */
	public function test_image_HAS_NO_image() {

		$stub =
			$this
				->getMockBuilder( 'WPSEO_OpenGraph' )
				->setMethods( array( 'og_tag' ) )
				->getMock();

		$stub
			->expects( $this->never() )
			->method( 'og_tag' );

		$stub->image();
	}

	/**
	 * Tests static page set as posts page.
	 */
	public function test_static_posts_page() {

		$post_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
			)
		);
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $post_id );

		$post_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
			)
		);
		update_option( 'page_for_posts', $post_id );
		$this->go_to( get_permalink( $post_id ) );

		$image_url       = 'https://example.com/image.png';
		$expected_output = <<<EXPECTED
<meta property="og:image" content="{$image_url}" />
<meta property="og:image:secure_url" content="{$image_url}" />
EXPECTED;
		WPSEO_Meta::set_value( 'opengraph-image', $image_url, $post_id );

		ob_start();
		self::$class_instance->image( false );
		$result = trim( ob_get_clean() );

		$this->assertEquals( $expected_output, $result );
	}

	/**
	 * @covers WPSEO_OpenGraph::tags
	 */
	public function test_tags() {

		// Not singular, return false.
		$this->assertFalse( self::$class_instance->tags() );

		// Create post, without tags.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// No tags, should return false.
		$this->assertFalse( self::$class_instance->tags() );

		// Add tags to post.
		wp_set_post_tags( $post_id, 'Tag1, Tag2' );
		$expected_tags  = '<meta property="article:tag" content="Tag1" />' . "\n";
		$expected_tags .= '<meta property="article:tag" content="Tag2" />' . "\n";

		// Test again, this time with tags.
		$this->assertTrue( self::$class_instance->tags() );
		$this->expectOutput( $expected_tags );
	}

	/**
	 * @covers WPSEO_OpenGraph::category
	 */
	public function test_category() {

		// Not singular, should return false.
		$this->assertFalse( self::$class_instance->category() );

		// Create post in category, go to post.
		$category_id = wp_create_category( 'Category Name' );
		$post_id     = $this->factory->post->create( array( 'post_category' => array( $category_id ) ) );
		$this->go_to( get_permalink( $post_id ) );

		$this->assertTrue( self::$class_instance->category() );
		$this->expectOutput( '<meta property="article:section" content="Category Name" />' . "\n" );
	}

	/**
	 * Tests the rendering of article:section for a post with two categories.
	 *
	 * @covers WPSEO_OpenGraph::category
	 */
	public function test_get_category() {
		$post_id = $this->create_post_with_categories();

		$this->go_to( get_permalink( $post_id ) );

		$class_instance = new WPSEO_OpenGraph();

		ob_start();

		$class_instance->category();

		$output = ob_get_clean();

		$this->assertContains( '<meta property="article:section" content="category1" />', $output );
	}

	/**
	 * Tests the rendering of article:section for a post with two categories where the first
	 * set category will be removed via a filter.
	 *
	 * @covers WPSEO_OpenGraph::category
	 */
	public function test_get_category_with_first_value_removed_by_filter() {
		add_filter( 'get_the_categories', array( $this, 'remove_first_category' ) );

		$post_id = $this->create_post_with_categories();

		$this->go_to( get_permalink( $post_id ) );

		$class_instance = new WPSEO_OpenGraph();

		ob_start();

		$class_instance->category();

		$output = ob_get_clean();

		$this->assertContains( '<meta property="article:section" content="category2" />', $output );

		remove_filter( 'get_the_categories', array( $this, 'remove_first_category' ) );
	}

	/**
	 * Creates a post with a pair of categories attached.
	 *
	 * @return int The created post ID.
	 */
	protected function create_post_with_categories() {
		$post_id = self::factory()->post->create();
		$term1   = self::factory()
			->term
			->create(
				array(
					'name'     => 'category1',
					'taxonomy' => 'category',
				)
			);
		$term2   = self::factory()
			->term
			->create(
				array(
					'name'     => 'category2',
					'taxonomy' => 'category',
				)
			);

		self::factory()->term->add_post_terms( $post_id, array( $term1, $term2 ), 'category' );

		return $post_id;
	}

	/**
	 * Removes the first category from a list.
	 *
	 * @param array $categories List of categories.
	 *
	 * @return array The altered category.
	 */
	public function remove_first_category( $categories ) {
		unset( $categories[0] );

		return $categories;
	}

	/**
	 * @param string  $image   Path.
	 * @param integer $post_id Post ID.
	 *
	 * @return int
	 */
	private function create_featured_image( $image, $post_id ) {

		$basename       = basename( $image );
		$upload_dir     = wp_upload_dir();
		$source_image   = dirname( __FILE__ ) . '/..' . $image;
		$featured_image = $upload_dir['path'] . '/' . $basename;

		copy( $source_image, $featured_image ); // Prevent original from deletion.

		$file_array = array(
			'name'     => $basename,
			'tmp_name' => $featured_image,
		);
		$attach_id  = media_handle_sideload( $file_array, $post_id );

		return $attach_id;
	}
}
