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

	/** @var WPSEO_Indexable_Service_Post_Provider_Double */
	protected $provider;

	/**
	 * Sets an instance of the provider.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();

		$this->provider = new WPSEO_Indexable_Service_Post_Provider_Double();
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
	 * Tests the conversion of the robots values.
	 *
	 * @param string    $robot_value 	The key to test with.
	 * @param string    $supplied_value The value to test with.
	 * @param bool|null $expected		The expected conversion.
	 * @param string    $description	Description of the test.
	 *
	 * @covers WPSEO_Indexable_Service_Post_Provider::convert_indexable_data()
	 *
	 * @dataProvider indexable_data_conversion_provider
	 */
	public function test_convert_indexable_data( $robot_value, $supplied_value, $expected, $description ) {
		$data = $this->provider->convert_indexable_data( array( $robot_value => $supplied_value ) );

		$this->assertEquals( $expected, $data[ $robot_value ], $description );
	}

	/**
	 * Tests the conversion of the advanced robots values.
	 *
	 * @param string    $robot_value 	The key to test with.
	 * @param string    $supplied_value The value to test with.
	 * @param bool|null $expected		The expected conversion.
	 * @param string    $description	Description of the test.
	 *
	 * @covers WPSEO_Indexable_Service_Post_Provider::convert_advanced()
	 *
	 * @dataProvider advanced_indexable_data_conversion_provider
	 */
	public function test_convert_advanced( $robot_value, $supplied_value, $expected, $description ) {
		$indexable 	= array( $robot_value => $supplied_value );
		$data 		= $this->provider->convert_advanced( $indexable );

		$this->assertEquals( $expected, $data, $description );
	}

	/**
	 * Returns an array with test data.
	 *
	 * @return array The test data.
	 */
	public function indexable_data_conversion_provider() {
		return array(
			array( 'is_robots_nofollow', 'true', '1', 'With is_robots_nofollow value set to nofollow' ),
			array( 'is_robots_nofollow', false,  '0', 'With is_robots_nofollow value set to follow' ),
			array( 'is_robots_noindex', 'false', '2', 'With is_robots_noindex value set to index' ),
			array( 'is_robots_noindex', 'true', '1', 'With is_robots_noindex value set to noindex' ),
			array( 'is_robots_noindex', null, null, 'With is_robots_noindex value set to default' ),
			array( 'is_cornerstone', 'true', '1', 'With is_cornerstone value set to true' ),
			array( 'is_cornerstone', false, null, 'With is_cornerstone value set to false' ),
		);
	}

	/**
	 * Returns an array with test data.
	 *
	 * @return array The test data.
	 */
	public function advanced_indexable_data_conversion_provider() {
		return array(
			array( 'is_robots_nosnippet', false, '', 'With is_robots_nosnippet value set to false' ),
			array( 'is_robots_nosnippet', true, 'nosnippet', 'With is_robots_nosnippet value set to true' ),
			array( 'is_robots_nosnippet', null, '', 'With is_robots_nosnippet value set to null' ),

			array( 'is_robots_noarchive', false, '', 'With is_robots_nosnippet value set to false' ),
			array( 'is_robots_noarchive', true, 'noarchive', 'With is_robots_nosnippet value set to true' ),
			array( 'is_robots_noarchive', null, '', 'With is_robots_nosnippet value set to null' ),

			array( 'is_robots_noimageindex', false, '', 'With is_robots_noimageindex value set to false' ),
			array( 'is_robots_noimageindex', true, 'noimageindex', 'With is_robots_noimageindex value set to true' ),
			array( 'is_robots_noimageindex', null, '', 'With is_robots_noimageindex value set to null' ),
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
