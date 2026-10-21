<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Global_Setting_Fields;

use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Fields\Meta_Description_Field;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Meta_Description_Field class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Fields\Meta_Description_Field
 */
final class Meta_Description_Field_Test extends TestCase {

	use Global_Setting_Field_Test_Trait;

	/**
	 * The option names the meta description is expected to be stored in, keyed by target name.
	 *
	 * @var array<string, string>
	 */
	private const EXPECTED_OPTION_NAMES = [
		'homepage'          => 'metadesc-home-wpseo',
		'author_archives'   => 'metadesc-author-wpseo',
		'date_archives'     => 'metadesc-archive-wpseo',
		'post_type_archive' => 'metadesc-ptarchive-portfolio',
	];

	/**
	 * Tests the name and schema of the meta description.
	 *
	 * @covers ::get_name
	 * @covers ::get_schema
	 *
	 * @return void
	 */
	public function test_name_and_schema() {
		$this->stubTranslationFunctions();

		$instance = new Meta_Description_Field();

		$this->assertSame( 'meta_description', $instance->get_name() );
		$this->assertSame( [ 'type', 'description' ], \array_keys( $instance->get_schema() ) );
		$this->assertSame( 'string', $instance->get_schema()['type'] );
	}

	/**
	 * Tests the option the meta description is stored in for each target, and that the search results and 404 pages
	 * have none.
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
		$this->assertSame( ( self::EXPECTED_OPTION_NAMES[ $target_name ] ?? null ), ( new Meta_Description_Field() )->get_option_name( $this->mock_target( $target_name ) ) );
	}
}
