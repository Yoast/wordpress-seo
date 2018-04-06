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
	 * Tests getting non existing terms.
	 *
	 * @covers WPSEO_Indexable_Service_Term_Provider::get()
	 */
	public function test_get_non_existing_term() {
		$provider = new WPSEO_Indexable_Service_Term_Provider();

		$this->assertEquals( array(), $provider->get( false ) );
		$this->assertEquals( array(), $provider->get( 'uncategorized' ) );
		$this->assertEquals( array(), $provider->get( -1 ) );
		$this->assertEquals( array(), $provider->get( 1000000000 ) );
	}

	public function test_is_indexable() {
		$provider = new WPSEO_Indexable_Service_Term_Provider();

		$this->assertFalse( $provider->is_indexable( false ) );
		$this->assertFalse( $provider->is_indexable( 'uncategorized' ) );
		$this->assertFalse( $provider->is_indexable( -1 ) );
		$this->assertFalse( $provider->is_indexable( 1000000000 ) );

		$term = $this
			->factory()
			->term
			->create(
				array(
					'name'     => 'test',
					'taxonomy' => 'category',
				)
			);

		$this->assertTrue( $provider->is_indexable( $term ) );

	}

	/**
	 * Tests the getting of an indexable term.
	 *
	 * @covers WPSEO_Indexable_Service_Term_Provider::get()
	 * @covers WPSEO_Indexable_Service_Term_Provider::get_meta_value()
	 * @covers WPSEO_Indexable_Service_Term_Provider::translate_robots_noindex()
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

		$provider = new WPSEO_Indexable_Service_Term_Provider();

		$this->assertEquals( $expected, $provider->get( $term->term_id ) );
	}

	/**
	 * Tests the translations of the robots noindex value.
	 *
	 * @param string    $robot_value The value to test with.
	 * @param bool|null $expected    The expected translation.
	 * @param string    $description Description of the test.
	 *
	 * @covers       WPSEO_Indexable_Service_Term_Provider::translate_robots_noindex()
	 *
	 * @dataProvider robots_noindex_provider
	 */
	public function test_translate_robots_noindex( $robot_value, $expected, $description ) {
		$term = $this
			->factory()
			->term
			->create_and_get(
				array(
					'name'     => 'robot',
					'taxonomy' => 'category',
				)
			);

		WPSEO_Taxonomy_Meta::set_value( $term->term_id, $term->taxonomy, 'wpseo_noindex', $robot_value );

		$provider = new WPSEO_Indexable_Service_Term_Provider();
		$data = $provider->get( $term->term_id );

		$this->assertEquals( $expected, $data[ 'is_robots_noindex' ], $description );
	}

	/**
	 * Returns an array with test data.
	 *
	 * @return array The test data.
	 */
	public function robots_noindex_provider() {
		return array(
			array( 'noindex', true, 'With value set to noindex' ),
			array( 'index', false, 'With value set to index' ),
			array( 'default', null, 'With default value' ),
		);
	}
}
