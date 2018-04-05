<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * OpenGraph tests
 *
 * @group OpenGraph
 */
class WPSEO_OpenGraph_Image_Test extends WPSEO_UnitTestCase {
	/**
	 * Set up class instance.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();
	}

	/**
	 * Provision tests.
	 */
	public function setUp() {
		parent::setUp();
		WPSEO_Frontend::get_instance()->reset();
		remove_all_actions( 'wpseo_opengraph' );
	}

	/**
	 * Clean output buffer after each test.
	 */
	public function tearDown() {
		parent::tearDown();

		WPSEO_Options::set( 'og_default_image', false );
		WPSEO_Options::set( 'og_frontpage_image', false );

		ob_clean();
	}

	/**
	 * Tests whether has images is false by default.
	 */
	public function test_has_images_is_FALSE() {
		$class_instance = $this->setup_class();

		$this->assertFalse( $class_instance->has_images() );
	}

	/**
	 * Tests whether has images is false by default.
	 */
	public function test_add_image_empty() {
		$class_instance = $this->setup_class();

		$this->assertEmpty( $class_instance->add_image( array( 'url' => '' ) ) );
	}

	/**
	 * Tests whether has images is false by default.
	 */
	public function test_add_image_relative() {
		$class_instance = $this->setup_class();

		$class_instance->add_image( array( 'url' => '/test.png' ) );
		$this->assertEquals( $this->sample_array(), $class_instance->get_images() );
	}

	/**
	 * Tests whether has images is false by default.
	 */
	public function test_add_image_twice() {
		$class_instance = $this->setup_class();

		$class_instance->add_image( array( 'url' => 'http://example.org/test.png' ) );
		$class_instance->add_image( array( 'url' => '/test.png' ) );
		$this->assertEquals( $this->sample_array( false ), $class_instance->get_images() );
	}

	/**
	 * Test setting the front page image.
	 */
	public function test_frontpage_image() {
		WPSEO_Options::set( 'og_frontpage_image', '/test.png' );

		$current_page_on_front = get_option( 'page_on_front' );
		$current_show_on_front = get_option( 'show_on_front' );

		// Create and go to a static front page.
		$page_on_front = $this->create_post( 'page' );
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $page_on_front );

		$this->go_to( '/' );

		$class_instance = $this->setup_class();

		$this->assertEquals( $this->sample_array(), $class_instance->get_images() );

