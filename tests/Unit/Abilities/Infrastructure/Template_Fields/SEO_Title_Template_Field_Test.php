<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Template_Fields;

use Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields\SEO_Title_Template_Field;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the SEO_Title_Template_Field class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields\SEO_Title_Template_Field
 */
final class SEO_Title_Template_Field_Test extends TestCase {

	use Template_Field_Test_Trait;

	/**
	 * The option names the SEO title is expected to be stored in, keyed by target name.
	 *
	 * @var array<string, string>
	 */
	private const EXPECTED_OPTION_NAMES = [
		'homepage'          => 'title-home-wpseo',
		'author_archives'   => 'title-author-wpseo',
		'date_archives'     => 'title-archive-wpseo',
		'search_page'       => 'title-search-wpseo',
		'not_found_page'    => 'title-404-wpseo',
		'post_type_archive' => 'title-ptarchive-portfolio',
	];

	/**
	 * Tests the name and schema of the SEO title.
	 *
	 * @covers ::get_name
	 * @covers ::get_schema
	 *
	 * @return void
	 */
	public function test_name_and_schema() {
		$this->stubTranslationFunctions();

		$instance = new SEO_Title_Template_Field();

		$this->assertSame( 'seo_title', $instance->get_name() );
		$this->assertSame( [ 'type', 'description' ], \array_keys( $instance->get_schema() ) );
		$this->assertSame( 'string', $instance->get_schema()['type'] );
	}

	/**
	 * Tests the option the SEO title is stored in for each target.
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
		$this->assertSame( ( self::EXPECTED_OPTION_NAMES[ $target_name ] ?? null ), ( new SEO_Title_Template_Field() )->get_option_name( $this->mock_target( $target_name ) ) );
	}
}
