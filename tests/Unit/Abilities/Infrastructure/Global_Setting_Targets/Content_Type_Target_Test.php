<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Global_Setting_Targets;

use Brain\Monkey;
use Mockery;
use WP_Post_Type;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Content_Type_Target;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Content_Type_Target class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Content_Type_Target
 */
final class Content_Type_Target_Test extends TestCase {

	/**
	 * The post type helper mock.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	private $post_type_helper;

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

		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );
		$this->options_helper   = Mockery::mock( Options_Helper::class );
	}

	/**
	 * Creates the instance under test.
	 *
	 * @param string $post_type          The post type.
	 * @param bool   $is_known_post_type Whether the post type is already known to have default SEO settings.
	 *
	 * @return Content_Type_Target The instance.
	 */
	private function create( string $post_type, bool $is_known_post_type = false ): Content_Type_Target {
		return new Content_Type_Target( $post_type, $this->post_type_helper, $this->options_helper, $is_known_post_type );
	}

	/**
	 * Tests the name, identifiers, sharing and option names of a content type.
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
		$post_type_object        = Mockery::mock( WP_Post_Type::class );
		$post_type_object->label = 'Portfolio';

		Monkey\Functions\expect( 'get_post_type_object' )->with( 'portfolio' )->andReturn( $post_type_object );

		$instance = $this->create( 'portfolio' );

		$this->assertSame( 'content_type', $instance->get_name() );
		$this->assertSame(
			[
				'post_type' => 'portfolio',
				'label'     => 'Portfolio',
			],
			$instance->get_identifiers(),
		);
		$this->assertTrue( $instance->is_shared() );
		$this->assertSame( 'title-portfolio', $instance->format_option_name( 'title-%s' ) );
	}

	/**
	 * Tests that the identifiers fall back to the post type as label for an unknown post type.
	 *
	 * @covers ::get_identifiers
	 *
	 * @return void
	 */
	public function test_identity_of_unknown_post_type() {
		Monkey\Functions\expect( 'get_post_type_object' )->once()->with( 'gone' )->andReturnNull();

		$this->assertSame( 'gone', $this->create( 'gone' )->get_identifiers()['label'] );
	}

	/**
	 * Tests that is_enabled is only false for media whose pages are redirected to the media file.
	 *
	 * @covers ::is_enabled
	 *
	 * @return void
	 */
	public function test_is_enabled() {
		$this->options_helper->expects( 'get' )->once()->with( 'disable-attachment', true )->andReturnTrue();

		$this->assertTrue( $this->create( 'post' )->is_enabled() );
		$this->assertFalse( $this->create( 'attachment' )->is_enabled() );
	}

	/**
	 * Data provider for test_ensure_available.
	 *
	 * @return array<string, array<string, string|bool|null>>
	 */
	public static function data_ensure_available() {
		return [
			'Indexable content type' => [
				'post_type'     => 'portfolio',
				'is_known'      => false,
				'expected_code' => null,
			],
			'Known content type' => [
				'post_type'     => 'unlisted',
				'is_known'      => true,
				'expected_code' => null,
			],
			'Media, even when redirected' => [
				'post_type'     => 'attachment',
				'is_known'      => false,
				'expected_code' => null,
			],
			'Missing post type' => [
				'post_type'     => '',
				'is_known'      => false,
				'expected_code' => 'yoast_seo_missing_post_type',
			],
			'Content type without settings' => [
				'post_type'     => 'nav_menu_item',
				'is_known'      => false,
				'expected_code' => 'yoast_seo_invalid_post_type',
			],
		];
	}

	/**
	 * Tests that ensure_available only lets content types with default SEO settings through.
	 *
	 * @covers ::ensure_available
	 *
	 * @dataProvider data_ensure_available
	 *
	 * @param string      $post_type     The post type.
	 * @param bool        $is_known      Whether the post type is already known to have default SEO settings.
	 * @param string|null $expected_code The expected error code, or null when the content type is available.
	 *
	 * @return void
	 */
	public function test_ensure_available( $post_type, $is_known, $expected_code ) {
		$this->post_type_helper->allows( 'get_indexable_post_types' )->andReturn(
			[
				'post'      => 'post',
				'portfolio' => 'portfolio',
			],
		);

		try {
			$this->create( $post_type, $is_known )->ensure_available();
		} catch ( Unavailable_Global_Setting_Target_Exception $exception ) {
			$this->assertSame( $expected_code, $exception->get_error_code() );
			return;
		}

		$this->assertNull( $expected_code );
	}

	/**
	 * Tests that ensure_available does not look up the post types again for a known content type.
	 *
	 * @covers ::ensure_available
	 *
	 * @return void
	 */
	public function test_ensure_available_known_post_type() {
		$this->post_type_helper->expects( 'get_indexable_post_types' )->never();

		$this->create( 'portfolio', true )->ensure_available();
	}
}
