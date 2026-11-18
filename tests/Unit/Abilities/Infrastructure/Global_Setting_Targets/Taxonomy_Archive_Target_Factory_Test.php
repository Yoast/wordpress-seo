<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Global_Setting_Targets;

use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Taxonomy_Archive_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Taxonomy_Archive_Target_Factory;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Taxonomy_Archive_Target_Factory class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Taxonomy_Archive_Target_Factory
 */
final class Taxonomy_Archive_Target_Factory_Test extends TestCase {

	/**
	 * The taxonomy helper mock.
	 *
	 * @var Mockery\MockInterface|Taxonomy_Helper
	 */
	private $taxonomy_helper;

	/**
	 * The instance under test.
	 *
	 * @var Taxonomy_Archive_Target_Factory
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->taxonomy_helper = Mockery::mock( Taxonomy_Helper::class );

		$this->instance = new Taxonomy_Archive_Target_Factory( $this->taxonomy_helper, Mockery::mock( Options_Helper::class ) );
	}

	/**
	 * Tests that create returns a target for any taxonomy.
	 *
	 * @covers ::__construct
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_create() {
		$target = $this->instance->create( 'anything' );

		$this->assertInstanceOf( Taxonomy_Archive_Target::class, $target );
		$this->assertSame( 'title-tax-anything', $target->format_option_name( 'title-tax-%s' ) );
	}

	/**
	 * Tests that create_all returns a known target for each indexable taxonomy, plus the post formats when they are
	 * left out.
	 *
	 * @covers ::create_all
	 *
	 * @return void
	 */
	public function test_create_all() {
		$this->taxonomy_helper->expects( 'get_indexable_taxonomies' )->once()->andReturn( [ 'category', 'post_tag' ] );

		$targets = $this->instance->create_all();

		$this->assertSame(
			[ 'title-tax-category', 'title-tax-post_tag', 'title-tax-post_format' ],
			\array_map(
				static function ( $target ) {
					return $target->format_option_name( 'title-tax-%s' );
				},
				$targets,
			),
		);

		foreach ( $targets as $target ) {
			$target->ensure_available();
		}
	}

	/**
	 * Tests that create_all does not list the post formats twice when they are indexable.
	 *
	 * @covers ::create_all
	 *
	 * @return void
	 */
	public function test_create_all_with_indexable_post_formats() {
		$this->taxonomy_helper->expects( 'get_indexable_taxonomies' )->once()->andReturn( [ 'category', 'post_format' ] );

		$this->assertCount( 2, $this->instance->create_all() );
	}
}