		update_option( 'show_on_front', $current_show_on_front );
		update_option( 'page_on_front', $current_page_on_front );
	}

	/**
	 * Test attachment pages.
	 */
	public function test_set_attachment_page_image() {
		$post_id         = $this->create_post();
		$image           = '/assets/yoast.png';
		$rand            = rand( 1000, 9999 );
		$basename        = str_replace( '.png', '-attachment-test-' . $rand . '.png', basename( $image ) );
		$upload_dir      = wp_upload_dir();
		$source_image    = dirname( __FILE__ ) . '/..' . $image;
		$full_image_path = $upload_dir['path'] . '/' . $basename;

		copy( $source_image, $full_image_path ); // Prevent original from deletion.

		$file_array = array(
			'name'     => $basename,
			'tmp_name' => $full_image_path,
		);
		$attach_id  = media_handle_sideload( $file_array, $post_id );
		$filename   = basename( get_attached_file( $attach_id ) );

		$this->go_to( get_permalink( $attach_id ) );

		$class_instance = $this->setup_class();

		$this->assertEquals( $this->sample_full_file_array( $upload_dir['url'] . '/' . $filename ), $class_instance->get_images() );

		wp_delete_file( get_attached_file( $attach_id ) );
	}

	/**
	 * Test get singular false
	 */
	public function test_set_singular_image_FALSE() {
		$post_id = $this->create_post();
		$this->go_to( get_permalink( $post_id ) );

		$class_instance = $this->setup_class();

		$this->assertFalse( $class_instance->has_images() );
	}

	/**
	 * Test get singular false
	 */
	public function test_set_singular_image_post_meta() {
		$post_id = $this->create_post();
		WPSEO_Meta::set_value( 'opengraph-image', '/test.png', $post_id );
		$this->go_to( get_permalink( $post_id ) );

		$class_instance = $this->setup_class();

		$this->assertEquals( $this->sample_array(), $class_instance->get_images() );
	}

	/**
	 * Test get singular post with featured image.
	 */
	public function test_set_singular_image_featured() {
		$post_id = $this->create_post();
		$image   = $this->create_featured_image( '/assets/yoast.png', $post_id );

		$this->go_to( get_permalink( $post_id ) );

		$class_instance = $this->setup_class();

		$this->assertEquals( $this->sample_full_file_array( $image['url'] ), $class_instance->get_images() );
	}

	/**
	 * Test get singular with too small featured image.
	 */
	public function test_set_singular_image_featured_TOO_SMALL() {
		$post_id = $this->create_post();
		$this->create_featured_image( '/assets/small.png', $post_id );

		$this->go_to( get_permalink( $post_id ) );

		$class_instance = $this->setup_class();

		$this->assertEquals( array(), $class_instance->get_images() );
	}

	/**
	 * Test our default image fallback.
	 */
	public function test_set_images_default() {
		WPSEO_Options::set( 'og_default_image', '/test.png' );
		$this->go_to_home();

		$class_instance = $this->setup_class();

		$this->assertEquals( $this->sample_array(), $class_instance->get_images() );
	}

	/**
	 * Test the featured image for the posts page.
	 */
	public function test_set_posts_page_image() {
		$frontpage = $this->create_post( 'page' );
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $frontpage );

		$post_id = $this->create_post( 'page' );
		$image   = $this->create_featured_image( '/assets/yoast.png', $post_id );
		update_option( 'page_for_posts', $post_id );

		$this->go_to( get_permalink( $post_id ) );

		$class_instance = $this->setup_class();

		$this->assertEquals( $this->sample_full_file_array( $image['url'] ), $class_instance->get_images() );
	}

	/**
	 * Test setting the opengraph image for a taxonomy term.
	 */
	public function test_set_taxonomy_image() {
		$post_id = $this->create_post( 'post' );
		$term_id = $this->factory()->category->create( array(
				'name' => 'Test Category 1',
				'slug' => 'test1',
			)
		);
		wp_set_object_terms( $post_id, $term_id, 'category' );
		WPSEO_Taxonomy_Meta::set_value( $term_id, 'category', 'opengraph-image', '/test.png' );

		$url = add_query_arg(
			array(
				'cat' => $term_id,
			), '/'
		);
		$this->go_to( $url );

		$class_instance = $this->setup_class();

		$this->assertEquals( $this->sample_array(), $class_instance->get_images() );
	}

	/**
	 * Test getting the image from post content.
	 */
	public function test_get_images_from_content() {
		// Create our post.
		$post_id        = $this->create_post();

		// Upload an image to it.
		$image          = '/assets/yoast.png';
		$upload_dir     = wp_upload_dir();
		$basename       = basename( $image );
		$source_image   = dirname( __FILE__ ) . '/..' . $image;
		$featured_image = $upload_dir['path'] . '/' . $basename;
		copy( $source_image, $featured_image ); // Prevent original from deletion.

		$file_array     = array(
			'name'     => $basename,
			'tmp_name' => $featured_image,
		);
		$attach_id      = media_handle_sideload( $file_array, $post_id );

		// Get the image URL so we can add it in the post content.
		$file           = get_attached_file( $attach_id );
		$attached_image = $upload_dir['url'] . '/' . basename( $file );
		$image2_url     = 'https://cdn.yoast.com/app/uploads/2018/03/Caroline_Blog_SEO_FI-600x314.jpg';

		// Update the post content.
		$post_content = '<p>This is a post. It has an image:</p>
<img src="' . $attached_image . '"/>
<p>It also has an image that is not attached to this post:</p>
<img src="' . $image2_url . '"/>
<p>End of post</p>';
		wp_update_post( array( 'ID' => $post_id, 'post_content' => $post_content ) );

		// Run our test.
		$this->go_to( get_permalink( $post_id ) );
		$class_instance = $this->setup_class();

		$expected = $this->sample_full_file_array( $attached_image );
		$expected['https://cdn.yoast.com/app/uploads/2018/03/Caroline_Blog_SEO_FI-600x314.jpg'] = array(
			'url' => 'https://cdn.yoast.com/app/uploads/2018/03/Caroline_Blog_SEO_FI-600x314.jpg'
		);

		$this->assertEquals( $expected, $class_instance->get_images() );
	}

	/**
	 * Test using an image that's already uploaded to another post as OG setting.
	 */
	public function test_uploaded_image_added_by_id() {
		// We create a post, and upload an image to it.
		$post_id = $this->create_post();
		$image   = $this->create_featured_image( '/assets/yoast.png', $post_id );

		// We create another post and use the image, attached to the _other_ post, as its OpenGraph image.
		$post2_id = $this->create_post();
		WPSEO_Meta::set_value( 'opengraph-image', $image['url'], $post2_id );

		//		$this->assertEquals( '1', get_post_meta( $post2_id, '_yoast_wpseo_opengraph-image', true ) );
		$this->assertEquals( $image['url'], WPSEO_Meta::get_value( 'opengraph-image', $post2_id ) );
		$this->go_to( get_permalink( $post2_id ) );
		$class_instance = $this->setup_class();

		$this->assertEquals( $this->sample_full_file_array( $image['url'] ), $class_instance->get_images() );
	}

	/**
	 * Sets up our test class
	 * @return WPSEO_OpenGraph_Image
	 */
	private function setup_class() {
		return new WPSEO_OpenGraph_Image( new WPSEO_OpenGraph() );
	}

	/**
	 * Creates a post for testing.
	 *
	 * @param string $post_type The post type to create a post of.
	 *
	 * @return int $post_id Post ID.
	 */
	private function create_post( $post_type = 'post' ) {
		return self::factory()->post->create(
			array(
				'post_type' => $post_type,
			)
		);
	}

	/**
	 * @param string  $image   Path.
	 * @param integer $post_id Post ID.
	 *
	 * @return array
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
		$file       = get_attached_file( $attach_id );
		wp_generate_attachment_metadata( $attach_id, $file );
		update_post_meta( $post_id, '_thumbnail_id', $attach_id );


		return array(
			'path' => $file,
			'url'  => $upload_dir['url'] . '/' . basename( $file ),
		);
	}

	/**
	 * Returns a sample test array.
	 *
	 * @param bool $relative Whether the URL was passed in relative or not.
	 *
	 * @return array
	 */
	private function sample_array( $relative = true ) {
		return array(
			'http://example.org/test.png' => array(
				'url' => ( ( $relative ) ? '/test.png' : 'http://example.org/test.png' ),
			),
		);
	}

	/**
	 * Returns a sample test array.
	 *
	 * @param string $url The URL for the file
	 *
	 * @return array
	 */
	private function sample_full_file_array( $url ) {
		return array(
			$url => array(
				'url'    => $url,
				'width'  => 500,
				'height' => 500,
				'alt'    => '',
				'type'   => 'image/png',
			),
		);
	}
}
