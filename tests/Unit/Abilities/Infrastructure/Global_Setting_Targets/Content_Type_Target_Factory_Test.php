<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Global_Setting_Targets;

use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Content_Type_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Content_Type_Target_Factory;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Content_Type_Target_Factory class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Content_Type_Target_Factory
 */
final class Content_Type_Target_Factory_Test extends TestCase {

	/**
	 * The post type helper mock.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * The instance under test.
	 *
	 * @var Content_Type_Target_Factory
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );

		$this->instance = new Content_Type_Target_Factory(
			$this->post_type_helper,
			Mockery::mock( Options_Helper::class ),
		);
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

		$this->assertInstanceOf( Content_Type_Target::class, $target );
		$this->assertSame( 'title-anything', $target->format_option_name( 'title-%s' ) );
	}

	/**
	 * Tests that create_all returns a known target for each indexable post type, plus media when it is left out.
	 *
	 * @covers ::create_all
	 *
	 * @return void
	 */
	public function test_create_all() {
		$this->post_type_helper->expects( 'get_indexable_post_types' )->once()->andReturn(
			[
				'post' => 'post',
				'page' => 'page',
			],
		);

		$targets = $this->instance->create_all();

		$this->assertSame(
			[ 'title-post', 'title-page', 'title-attachment' ],
			\array_map(
				static function ( $target ) {
					return $target->format_option_name( 'title-%s' );
				},
				$targets,
			),
		);

		foreach ( $targets as $target ) {
			$target->ensure_available();
		}
	}

	/**
	 * Tests that create_all does not list media twice when it is indexable.
	 *
	 * @covers ::create_all
	 *
	 * @return void
	 */
	public function test_create_all_with_indexable_media() {
		$this->post_type_helper->expects( 'get_indexable_post_types' )->once()->andReturn(
			[
				'post'       => 'post',
				'attachment' => 'attachment',
			],
		);

		$this->assertCount( 2, $this->instance->create_all() );
	}
}
