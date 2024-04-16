<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework\Integrations;

use Mockery;
use Yoast\WP\SEO\Conditionals\Third_Party\Polylang_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\TranslatePress_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\WPML_Conditional;
use Yoast\WP\SEO\Editors\Framework\Integrations\Multilingual;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Multilingual_Test
 *
 * @group editors
 *
 * @covers \Yoast\WP\SEO\Editors\Framework\Integrations\Multilingual
 */
final class Multilingual_Test extends TestCase {

	/**
	 * Holds the WPML conditional mock.
	 *
	 * @var Mockery\MockInterface|WPML_Conditional
	 */
	protected $wpml_conditional;

	/**
	 *  Holds the Polylang conditional mock.
	 *
	 * @var Mockery\MockInterface|Polylang_Conditional
	 */
	protected $polylang_conditional;

	/**
	 *  Holds the Translate press conditional mock.
	 *
	 * @var Mockery\MockInterface|TranslatePress_Conditional
	 */
	protected $translate_press_conditional;

	/**
	 * The Multilingual feature.
	 *
	 * @var Multilingual
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->wpml_conditional            = Mockery::mock( WPML_Conditional::class );
		$this->polylang_conditional        = Mockery::mock( Polylang_Conditional::class );
		$this->translate_press_conditional = Mockery::mock( TranslatePress_Conditional::class );
		$this->instance                    = new Multilingual( $this->wpml_conditional, $this->polylang_conditional, $this->translate_press_conditional );
	}

	/**
	 * Tests the is_enabled method.
	 *
	 * @dataProvider data_provider_is_enabled
	 *
	 * @param bool $wpml_enabled            If the wpml plugin is enabled.
	 * @param bool $polylang_enabled        If the polylang plugin is enabled.
	 * @param bool $translate_press_enabled If the translate press plugin is enabled.
	 * @param bool $expected                The expected outcome.
	 *
	 * @return void
	 */
	public function test_is_enabled(
		bool $wpml_enabled,
		bool $polylang_enabled,
		bool $translate_press_enabled,
		bool $expected
	) {

		$this->wpml_conditional
			->expects( 'is_met' )
			->times( 3 )
			->andReturn( $wpml_enabled );

		$this->polylang_conditional
			->expects( 'is_met' )
			->times( 3 )
			->andReturn( $polylang_enabled );

		$this->translate_press_conditional
			->expects( 'is_met' )
			->times( 3 )
			->andReturn( $translate_press_enabled );

		$this->assertSame( $expected, $this->instance->is_enabled() );
		$this->assertSame( [ 'multilingualPluginActive' => $this->instance->is_enabled() ], $this->instance->to_legacy_array() );
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array<array<string|bool>>
	 */
	public static function data_provider_is_enabled() {
		return [
			'Enabled by wpml'            => [
				'wpml_enabled'            => true,
				'polylang_enabled'        => false,
				'translate_press_enabled' => false,
				'expected'                => true,
			],
			'Enabled by polylang'        => [
				'wpml_enabled'            => false,
				'polylang_enabled'        => true,
				'translate_press_enabled' => false,
				'expected'                => true,
			],
			'Enabled by translate_press' => [
				'wpml_enabled'            => false,
				'polylang_enabled'        => false,
				'translate_press_enabled' => true,
				'expected'                => true,
			],
			'Disabled'                   => [
				'wpml_enabled'            => false,
				'polylang_enabled'        => false,
				'translate_press_enabled' => false,
				'expected'                => false,
			],
		];
	}
}
