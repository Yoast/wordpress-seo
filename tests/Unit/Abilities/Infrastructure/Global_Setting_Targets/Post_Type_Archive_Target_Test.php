<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Global_Setting_Targets;

use Brain\Monkey;
use Mockery;
use WP_Post_Type;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Post_Type_Archive_Target;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Woocommerce_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Post_Type_Archive_Target class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Post_Type_Archive_Target
 */
final class Post_Type_Archive_Target_Test extends TestCase {

	/**
	 * The post type helper mock.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * The WooCommerce helper mock.
	 *
	 * @var Mockery\MockInterface|Woocommerce_Helper
	 */
	private $woocommerce_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->post_type_helper   = Mockery::mock( Post_Type_Helper::class );
		$this->woocommerce_helper = Mockery::mock( Woocommerce_Helper::class );
	}

	/**
	 * Creates the instance under test.
	 *
	 * @param string $post_type The post type.
	 *
	 * @return Post_Type_Archive_Target The instance.
	 */
	private function create( string $post_type ): Post_Type_Archive_Target {
		return new Post_Type_Archive_Target( $post_type, $this->post_type_helper, $this->woocommerce_helper );
	}

	/**
	 * Tests the name, identifiers and option names of a content type archive.
	 *
	 * @covers ::__construct
	 * @covers ::get_name
	 * @covers ::get_identifiers
	 * @covers ::format_option_name
	 *
	 * @return void
	 */
	public function test_identity() {

		$post_type_object        = Mockery::mock( WP_Post_Type::class );
		$post_type_object->label = 'Portfolio';

		Monkey\Functions\expect( 'get_post_type_object' )->with( 'portfolio' )->andReturn( $post_type_object );

		$instance = $this->create( 'portfolio' );

		$this->assertSame( 'post_type_archive', $instance->get_name() );
		$this->assertSame(
			[
				'target'    => 'post_type_archive',
				'post_type' => 'portfolio',
				'label'     => 'Portfolio',
			],
			$instance->get_identifiers(),
		);
		$this->assertFalse( $instance->is_shared() );
		$this->assertSame( 'title-ptarchive-portfolio', $instance->format_option_name( 'title-ptarchive-%s' ) );
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

		$instance = $this->create( 'gone' );

		$this->assertSame( 'gone', $instance->get_identifiers()['label'] );
	}

	/**
	 * Data provider for test_ensure_available.
	 *
	 * @return array<string, array<string, string|int|bool|null>>
	 */
	public static function data_ensure_available() {
		return [
			'Eligible content type'           => [
				'post_type'          => 'portfolio',
				'woocommerce_active' => false,
				'shop_page_id'       => 0,
				'expected_code'      => null,
			],
			'Product without WooCommerce'     => [
				'post_type'          => 'product',
				'woocommerce_active' => false,
				'shop_page_id'       => 0,
				'expected_code'      => null,
			],
			'Missing post type'               => [
				'post_type'          => '',
				'woocommerce_active' => false,
				'shop_page_id'       => 0,
				'expected_code'      => 'yoast_seo_missing_post_type',
			],
			'Content type without an archive' => [
				'post_type'          => 'post',
				'woocommerce_active' => false,
				'shop_page_id'       => 0,
				'expected_code'      => 'yoast_seo_invalid_post_type',
			],
			'WooCommerce Shop page'           => [
				'post_type'          => 'product',
				'woocommerce_active' => true,
				'shop_page_id'       => 12,
				'expected_code'      => 'yoast_seo_woocommerce_shop_page',
			],
			'WooCommerce without Shop page'   => [
				'post_type'          => 'product',
				'woocommerce_active' => true,
				'shop_page_id'       => -1,
				'expected_code'      => 'yoast_seo_woocommerce_shop_page',
			],
		];
	}

	/**
	 * Tests that ensure_available only lets content types with an archive with global settings through.
	 *
	 * @covers ::ensure_available
	 * @covers ::get_woocommerce_shop_exception
	 *
	 * @dataProvider data_ensure_available
	 *
	 * @param string      $post_type          The post type.
	 * @param bool        $woocommerce_active Whether WooCommerce is active.
	 * @param int         $shop_page_id       The ID of the Shop page.
	 * @param string|null $expected_code      The expected error code, or null when the archive is available.
	 *
	 * @return void
	 */
	public function test_ensure_available( $post_type, $woocommerce_active, $shop_page_id, $expected_code ) {
		$this->post_type_helper->allows( 'get_indexable_post_archives' )->andReturn(
			[
				'portfolio' => Mockery::mock( WP_Post_Type::class ),
				'product'   => Mockery::mock( WP_Post_Type::class ),
			],
		);
		$this->woocommerce_helper->allows( 'is_active' )->andReturn( $woocommerce_active );
		$this->woocommerce_helper->allows( 'get_shop_page_id' )->andReturn( $shop_page_id );

		try {
			$this->create( $post_type )->ensure_available();
		} catch ( Unavailable_Global_Setting_Target_Exception $exception ) {
			$this->assertSame( $expected_code, $exception->get_error_code() );
			return;
		}

		$this->assertNull( $expected_code );
	}

	/**
	 * Tests that ensure_available does not point to the Shop page when the product archive has no global settings.
	 *
	 * @covers ::ensure_available
	 *
	 * @return void
	 */
	public function test_ensure_available_product_without_archive_with_woocommerce() {
		$this->post_type_helper->expects( 'get_indexable_post_archives' )->andReturn( [] );
		$this->woocommerce_helper->allows( 'is_active' )->andReturn( true );
		$this->woocommerce_helper->expects( 'get_shop_page_id' )->never();

		$this->expectException( Unavailable_Global_Setting_Target_Exception::class );
		$this->expectExceptionMessage( 'No content type archive with SEO data exists for the given post_type.' );

		$this->create( 'product' )->ensure_available();
	}
}
