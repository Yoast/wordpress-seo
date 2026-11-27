<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Features;

use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Features\Xml_Sitemap_Feature;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Xml_Sitemap_Feature class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Features\Xml_Sitemap_Feature
 */
final class Xml_Sitemap_Feature_Test extends TestCase {

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The instance under test.
	 *
	 * @var Xml_Sitemap_Feature
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->instance = new Xml_Sitemap_Feature( $this->options_helper );
	}

	/**
	 * Tests that the getters describe the feature.
	 *
	 * @covers ::get_key
	 * @covers ::get_option_name
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_getters() {
		$this->assertSame( 'xml_sitemap', $this->instance->get_key() );
		$this->assertSame( 'enable_xml_sitemap', $this->instance->get_option_name() );
		$this->assertSame( 'XML sitemap', $this->instance->get_name() );
	}

	/**
	 * Data provider for the boolean outcome tests.
	 *
	 * @return array<string, array<bool>> The outcomes.
	 */
	public static function provide_boolean_outcomes(): array {
		return [
			'true'  => [ true ],
			'false' => [ false ],
		];
	}

	/**
	 * Tests that is_available follows the network-level permission to enable the sitemap.
	 *
	 * @covers ::__construct
	 * @covers ::is_available
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $allowed Whether the network allows enabling the XML sitemap.
	 *
	 * @return void
	 */
	public function test_is_available( bool $allowed ) {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'allow_enable_xml_sitemap', true )
			->andReturn( $allowed );

		$this->assertSame( $allowed, $this->instance->is_available() );
	}
}
