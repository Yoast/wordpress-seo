<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Global_Setting_Field_Map class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map
 */
final class Global_Setting_Field_Map_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Global_Setting_Field_Map
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->instance = new Global_Setting_Field_Map();
	}

	/**
	 * Creates a target mock that fills the `portfolio` post type into option patterns.
	 *
	 * @param string $target_name The name of the target.
	 *
	 * @return Mockery\MockInterface|Global_Setting_Target_Interface The target mock.
	 */
	private function mock_target( string $target_name ) {
		$target = Mockery::mock( Global_Setting_Target_Interface::class );
		$target->allows( 'get_name' )->andReturn( $target_name );
		$target->allows( 'format_option_name' )->andReturnUsing(
			static function ( $option_pattern ) {
				return \sprintf( $option_pattern, 'portfolio' );
			},
		);

		return $target;
	}

	/**
	 * Tests that get_fields returns the global setting fields of Yoast SEO with their schema, without their option
	 * patterns.
	 *
	 * @covers ::get_filtered_fields
	 * @covers ::get_default_fields
	 * @covers ::resolve_extra_keys
	 *
	 * @return void
	 */
	public function test_get_fields_defaults() {
		$fields = $this->instance->get_fields();

		$this->assertSame( [ 'seo_title', 'meta_description', 'noindex' ], \array_keys( $fields ) );
		$this->assertSame( 'string', $fields['seo_title']['type'] );
		$this->assertSame( 'string', $fields['meta_description']['type'] );
		$this->assertSame( 'boolean', $fields['noindex']['type'] );

		foreach ( $fields as $schema ) {
			$this->assertSame( [ 'type', 'description' ], \array_keys( $schema ) );
		}
	}

	/**
	 * Data provider with the option each field of Yoast SEO is expected to be stored in for each target.
	 *
	 * @return array<string, array<string|null>>
	 */
	public static function data_get_option_name() {
		$expected = [
			'seo_title'        => [
				'homepage'          => 'title-home-wpseo',
				'author_archives'   => 'title-author-wpseo',
				'date_archives'     => 'title-archive-wpseo',
				'search_page'       => 'title-search-wpseo',
				'not_found_page'    => 'title-404-wpseo',
				'post_type_archive' => 'title-ptarchive-portfolio',
			],
			'meta_description' => [
				'homepage'          => 'metadesc-home-wpseo',
				'author_archives'   => 'metadesc-author-wpseo',
				'date_archives'     => 'metadesc-archive-wpseo',
				'search_page'       => null,
				'not_found_page'    => null,
				'post_type_archive' => 'metadesc-ptarchive-portfolio',
			],
			'noindex'          => [
				'homepage'          => null,
				'author_archives'   => 'noindex-author-wpseo',
				'date_archives'     => 'noindex-archive-wpseo',
				'search_page'       => null,
				'not_found_page'    => null,
				'post_type_archive' => 'noindex-ptarchive-portfolio',
			],
		];

		$data = [];
		foreach ( $expected as $field_name => $option_names ) {
			foreach ( $option_names as $target_name => $option_name ) {
				$data[ $field_name . ' for ' . $target_name ] = [ $field_name, $target_name, $option_name ];
			}
		}

		return $data;
	}

	/**
	 * Tests the option each field of Yoast SEO is stored in for each target.
	 *
	 * @covers ::get_option_name
	 *
	 * @dataProvider data_get_option_name
	 *
	 * @param string      $field_name  The name of the field.
	 * @param string      $target_name The name of the target.
	 * @param string|null $expected    The expected option name.
	 *
	 * @return void
	 */
	public function test_get_option_name( $field_name, $target_name, $expected ) {
		$this->assertSame( $expected, $this->instance->get_option_name( $field_name, $this->mock_target( $target_name ) ) );
	}

	/**
	 * Tests that get_option_name returns null for an unknown field.
	 *
	 * @covers ::get_option_name
	 *
	 * @return void
	 */
	public function test_get_option_name_unknown_field() {
		$this->assertNull( $this->instance->get_option_name( 'unknown', $this->mock_target( 'homepage' ) ) );
	}

	/**
	 * Tests that the fields added through the filter are resolved along with their option patterns and validator,
	 * and that the ones without valid option patterns are dropped.
	 *
	 * @covers ::get_filtered_fields
	 * @covers ::resolve_extra_keys
	 * @covers ::get_option_name
	 *
	 * @return void
	 */
	public function test_get_fields_filtered() {
		$validator = static function () {
			return null;
		};

		Monkey\Filters\expectApplied( 'wpseo_global_setting_ability_fields' )->once()->andReturn(
			[
				'social_title'      => [
					'type'              => 'string',
					'option_patterns'   => [ 'post_type_archive' => 'social-title-ptarchive-%s' ],
					'validate_callback' => $validator,
				],
				'no_patterns'       => [ 'type' => 'string' ],
				'empty_patterns'    => [
					'type'            => 'string',
					'option_patterns' => [],
				],
				'invalid_patterns'  => [
					'type'            => 'string',
					'option_patterns' => 'social-title-home',
				],
				'invalid_pattern'   => [
					'type'            => 'string',
					'option_patterns' => [ 'homepage' => 42 ],
				],
				'unnamed_target'    => [
					'type'            => 'string',
					'option_patterns' => [ 'social-title-home' ],
				],
			],
		);

		$this->assertSame( [ 'social_title' => [ 'type' => 'string' ] ], $this->instance->get_fields() );
		$this->assertSame( [ 'social_title' => $validator ], $this->instance->get_validators() );
		$this->assertSame( 'social-title-ptarchive-portfolio', $this->instance->get_option_name( 'social_title', $this->mock_target( 'post_type_archive' ) ) );
	}

	/**
	 * Tests that get_validators_for_target warns about the fields the target does not have, and otherwise lets the
	 * validator of the field, if any, validate the value.
	 *
	 * @covers ::get_validators_for_target
	 *
	 * @return void
	 */
	public function test_get_validators_for_target() {
		Monkey\Filters\expectApplied( 'wpseo_global_setting_ability_fields' )->once()->andReturn(
			[
				'seo_title'    => [
					'type'            => 'string',
					'option_patterns' => [ 'search_page' => 'title-search-wpseo' ],
				],
				'social_title' => [
					'type'              => 'string',
					'option_patterns'   => [ 'search_page' => 'social-title-search-wpseo' ],
					'validate_callback' => static function ( $value, $field_name ) {
						return ( $value === 'Invalid' ) ? 'The ' . $field_name . ' setting is invalid.' : null;
					},
				],
				'noindex'      => [
					'type'            => 'boolean',
					'option_patterns' => [ 'author_archives' => 'noindex-author-wpseo' ],
				],
			],
		);

		$validators = $this->instance->get_validators_for_target( $this->mock_target( 'search_page' ) );

		$this->assertSame( [ 'seo_title', 'social_title', 'noindex' ], \array_keys( $validators ) );
		$this->assertNull( $validators['seo_title']( 'Search', 'seo_title' ) );
		$this->assertNull( $validators['social_title']( 'Search', 'social_title' ) );
		$this->assertSame( 'The social_title setting is invalid.', $validators['social_title']( 'Invalid', 'social_title' ) );
		$this->assertSame( 'The noindex setting is not available for search_page, so it was not saved.', $validators['noindex']( true, 'noindex' ) );
	}
}
