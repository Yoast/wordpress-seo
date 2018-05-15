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
	 * Tests if the post is indexable with having invalid object_ids.
	 *
	 * @dataProvider invalid_object_id_provider
	 *
	 * @param mixed  $object_id   The object id.
	 * @param string $description The test description.
	 *
	 * @covers       WPSEO_Indexable_Service_Post_Provider::is_indexable()
	 */
	public function test_is_indexable_with_invalid_object_ids( $object_id, $description ) {
		$this->assertFalse( $this->provider->is_indexable( $object_id ), $description );
	}

	/**
	 * Tests the obtaining of a non indexable post.
	 *
	 * @covers WPSEO_Indexable_Service_Post_Provider::is_indexable()
	 */
	public function test_is_indexable_with_valid_object_ids_for_non_indexable_posts() {
		$this->assertFalse( $this->provider->is_indexable( $this->get_revision() ) );
		$this->assertFalse( $this->provider->is_indexable( $this->get_auto_save() ) );
	}

	/**
	 * Tests if the post is indexable when having a valid object id.
	 *
	 * @covers WPSEO_Indexable_Service_Post_Provider::is_indexable()
	 */
	public function test_is_indexable() {
		$this->assertTrue( $this->provider->is_indexable( self::factory()->post->create() ) );
	}

	/**
	 * Tests if the post is indexable with having invalid object_ids.
	 *
	 * @dataProvider invalid_object_id_provider
	 *
	 * @param mixed  $object_id   The object id.
	 * @param string $description The test description.
	 *
	 * @covers       WPSEO_Indexable_Service_Post_Provider::get()
	 */
	public function test_get_a_non_indexable_post_with_invalid_object_ids( $object_id, $description ) {
		$this->assertEquals( array(), $this->provider->get( $object_id ), $description );
	}

	/**
	 * Tests the obtaining of a non indexable post.
	 *
	 * @covers WPSEO_Indexable_Service_Post_Provider::get()
	 * @covers WPSEO_Indexable_Service_Post_Provider::is_indexable()
	 */
	public function test_get_a_non_indexable_post() {
		$this->assertEquals( array(), $this->provider->get( $this->get_revision() ) );
		$this->assertEquals( array(), $this->provider->get( $this->get_auto_save() ) );
	}

	/**
	 * Tests the getting of an indexable post.
	 *
	 * @covers WPSEO_Indexable_Service_Post_Provider::get()
	 * @covers WPSEO_Indexable_Service_Post_Provider::get_meta_value()
	 * @covers WPSEO_Indexable_Service_Post_Provider::get_robots_noindex_value()
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
	 * @covers       WPSEO_Indexable_Service_Post_Provider::get_robots_noindex_value()
	 *
	 * @dataProvider robots_noindex_provider
	 */
	public function test_translate_robots_noindex( $robot_value, $expected, $description ) {
		$post = self::factory()->post->create_and_get();

		WPSEO_Meta::set_value( 'meta-robots-noindex', $robot_value, $post->ID );

		$data = $this->provider->get( $post->ID );

		$this->assertEquals( $expected, $data['is_robots_noindex'], $description );
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

	/**
	 * Returns an array with test data.
	 *
	 * @return array The test data.
	 */
	public function invalid_object_id_provider() {
		return array(
			array( false, 'With false as object id' ),
			array( 'post title', 'With a string as object id' ),
			array( -1, 'With negative number as object id' ),
			array( 1000000000, 'With large number as object id' ),
			array( null, 'With null as object id' ),
			array( $this->get_revision(), 'With a revision as object id' ),
			array( $this->get_auto_save(), 'With a revision as object id' ),

		);
	}

	/**
	 * Creates a revision.
	 *
	 * @return int The post id.
	 */
	public function get_revision() {
		return self::factory()->post->create(
			array(
				'post_type'   => 'revision',
				'post_parent' => 2,
			)
		);
	}

	/**
	 * Creates an auto save post.
	 *
	 * @return int The post id.
	 */
	public function get_auto_save() {
		return self::factory()->post->create(
			array(
				'post_type'   => 'revision',
				'post_name'   => '2-autosave',
				'post_parent' => 2,
			)
		);
	}
}
