<?php

namespace Yoast\WP\SEO\Tests\WP\Inc;

use WPSEO_Meta;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 *
 * @todo Test for defaults.
 */
final class Meta_Test extends TestCase {

	/**
	 * Tests if data can be stored.
	 *
	 * @covers WPSEO_Meta::set_value
	 *
	 * @return void
	 */
	public function test_set_value() {
		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( \get_permalink( $post_id ) );

		WPSEO_Meta::set_value( 'test_set_value_key', 'test_set_value_value', $post_id );
		$this->assertEquals( 'test_set_value_value', \get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'test_set_value_key', true ) );
	}

	/**
	 * Tests if data can be retrieved.
	 *
	 * @covers WPSEO_Meta::get_value
	 *
	 * @return void
	 */
	public function test_get_value() {

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( \get_permalink( $post_id ) );

		$key = 'test_get_value_key';
		$this->register_meta_key( $key );

		\update_post_meta( $post_id, WPSEO_Meta::$meta_prefix . $key, 'test_get_value_value' );

		$this->assertEquals( 'test_get_value_value', WPSEO_Meta::get_value( $key ) );
	}

	/**
	 * Tests if an unregistered field with flat data will return what is stored.
	 *
	 * This is debatable functionality.
	 *
	 * When unserialized data is stored it will not be returned because the
	 * field definition is missing which declares if the data is serialized.
	 *
	 * @see self::test_get_value_unregistered_field_serialized()
	 *
	 * @covers WPSEO_Meta::set_value
	 * @covers WPSEO_Meta::get_value
	 *
	 * @return void
	 */
	public function test_get_value_non_registered_field() {

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( \get_permalink( $post_id ) );

		$key = 'non_registered_key';

		// The field exists on the post - because it will be saved.
		\update_post_meta( $post_id, WPSEO_Meta::$meta_prefix . $key, 'some_value' );

		// As the field is not registered, we should ignore the value in the database.
		$this->assertEquals( 'some_value', WPSEO_Meta::get_value( $key ) );
	}

	/**
	 * Tests if an unregistered field with serialized data will return nothing.
	 *
	 * Because the field definition does not exist in WPSEO_Meta the serialized
	 * data cannot be confirmed to be expected and thus an empty string will
	 * be returned.
	 *
	 * @covers WPSEO_Meta::get_value
	 *
	 * @return void
	 */
	public function test_get_value_unregistered_field_serialized() {

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( \get_permalink( $post_id ) );

		$key = 'non_registered_key_array';

		// The field exists on the post - because it will be saved.
		\update_post_meta( $post_id, WPSEO_Meta::$meta_prefix . $key, [ 'some_value' ] );

		// As the field is not registered, we should ignore the value in the database.
		$this->assertEquals( '', WPSEO_Meta::get_value( $key ) );
	}

	/**
	 * Tests if a non existing key returns an empty string.
	 *
	 * @covers WPSEO_Meta::get_value
	 *
	 * @return void
	 */
	public function test_get_value_non_existing_key() {

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( \get_permalink( $post_id ) );

		// The post meta is never saved, so it is totally unknown.
		$key = 'non_existing_key_2';
		$this->assertEquals( '', WPSEO_Meta::get_value( $key ) );
	}

	/**
	 * Tests if data with slashes remains the same after storing.
	 *
	 * @covers WPSEO_Meta::get_value
	 *
	 * @return void
	 */
	public function test_set_value_slashed() {
		$post_id = $this->factory->post->create();
		$this->go_to( \get_permalink( $post_id ) );

		$key = 'test_set_value_key_slashed';
		$this->register_meta_key( $key );

		$value = '\\"data\\"';

		WPSEO_Meta::set_value( $key, $value, $post_id );
		$this->assertEquals( $value, WPSEO_Meta::get_value( $key, $post_id ) );
	}

	/**
	 * Tests if data, registered as serialized, with slashes remains the same
	 * after storing.
	 *
	 * @covers WPSEO_Meta::set_value
	 * @covers WPSEO_Meta::get_value
	 *
	 * @return void
	 */
	public function test_get_and_set_value_slashed_array() {
		$post_id = $this->factory->post->create();
		$this->go_to( \get_permalink( $post_id ) );

		$key = 'test_set_value_key_slashed_array';
		$this->register_meta_key( $key, true );

		$value = [ 'k\"ey' => '""slashed data" \\"' ];

		WPSEO_Meta::set_value( $key, $value, $post_id );
		$this->assertEquals( $value, WPSEO_Meta::get_value( $key, $post_id ) );
	}

	/**
	 * Tests if serialized data, registered as serialized, with slashes remains
	 * the same after storing.
	 *
	 * @covers WPSEO_Meta::set_value
	 * @covers WPSEO_Meta::get_value
	 *
	 * @return void
	 */
	public function test_get_and_set_value_serialized_and_slashed_array() {
		$post_id = $this->factory->post->create();
		$this->go_to( \get_permalink( $post_id ) );

		$key = 'test_set_value_key_slashed_array';
		$this->register_meta_key( $key, true );

		$array = [ 'ke\\y' => '""slashed data" \\"' ];
		$value = \serialize( $array );

		WPSEO_Meta::set_value( $key, $value, $post_id );
		$this->assertEquals( $value, WPSEO_Meta::get_value( $key, $post_id ) );
	}

	/**
	 * Tests if default meta values are removed when updating post_meta.
	 *
	 * @covers WPSEO_Meta::remove_meta_if_default
	 *
	 * @return void
	 */
	public function test_remove_meta_if_default() {
		// Create and go to post.
		$post_id = $this->factory->post->create();

		// Generate key.
		$key = WPSEO_Meta::$meta_prefix . 'meta-robots-noindex';

		$this->register_meta_key( $key );

		// Set post meta to default value.
		$default_value = WPSEO_Meta::$defaults[ $key ];
		\update_post_meta( $post_id, $key, $default_value );

		// Default post meta should not be saved.
		$meta_value = \get_post_meta( $post_id, $key, true );
		$this->assertEquals( '', $meta_value );
	}

	/**
	 * Tests if default meta values aren't saved when updating post_meta.
	 *
	 * @covers WPSEO_Meta::dont_save_meta_if_default
	 *
	 * @return void
	 */
	public function test_dont_save_meta_if_default() {
		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( \get_permalink( $post_id ) );

		// Generate key.
		$key = WPSEO_Meta::$meta_prefix . 'meta-robots-noindex';

		// Add default value to post_meta.
		$default_value = WPSEO_Meta::$defaults[ $key ];
		\add_post_meta( $post_id, $key, $default_value );

		// Default post meta should not be saved.
		$meta_value = \get_post_meta( $post_id, $key );
		$this->assertEquals( [], $meta_value );
	}

	/**
	 * Tests if default meta values are detected as default meta values.
	 *
	 * @covers WPSEO_Meta::meta_value_is_default
	 *
	 * @return void
	 */
	public function test_meta_value_is_default() {
		$meta_key   = WPSEO_Meta::$meta_prefix . 'meta-robots-noindex';
		$meta_value = WPSEO_Meta::$defaults[ $meta_key ];

		$this->assertTrue( WPSEO_Meta::meta_value_is_default( $meta_key, $meta_value ) );
	}

	/**
	 * Tests if two arrays are recursively merged, the latter overwriting the first.
	 *
	 * @covers WPSEO_Meta::array_merge_recursive_distinct
	 *
	 * @return void
	 */
	public function test_array_merge_recursive_distinct() {

		$input_array1 = [
			'one' => [
				'one-one' => [],
			],
		];

		$input_array2 = [
			'one' => [
				'one-one' => 'string',
			],
		];

		$output = WPSEO_Meta::array_merge_recursive_distinct( $input_array1, $input_array2 );
		$this->assertEquals( $output['one']['one-one'], 'string' );
	}

	/**
	 * Tests if meta robots validation prioritizes and cleans the output.
	 *
	 * @covers WPSEO_Meta::validate_meta_robots_adv
	 *
	 * @return void
	 */
	public function test_validate_meta_robots_adv() {

		// String should be cleaned.
		$this->assertEquals(
			'noarchive,nosnippet',
			WPSEO_Meta::validate_meta_robots_adv( 'noarchive, nosnippet' )
		);
		$this->assertEquals(
			'noarchive,nosnippet',
			WPSEO_Meta::validate_meta_robots_adv( [ 'noarchive', 'nosnippet' ] )
		);
	}

	/**
	 * Registers a field on the WPSEO_Meta class.
	 *
	 * @param string $key        The key to register.
	 * @param bool   $serialized If the key is stored as serialized data.
	 *
	 * @return void
	 */
	protected function register_meta_key( $key, $serialized = false ) {
		WPSEO_Meta::$fields_index[ WPSEO_Meta::$meta_prefix . $key ] = [
			'subset' => 'test',
			'key'    => $key,
		];

		WPSEO_Meta::$meta_fields['test'] = [
			$key => [
				'type'       => 'hidden',
				'serialized' => $serialized,
			],
		];
	}

	/**
	 * Data provider for testing the sanitize post meta function.
	 *
	 * @return array<string,array<string>>
	 */
	public function provider_meta_data() {
		return [
			'should accept default value for linkex metadata'      => [
				'meta_value' => '0',
				'meta_key'   => '_yoast_wpseo_linkdex',
				'expected'   => '0',
			],
			'should accept 50 for linkex metadata'                 => [
				'meta_value' => '50',
				'meta_key'   => '_yoast_wpseo_linkdex',
				'expected'   => '50',
			],
			'should accept 100 for linkex metadata'                => [
				'meta_value' => '100',
				'meta_key'   => '_yoast_wpseo_linkdex',
				'expected'   => '100',
			],
			'should accept -1 for linkex metadata'                 => [
				'meta_value' => '-1',
				'meta_key'   => '_yoast_wpseo_linkdex',
				'expected'   => '0',
			],
			'should not accept not a number for linkex metadata'   => [
				'meta_value' => 'not a number',
				'meta_key'   => '_yoast_wpseo_linkdex',
				'expected'   => '0',
			],
			'should accept noarchive value for meta-robots-adv metadata' => [
				'meta_value' => 'noarchive',
				'meta_key'   => '_yoast_wpseo_meta-robots-adv',
				'expected'   => 'noarchive',
			],
			'should accept nosnippet,noimageindex value for meta-robots-adv metadata' => [
				'meta_value' => 'nosnippet,noimageindex',
				'meta_key'   => '_yoast_wpseo_meta-robots-adv',
				'expected'   => 'nosnippet,noimageindex',
			],
			'should not accept invalid value for meta-robots-adv metadata' => [
				'meta_value' => 'invalid',
				'meta_key'   => '_yoast_wpseo_meta-robots-adv',
				'expected'   => '',
			],
			'should accept url for canonical metadata'             => [
				'meta_value' => 'https://example.com',
				'meta_key'   => '_yoast_wpseo_canonical',
				'expected'   => 'https://example.com',
			],
			'should not accept invalid url for canonical metadata' => [
				'meta_value' => 'not a url',
				'meta_key'   => '_yoast_wpseo_canonical',
				'expected'   => '',
			],
			'should accept url for opengraph-image metadata'       => [
				'meta_value' => 'https://example.com/image.jpg',
				'meta_key'   => '_yoast_wpseo_opengraph-image',
				'expected'   => 'https://example.com/image.jpg',
			],
			'should not accept invalid url for opengraph-image metadata' => [
				'meta_value' => 'not a url',
				'meta_key'   => '_yoast_wpseo_opengraph-image',
				'expected'   => '',
			],
			'should accept url for twitter-image metadata'         => [
				'meta_value' => 'https://example.com/image.jpg',
				'meta_key'   => '_yoast_wpseo_twitter-image',
				'expected'   => 'https://example.com/image.jpg',
			],
			'should accept 1 for is_cornerstone metadata'          => [
				'meta_value' => '1',
				'meta_key'   => '_yoast_wpseo_is_cornerstone',
				'expected'   => '1',
			],
			'should accept 0 for is_cornerstone metadata'          => [
				'meta_value' => '0',
				'meta_key'   => '_yoast_wpseo_is_cornerstone',
				'expected'   => '0',
			],
			'should accept true for is_cornerstone metadata'       => [
				'meta_value' => 'true',
				'meta_key'   => '_yoast_wpseo_is_cornerstone',
				'expected'   => '1',
			],
			'should accept false for is_cornerstone metadata'      => [
				'meta_value' => 'false',
				'meta_key'   => '_yoast_wpseo_is_cornerstone',
				'expected'   => '0',
			],
			'should accept 1 for meta-robots-noindex metadata'     => [
				'meta_value' => '1',
				'meta_key'   => '_yoast_wpseo_meta-robots-noindex',
				'expected'   => '1',
			],
			'should accept 0 for meta-robots-noindex metadata'     => [
				'meta_value' => '0',
				'meta_key'   => '_yoast_wpseo_meta-robots-noindex',
				'expected'   => '0',
			],
			'should not accept invalid value for meta-robots-noindex metadata' => [
				'meta_value' => 'invalid',
				'meta_key'   => '_yoast_wpseo_meta-robots-noindex',
				'expected'   => '0',
			],
			'should accept valid value for schema_page_type metadata' => [
				'meta_value' => 'AboutPage',
				'meta_key'   => '_yoast_wpseo_schema_page_type',
				'expected'   => 'AboutPage',
			],
			'should not accept invalid value for schema_page_type metadata' => [
				'meta_value' => 'InvalidType',
				'meta_key'   => '_yoast_wpseo_schema_page_type',
				'expected'   => '',
			],
			'should accept simple text'                            => [
				'meta_value' => 'test value',
				'meta_key'   => '_yoast_wpseo_title',
				'expected'   => 'test value',
			],
			'should not accept xss' => [
				'meta_value' => '<script>alert("XSS");</script>',
				'meta_key'   => '_yoast_wpseo_title',
				'expected'   => '',
			],
			'should not accept xss an image' => [
				'meta_value' => '<img src=x onerror=alert("XSS")>',
				'meta_key'   => '_yoast_wpseo_metadesc',
				'expected'   => '',
			],
			'should not accept comment' => [
				'meta_value' => '<!--Comment-->',
				'meta_key'   => '_yoast_wpseo_title',
				'expected'   => '',
			],
			'should not accept style' => [
				'meta_value' => '<style>body{display:none}</style>',
				'meta_key'   => '_yoast_wpseo_metadesc',
				'expected'   => '',
			],
			'should accept multi line text' => [
				'meta_value' => "Multi\nLine\rText",
				'meta_key'   => '_yoast_wpseo_title',
				'expected'   => 'Multi Line Text',
			],
		];
	}

	/**
	 * Test the sanitize post meta function.
	 *
	 * @dataProvider provider_meta_data
	 *
	 * @covers WPSEO_Meta::sanitize_post_meta
	 *
	 * @param string $meta_value The meta value to sanitize.
	 * @param string $meta_key   The meta key to sanitize.
	 * @param string $expected   The expected value.
	 *
	 * @return void
	 */
	public function test_sanitize_post_meta( $meta_value, $meta_key, $expected ) {
		$this->assertEquals( $expected, WPSEO_Meta::sanitize_post_meta( $meta_value, $meta_key ) );
	}
}
