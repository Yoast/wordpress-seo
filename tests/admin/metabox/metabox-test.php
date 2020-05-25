<?php

namespace Yoast\WP\SEO\Tests\Admin\Metabox;

use Brain\Monkey;
use WPSEO_Metabox_Section_Additional;
use Yoast\WP\SEO\Tests\Doubles\Admin\Metabox\Metabox_Double;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @group Metabox
 *
 * @coversDefaultClass \WPSEO_Metabox
 */
class Metabox_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Metabox_Double
	 */
	protected $instance;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();

		global $_SERVER;
		$_SERVER['HTTP_USER_AGENT'] = 'User Agent';

		$this->instance = new Metabox_Double();
	}

	/**
	 * Tests that the `yoast_free_additional_metabox_sections` filter is called.
	 *
	 * @covers ::get_additional_meta_sections
	 */
	public function test_get_additional_meta_sections_calls_filter() {
		Monkey\Filters\expectApplied( 'yoast_free_additional_metabox_sections' )
			->once()
			->with( [] );

		$this->assertEquals( [], $this->instance->get_additional_meta_sections() );
	}

	/**
	 * Tests that it converts entries to a WPSEO_Metabox_Section_Additional instance.
	 *
	 * @covers ::get_additional_meta_sections
	 */
	public function test_get_additional_meta_sections() {
		Monkey\Filters\expectApplied( 'yoast_free_additional_metabox_sections' )
			->once()
			->with( [] )
			->andReturn(
				[
					[
						'name'         => 'tab-name',
						'link_content' => 'Testing Tab',
						'content'      => 'Testing 1 2 3',
						'options'      => [
							'link_class'      => 'tab-class',
							'link_aria_label' => 'this-is-a-tab',
						],
					],
				]
			);

		$actual = $this->instance->get_additional_meta_sections();
		$this->assertSame( 1, \count( $actual ) );

		$entry = \array_pop( $actual );
		$this->assertInstanceOf( WPSEO_Metabox_Section_Additional::class, $entry );

		$this->assertSame( 'tab-name', $entry->name );
		$this->assertSame( 'Testing 1 2 3', $entry->content );
	}

	/**
	 * Tests that any non-array entries are ignored.
	 *
	 * @covers ::get_additional_meta_sections
	 */
	public function test_get_additional_meta_sections_ignores_non_arrays() {
		Monkey\Filters\expectApplied( 'yoast_free_additional_metabox_sections' )
			->once()
			->with( [] )
			->andReturn(
				[
					'not an array',
					[
						'name'         => 'tab-name',
						'link_content' => 'Testing Tab',
						'content'      => 'Testing 1 2 3',
					],
					123,
				]
			);

		$actual = $this->instance->get_additional_meta_sections();
		$this->assertSame( 1, \count( $actual ) );

		$entry = \array_pop( $actual );
		$this->assertInstanceOf( WPSEO_Metabox_Section_Additional::class, $entry );

		$this->assertSame( 'tab-name', $entry->name );
		$this->assertSame( 'Testing 1 2 3', $entry->content );
	}

	/**
	 * Tests that any invalid section entries are ignored. In this case without a name property.
	 *
	 * @covers ::get_additional_meta_sections
	 */
	public function test_get_additional_meta_sections_ignores_invalid_sections() {
		Monkey\Filters\expectApplied( 'yoast_free_additional_metabox_sections' )
			->once()
			->with( [] )
			->andReturn(
				[
					[
						'link_content' => 'Testing Tab',
						'content'      => 'Testing 1 2 3',
					],
				]
			);

		$actual = $this->instance->get_additional_meta_sections();
		$this->assertSame( 0, \count( $actual ) );
	}
}
