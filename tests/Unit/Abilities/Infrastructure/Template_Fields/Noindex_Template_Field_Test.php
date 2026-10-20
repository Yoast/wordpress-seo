<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Template_Fields;

use Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields\Noindex_Template_Field;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Noindex_Template_Field class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields\Noindex_Template_Field
 */
final class Noindex_Template_Field_Test extends TestCase {

	use Template_Field_Test_Trait;

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

		$instance = new Noindex_Template_Field();

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
		$this->assertSame( ( self::EXPECTED_OPTION_NAMES[ $target_name ] ?? null ), ( new Noindex_Template_Field() )->get_option_name( $this->mock_target( $target_name ) ) );
	}
}
