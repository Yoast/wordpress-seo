<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Template_Targets;

use Mockery;
use WP_Post_Type;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Post_Type_Archive_Target_Factory;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Post_Type_Archive_Template_Target;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Woocommerce_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Post_Type_Archive_Target_Factory class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Post_Type_Archive_Target_Factory
 */
final class Post_Type_Archive_Target_Factory_Test extends TestCase {

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
	 * The instance under test.
	 *
	 * @var Post_Type_Archive_Target_Factory
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->post_type_helper   = Mockery::mock( Post_Type_Helper::class );
		$this->woocommerce_helper = Mockery::mock( Woocommerce_Helper::class );

		$this->instance = new Post_Type_Archive_Target_Factory( $this->post_type_helper, $this->woocommerce_helper );
	}

	/**
	 * Tests that create returns a target for any post type.
	 *
	 * @covers ::__construct
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_create() {
		$target = $this->instance->create( 'anything' );

		$this->assertInstanceOf( Post_Type_Archive_Template_Target::class, $target );
		$this->assertSame( 'title-ptarchive-anything', $target->format_option_name( 'title-ptarchive-%s' ) );
	}

	/**
	 * Tests that create_all returns the targets of the archives with template SEO data, leaving out the ones their
	 * target rejects, like the WooCommerce Shop page.
	 *
	 * @covers ::create_all
	 *
	 * @return void
	 */
	public function test_create_all() {
		$this->post_type_helper->allows( 'get_indexable_post_archives' )->andReturn(
			[
				'portfolio' => Mockery::mock( WP_Post_Type::class ),
				'product'   => Mockery::mock( WP_Post_Type::class ),
			],
		);
		$this->woocommerce_helper->allows( 'is_active' )->andReturnTrue();
		$this->woocommerce_helper->allows( 'get_shop_page_id' )->andReturn( 12 );
		$this->stubTranslationFunctions();

		$targets = $this->instance->create_all();

		$this->assertCount( 1, $targets );
		$this->assertSame( 'title-ptarchive-portfolio', $targets[0]->format_option_name( 'title-ptarchive-%s' ) );
	}
}
