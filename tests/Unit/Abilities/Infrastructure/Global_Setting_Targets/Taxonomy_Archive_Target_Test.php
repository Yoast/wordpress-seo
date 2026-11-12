<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Global_Setting_Targets;

use Brain\Monkey;
use Mockery;
use WP_Taxonomy;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Taxonomy_Archive_Target;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Taxonomy_Archive_Target class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Taxonomy_Archive_Target
 */
final class Taxonomy_Archive_Target_Test extends TestCase {

	/**
	 * The taxonomy helper mock.
	 *
	 * @var Mockery\MockInterface|Taxonomy_Helper
	 */
	private $taxonomy_helper;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->taxonomy_helper = Mockery::mock( Taxonomy_Helper::class );
		$this->options_helper  = Mockery::mock( Options_Helper::class );
	}

	/**
	 * Creates the instance under test.
	 *
	 * @param string $taxonomy          The taxonomy.
	 * @param bool   $is_known_taxonomy Whether the taxonomy is already known to have default SEO settings.
	 *
	 * @return Taxonomy_Archive_Target The instance.
	 */
	private function create( string $taxonomy, bool $is_known_taxonomy = false ): Taxonomy_Archive_Target {
		return new Taxonomy_Archive_Target( $taxonomy, $this->taxonomy_helper, $this->options_helper, $is_known_taxonomy );
	}

	/**
	 * Tests the name, identifiers, sharing and option names of a taxonomy.
	 *
	 * @covers ::__construct
	 * @covers ::get_name
	 * @covers ::get_identifiers
	 * @covers ::is_shared
	 * @covers ::format_option_name
	 *
	 * @return void
	 */
	public function test_identity() {
		$taxonomy_object        = Mockery::mock( WP_Taxonomy::class );
		$taxonomy_object->label = 'Categories';

		Monkey\Functions\expect( 'get_taxonomy' )->with( 'category' )->andReturn( $taxonomy_object );

		$instance = $this->create( 'category' );

		$this->assertSame( 'taxonomy_archive', $instance->get_name() );
		$this->assertSame(
			[
				'target'   => 'taxonomy_archive',
				'taxonomy' => 'category',
				'label'    => 'Categories',
			],
			$instance->get_identifiers(),
		);
		$this->assertTrue( $instance->is_shared() );
		$this->assertSame( 'title-tax-category', $instance->format_option_name( 'title-tax-%s' ) );
	}

	/**
	 * Tests that the post formats are labelled like on the settings page, and that an unknown taxonomy falls back to
	 * its name.
	 *
	 * @covers ::get_identifiers
	 *
	 * @return void
	 */
	public function test_identity_labels() {
		Monkey\Functions\expect( 'get_taxonomy' )->once()->with( 'gone' )->andReturnFalse();

		$this->assertSame( 'Format archives', $this->create( 'post_format' )->get_identifiers()['label'] );
		$this->assertSame( 'gone', $this->create( 'gone' )->get_identifiers()['label'] );
	}

	/**
	 * Tests that is_enabled is only false for the format archives when they are disabled.
	 *
	 * @covers ::is_enabled
	 *
	 * @return void
	 */
	public function test_is_enabled() {
		$this->options_helper->expects( 'get' )->once()->with( 'disable-post_format', false )->andReturnTrue();

		$this->assertTrue( $this->create( 'category' )->is_enabled() );
		$this->assertFalse( $this->create( 'post_format' )->is_enabled() );
	}

	/**
	 * Data provider for test_ensure_available.
	 *
	 * @return array<string, array<string, string|bool|null>>
	 */
	public static function data_ensure_available() {
		return [
			'Indexable taxonomy' => [
				'taxonomy'      => 'category',
				'is_known'      => false,
				'expected_code' => null,
			],
			'Known taxonomy' => [
				'taxonomy'      => 'unlisted',
				'is_known'      => true,
				'expected_code' => null,
			],
			'Post formats, even disabled' => [
				'taxonomy'      => 'post_format',
				'is_known'      => false,
				'expected_code' => null,
			],
			'Missing taxonomy' => [
				'taxonomy'      => '',
				'is_known'      => false,
				'expected_code' => 'yoast_seo_missing_taxonomy',
			],
			'Taxonomy without settings' => [
				'taxonomy'      => 'nav_menu',
				'is_known'      => false,
				'expected_code' => 'yoast_seo_invalid_taxonomy',
			],
		];
	}

	/**
	 * Tests that ensure_available only lets taxonomies with default SEO settings through.
	 *
	 * @covers ::ensure_available
	 *
	 * @dataProvider data_ensure_available
	 *
	 * @param string      $taxonomy      The taxonomy.
	 * @param bool        $is_known      Whether the taxonomy is already known to have default SEO settings.
	 * @param string|null $expected_code The expected error code, or null when the taxonomy is available.
	 *
	 * @return void
	 */
	public function test_ensure_available( $taxonomy, $is_known, $expected_code ) {
		$this->taxonomy_helper->allows( 'get_indexable_taxonomies' )->andReturn( [ 'category', 'post_tag' ] );

		try {
			$this->create( $taxonomy, $is_known )->ensure_available();
		} catch ( Unavailable_Global_Setting_Target_Exception $exception ) {
			$this->assertSame( $expected_code, $exception->get_error_code() );
			return;
		}

		$this->assertNull( $expected_code );
	}

	/**
	 * Tests that ensure_available does not look up the taxonomies again for a known taxonomy.
	 *
	 * @covers ::ensure_available
	 *
	 * @return void
	 */
	public function test_ensure_available_known_taxonomy() {
		$this->taxonomy_helper->expects( 'get_indexable_taxonomies' )->never();

		$this->create( 'category', true )->ensure_available();
	}
}
