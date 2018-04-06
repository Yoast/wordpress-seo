<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 *
 * @group indexable
 */
class WPSEO_Indexable_Service_Post_Provider_Test extends WPSEO_UnitTestCase {

	/** @var WPSEO_Indexable_Service_Post_Provider */
	protected $provider;

	/**
	 * Sets an instance of the provider.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();

		$this->provider = new WPSEO_Indexable_Service_Post_Provider();
	}

	/**
	 * Tests if the post is indexable in various situations.
	 **
	 * @covers WPSEO_Indexable_Service_Post_Provider::is_indexable()
	 */
	public function test_is_indexable( ) {
		$this->assertFalse( $this->provider->is_indexable( false ) );
		$this->assertFalse( $this->provider->is_indexable( 'post title' ) );
		$this->assertFalse( $this->provider->is_indexable( -1 ) );
		$this->assertFalse( $this->provider->is_indexable( 1000000000 ) );
		$this->assertFalse( $this->provider->is_indexable( null ) );

		$this->assertFalse(
			$this->provider->is_indexable(
				self::factory()->post->create(
					array(
						'post_type'   => 'revision',
						'post_parent' => 2,
					)
				)
			)
		);

		$this->assertFalse(
			$this->provider->is_indexable(
				self::factory()->post->create(
					array(
						'post_type'   => 'revision',
						'post_name'   => '2-autosave',
						'post_parent' => 2,
					)
				)
			)
		);

		$this->assertTrue( $this->provider->is_indexable( self::factory()->post->create() ) );
	}

	/**
	 * Tests the obtaining of a non indexable post.
	 *
	 * @covers WPSEO_Indexable_Service_Post_Provider::get()
	 */
	public function test_get_a_non_indexable_post() {
		$this->assertEquals( array(), $this->provider->get( false ) );
		$this->assertEquals( array(), $this->provider->get( 'post title' ) );
		$this->assertEquals( array(), $this->provider->get( -1 ) );
		$this->assertEquals( array(), $this->provider->get( 1000000000 ) );
		$this->assertEquals( array(), $this->provider->get( null ) );

		$this->assertEquals(
			array(),
			$this->provider->get(
				self::factory()->post->create(
					array(
						'post_type'   => 'revision',
						'post_parent' => 2,
					)
				)
			)
		);

		$this->assertEquals(
			array(),
			$this->provider->get(
				self::factory()->post->create(
					array(
						'post_type'   => 'revision',
						'post_name'   => '2-autosave',
						'post_parent' => 2,
					)
				)
			)
		);
	}

	/**
	 * Tests the getting of an indexable post.
	 *
	 * @covers WPSEO_Indexable_Service_Post_Provider::get()
	 * @covers WPSEO_Indexable_Service_Post_Provider::translate_robots_noindex()
	 */
	public function test_get() {
		$post = self::factory()->post->create_and_get();

		WPSEO_Meta::set_value( 'canonical', 'https://domain.test', $post->ID );
		WPSEO_Meta::set_value( 'title', 'This is the title', $post->ID );
		WPSEO_Meta::set_value( 'metadesc', 'This is a meta description', $post->ID );
		WPSEO_Meta::set_value( 'bctitle', 'Breadcrumb title', $post->ID );
		WPSEO_Meta::set_value( 'opengraph-title', 'OpenGraph title', $post->ID );
		WPSEO_Meta::set_value( 'opengraph-description', 'OpenGraph description', $post->ID );
		WPSEO_Meta::set_value( 'opengraph-image', 'https://domain.test/opengraph_image.jpg', $post->ID );
		WPSEO_Meta::set_value( 'twitter-title', 'Twitter title', $post->ID );
		WPSEO_Meta::set_value( 'twitter-description', 'Twitter description', $post->ID );
		WPSEO_Meta::set_value( 'twitter-image', 'https://domain.test/twitter_image.jpg', $post->ID );
		WPSEO_Meta::set_value( 'meta-robots-noindex', '1', $post->ID );
		WPSEO_Meta::set_value( 'meta-robots-nofollow', '1', $post->ID );
		WPSEO_Meta::set_value( 'meta-robots-adv', 'noarchive,noimageindex', $post->ID );
		WPSEO_Meta::set_value( 'focuskw', 'Focus keyword', $post->ID );
		WPSEO_Meta::set_value( 'linkdex', '10', $post->ID );
		WPSEO_Meta::set_value( 'content_score', '35', $post->ID );
		WPSEO_Meta::set_value( 'is_cornerstone', '1', $post->ID );

		$expected = array(
			'object_id'                   => (int) $post->ID,
			'object_type'                 => 'post',
			'object_subtype'              => $post->post_type,
			'permalink'                   => get_permalink( $post ),
			'canonical'                   => 'https://domain.test',
			'title'                       => 'This is the title',
			'description'                 => 'This is a meta description',
			'breadcrumb_title'            => 'Breadcrumb title',
			'og_title'                    => 'OpenGraph title',
			'og_description'              => 'OpenGraph description',
			'og_image'                    => 'https://domain.test/opengraph_image.jpg',
			'twitter_title'               => 'Twitter title',
			'twitter_description'         => 'Twitter description',
			'twitter_image'               => 'https://domain.test/twitter_image.jpg',
			'is_robots_noindex'           => true,
			'is_robots_nofollow'          => true,
			'is_robots_noarchive'         => true,
			'is_robots_noimageindex'      => true,
			'is_robots_nosnippet'         => false,
			'primary_focus_keyword'       => 'Focus keyword',
			'primary_focus_keyword_score' => 10,
			'readability_score'           => 35,
			'is_cornerstone'              => true,
			'link_count'                  => 0,
			'incoming_link_count'         => 0,
			'created_at'                  => null,
			'updated_at'                  => null,
		);

		$provider = new WPSEO_Indexable_Service_Post_Provider();

		$this->assertEquals( $expected, $provider->get( $post->ID ) );
	}

	/**
	 * Tests the translations of the robots noindex value.
	 *
	 * @param string    $robot_value The value to test with.
	 * @param bool|null $expected    The expected translation.
	 * @param string    $description Description of the test.
	 *
	 * @covers       WPSEO_Indexable_Service_Post_Provider::translate_robots_noindex()
	 *
	 * @dataProvider robots_noindex_provider
	 */
	public function test_translate_robots_noindex( $robot_value, $expected, $description ) {
		$post = self::factory()->post->create_and_get();

		WPSEO_Meta::set_value( 'meta-robots-noindex', $robot_value, $post->ID );

		$data = $this->provider->get( $post->ID );

		$this->assertEquals( $expected, $data[ 'is_robots_noindex' ], $description );
	}

	/**
	 * Returns an array with test data.
	 *
	 * @return array The test data.
	 */
	public function robots_noindex_provider() {
		return array(
			array( '1', true, 'With value set to noindex' ),
			array( '2', false, 'With value set to index' ),
			array( 'default', null, 'With default value' ),
		);
	}
}
