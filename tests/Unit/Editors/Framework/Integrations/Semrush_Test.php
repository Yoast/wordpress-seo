<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework\Integrations;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Config\SEMrush_Client;
use Yoast\WP\SEO\Editors\Framework\Integrations\Semrush;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Surfaces\Classes_Surface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Semrush_Test
 *
 * @group editors
 *
 * @covers \Yoast\WP\SEO\Editors\Framework\Integrations\Semrush
 */
final class Semrush_Test extends TestCase {

	/**
	 * Holds the classes surface.
	 *
	 * @var Classes_Surface|Mockery\MockInterface
	 */
	public $classes;

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * The Semrush feature.
	 *
	 * @var Semrush
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->options  = Mockery::mock( Options_Helper::class );
		$this->instance = new Semrush( $this->options );
	}

	/**
	 * Tests the is_enabled method.
	 *
	 * @dataProvider data_provider_is_enabled
	 *
	 * @param bool $semrush_enabled If the `semrush_integration_active` option is enabled.
	 * @param bool $expected        The expected outcome.
	 *
	 * @return void
	 */
	public function test_is_enabled(
		bool $semrush_enabled,
		bool $expected
	) {

		$this->options
			->expects( 'get' )
			->with( 'semrush_integration_active', true )
			->andReturn( $semrush_enabled );

		$this->assertSame( $expected, $this->instance->is_enabled() );
	}

	/**
	 * Tests the to_legacy_array method.
	 *
	 * @return void
	 */
	public function test_to_legacy_array() {
		$this->classes  = Mockery::mock( 'Yoast\WP\SEO\Surfaces\Classes_Surface' );
		$semrush_client = Mockery::mock( SEMrush_Client::class );
		$semrush_client->expects( 'get_tokens' );
		$semrush_client->expects( 'has_valid_tokens' )->andReturnTrue();

		$this->classes->expects( 'get' )->with( SEMrush_Client::class )->andReturn( $semrush_client );
		Monkey\Functions\expect( 'YoastSEO' )
			->zeroOrMoreTimes()
			->withNoArgs()
			->andReturn(
				(object) [
					'classes' => $this->classes,
				]
			);
		$this->options
			->expects( 'get' )
			->twice()
			->with( 'semrush_integration_active', true )
			->andReturn( true );

		$this->options
			->expects( 'get' )
			->with( 'semrush_country_code', false )
			->andReturn( true );

		$this->assertSame(
			[
				'semrushIntegrationActive' => true,
				'countryCode'              => true,
				'SEMrushLoginStatus'       => true,
			],
			$this->instance->to_legacy_array()
		);
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array<array<string|bool>>
	 */
	public static function data_provider_is_enabled() {
		return [
			'Enabled ' => [
				'semrush_enabled' => true,
				'expected'        => true,
			],

			'Disabled' => [
				'semrush_enabled' => false,
				'expected'        => false,
			],
		];
	}
}
