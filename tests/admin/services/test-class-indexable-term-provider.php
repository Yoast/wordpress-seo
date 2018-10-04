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
class WPSEO_Indexable_Service_Term_Provider_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Indexable_Service_Term_Provider_Double
	 */
	protected $provider;

	/**
	 * Sets an instance of the provider.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();

		$this->provider = new WPSEO_Indexable_Service_Term_Provider_Double();
	}

	/**
	 * Tests getting non existing terms.
	 *
	 * @covers WPSEO_Indexable_Service_Term_Provider::get()
	 */
	public function test_get_non_existing_term() {
		$this->assertEquals( array(), $this->provider->get( false ) );
		$this->assertEquals( array(), $this->provider->get( 'uncategorized' ) );
		$this->assertEquals( array(), $this->provider->get( -1 ) );
		$this->assertEquals( array(), $this->provider->get( 1000000000 ) );
	}

	/**
	 * Tests if the term is indexable in various situations.
	 *
	 * @covers WPSEO_Indexable_Service_Term_Provider::is_indexable()
	 */
	public function test_is_indexable() {
		$this->assertFalse( $this->provider->is_indexable( false ) );
		$this->assertFalse( $this->provider->is_indexable( 'uncategorized' ) );
		$this->assertFalse( $this->provider->is_indexable( -1 ) );
		$this->assertFalse( $this->provider->is_indexable( 1000000000 ) );

		$term = $this
			->factory()
			->term
			->create(
				array(
					'name'     => 'test',
					'taxonomy' => 'category',
				)
			);

		$this->assertTrue( $this->provider->is_indexable( $term ) );
	}

	/**
	 * Tests the getting of an indexable term.
	 *
	 * @covers WPSEO_Indexable_Service_Term_Provider::get()
	 */
	public function test_get() {
		$term = $this
			->factory()
			->term
			->create_and_get(
				array(
					'name'     => 'test',
					'taxonomy' => 'category',
				)
			);

		WPSEO_Taxonomy_Meta::set_values(
			$term->term_id,
			$term->taxonomy,
			array(
				'wpseo_canonical'             => 'https://domain.test',
				'wpseo_title'                 => 'This is the title',
				'wpseo_desc'                  => 'This is a meta description',
				'wpseo_bctitle'               => 'Breadcrumb title',
				'wpseo_opengraph-title'       => 'OpenGraph title',
				'wpseo_opengraph-description' => 'OpenGraph description',
				'wpseo_opengraph-image'       => 'OpenGraph image',
				'wpseo_twitter-title'         => 'Twitter title',
				'wpseo_twitter-description'   => 'Twitter description',
				'wpseo_twitter-image'         => 'Twitter image',
				'wpseo_noindex'               => 'index',
				'wpseo_focuskw'               => 'Focus keyword',
				'wpseo_linkdex'               => '10',
				'wpseo_content_score'         => '35',
			)
		);

		$expected = array(
			'object_id'                   => (int) $term->term_id,
			'object_type'                 => 'term',
			'object_subtype'              => $term->taxonomy,
			'permalink'                   => get_term_link( $term ),
			'canonical'                   => 'https://domain.test',
			'title'                       => 'This is the title',
			'description'                 => 'This is a meta description',
			'breadcrumb_title'            => 'Breadcrumb title',
			'og_title'                    => 'OpenGraph title',
			'og_description'              => 'OpenGraph description',
			'og_image'                    => 'OpenGraph image',
			'twitter_title'               => 'Twitter title',
			'twitter_description'         => 'Twitter description',
			'twitter_image'               => 'Twitter image',
			'is_robots_noindex'           => false,
			'is_robots_nofollow'          => null,
			'is_robots_noarchive'         => null,
			'is_robots_noimageindex'      => null,
			'is_robots_nosnippet'         => null,
			'primary_focus_keyword'       => 'Focus keyword',
			'primary_focus_keyword_score' => 10,
			'readability_score'           => 35,
			'is_cornerstone'              => false,
			'link_count'                  => null,
			'incoming_link_count'         => null,
			'created_at'                  => null,
			'updated_at'                  => null,
		);

		$this->assertEquals( $expected, $this->provider->get( $term->term_id ) );
		$this->assertInstanceOf( 'WPSEO_Term_Indexable', $this->provider->get( $term->term_id, true ) );
	}

	/**
	 * Tests the conversion of the noindex value.
	 *
	 * @param string    $nofollow    The value to test with.
	 * @param bool|null $expected    The expected conversion.
	 * @param string    $description Description of the test.
	 *
	 * @covers WPSEO_Indexable_Service_Term_Provider::convert_noindex()
	 *
	 * @dataProvider noindex_conversion_provider
	 */
	public function test_convert_noindex( $nofollow, $expected, $description ) {
		$data = $this->provider->convert_noindex( $nofollow );

		$this->assertEquals( $expected, $data, $description );
	}

	/**
	 * Tests the renaming of indexable data.
	 *
	 * @covers WPSEO_Indexable_Service_Term_Provider::rename_indexable_data()
	 */
	public function test_rename_indexable_data() {
		$supplied_values = array(
			'description'                 => '',
			'breadcrumb_title'            => '',
			'og_title'                    => '',
			'og_description'              => '',
			'og_image'                    => '',
			'twitter_title'               => '',
			'twitter_description'         => '',
			'twitter_image'               => '',
			'is_robots_noindex'           => '',
			'primary_focus_keyword'       => '',
			'primary_focus_keyword_score' => '',
			'readability_score'           => '',
		);

		$expected = array(
			'desc'                  => '',
			'bctitle'               => '',
			'opengraph-title'       => '',
			'opengraph-description' => '',
			'opengraph-image'       => '',
			'twitter-title'         => '',
			'twitter-description'   => '',
			'twitter-image'         => '',
			'noindex'               => '',
			'focuskw'               => '',
			'linkdex'               => '',
			'content_score'         => '',
		);

		$data = $this->provider->rename_indexable_data( $supplied_values );

		$this->assertEquals( $expected, $data );
	}

	/**
	 * Tests the conversion of the indexable data.
	 *
	 * @covers WPSEO_Indexable_Service_Term_Provider::convert_indexable_data()
	 */
	public function test_convert_indexable_data() {
		$instance = $this
				->getMockBuilder( 'WPSEO_Indexable_Service_Term_Provider_Double' )
				->setMethods(
					array( 'convert_noindex' )
				)
				->getMock();

		$instance->expects( $this->once() )
				->method( 'convert_noindex' )
				->will( $this->returnArgument( 0 ) );

		$supplied_values = array(
			'desc'              => 'I am the test description',
			'bctitle'           => 'Some breadcrumb title',
			'opengraph-title'   => 'The OpenGraph title',
			'is_robots_noindex' => 'index',
		);

		$expected = array(
			'desc'              => 'I am the test description',
			'bctitle'           => 'Some breadcrumb title',
			'opengraph-title'   => 'The OpenGraph title',
			'is_robots_noindex' => 'index',
		);

		$data = $instance->convert_indexable_data( $supplied_values );

		$this->assertEquals( $expected, $data );
	}

	/**
	 * Returns an array with test data.
	 *
	 * @return array The test data.
	 */
	public function noindex_conversion_provider() {
		return array(
			array( 'true', 'noindex', 'With noindex set to string value of true' ),
			array( 'false', 'index', 'With noindex set to string value of false' ),
			array( true, 'default', 'With noindex set to boolean value of true' ),
			array( false, 'default', 'With noindex set to boolean value of false' ),
			array( '2', 'default', 'With noindex set to string value of 2' ),
			array( '1', 'default', 'With noindex set to string value of 1' ),
			array( '0', 'default', 'With noindex set to string value of 0' ),
		);
	}
}
