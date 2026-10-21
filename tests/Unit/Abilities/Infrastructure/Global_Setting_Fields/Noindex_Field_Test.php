<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Global_Setting_Fields;

use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Fields\Noindex_Field;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Noindex_Field class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Fields\Noindex_Field
 */
final class Noindex_Field_Test extends TestCase {

	use Global_Setting_Field_Test_Trait;

	/**
	 * The option names the noindex setting is expected to be stored in, keyed by target name.
	 *
	 * @var array<string, string>
	 */
	private const EXPECTED_OPTION_NAMES = [
		'author_archives'   => 'noindex-author-wpseo',
		'date_archives'     => 'noindex-archive-wpseo',
		'post_type_archive' => 'noindex-ptarchive-portfolio',
	];

	/**
	 * Tests the name and schema of the noindex setting.
	 *
	 * @covers ::get_name
	 * @covers ::get_schema
	 *
	 * @return void
	 */
	public function test_name_and_schema() {
		$this->stubTranslationFunctions();

		$instance = new Noindex_Field();

		$this->assertSame( 'noindex', $instance->get_name() );
		$this->assertSame( [ 'type', 'description' ], \array_keys( $instance->get_schema() ) );
		$this->assertSame( 'boolean', $instance->get_schema()['type'] );
	}

	/**
	 * Tests the option the noindex setting is stored in for each archive, and that the other targets have none.
	 *
	 * @covers ::get_option_patterns
	 *
	 * @dataProvider data_targets
	 *
	 * @param string $target_name The name of the target.
	 *
	 * @return void
	 */
	public function test_get_option_name( $target_name ) {
		$this->assertSame( ( self::EXPECTED_OPTION_NAMES[ $target_name ] ?? null ), ( new Noindex_Field() )->get_option_name( $this->mock_target( $target_name ) ) );
	}
}
