<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Features;

use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Features\Schema_Framework_Feature;
use Yoast\WP\SEO\Schema\Application\Configuration\Schema_Configuration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Schema_Framework_Feature class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Features\Schema_Framework_Feature
 */
final class Schema_Framework_Feature_Test extends TestCase {

	/**
	 * The Schema configuration mock.
	 *
	 * @var Mockery\MockInterface|Schema_Configuration
	 */
	private $schema_configuration;

	/**
	 * The instance under test.
	 *
	 * @var Schema_Framework_Feature
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->schema_configuration = Mockery::mock( Schema_Configuration::class );

		$this->instance = new Schema_Framework_Feature( $this->schema_configuration );
	}

	/**
	 * Tests that the getters describe the feature.
	 *
	 * @covers ::__construct
	 * @covers ::get_key
	 * @covers ::get_option_name
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_getters() {
		$this->assertSame( 'schema_framework', $this->instance->get_key() );
		$this->assertSame( 'enable_schema', $this->instance->get_option_name() );
		$this->assertSame( 'Schema Framework', $this->instance->get_name() );
	}

	/**
	 * Tests that is_available always returns true, as the feature can be changed on every site.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Features\Abstract_Feature::is_available
	 *
	 * @return void
	 */
	public function test_is_available() {
		$this->assertTrue( $this->instance->is_available() );
	}

	/**
	 * Tests that is_disabled_programmatically returns whether the `wpseo_json_ld_output` filter turns Schema off.
	 *
	 * @covers ::is_disabled_programmatically
	 *
	 * @dataProvider provide_is_disabled_programmatically_cases
	 *
	 * @param bool $disabled Whether the filter turns Schema off.
	 *
	 * @return void
	 */
	public function test_is_disabled_programmatically( bool $disabled ) {
		$this->schema_configuration->expects( 'is_schema_disabled_programmatically' )->once()->andReturn( $disabled );

		$this->assertSame( $disabled, $this->instance->is_disabled_programmatically() );
	}

	/**
	 * Provides the cases for test_is_disabled_programmatically.
	 *
	 * @return array<string, array<string, bool>>
	 */
	public static function provide_is_disabled_programmatically_cases() {
		return [
			'Disabled by the filter'     => [ 'disabled' => true ],
			'Not disabled by the filter' => [ 'disabled' => false ],
		];
	}
}
