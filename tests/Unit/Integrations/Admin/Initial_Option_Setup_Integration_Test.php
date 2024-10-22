<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Initial_Option_Setup_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Initial_Option_Setup_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Initial_Option_Setup_Integration
 */
final class Initial_Option_Setup_Integration_Test extends TestCase {

	/**
	 * The initial option setup under test.
	 *
	 * @var Initial_Option_Setup_Integration
	 */
	protected $instance;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->instance = new Initial_Option_Setup_Integration( $this->options_helper );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Options_Helper::class,
			self::getPropertyValue( $this->instance, 'options_helper' )
		);
	}

	/**
	 * Tests the get_conditionals method.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$actual   = Initial_Option_Setup_Integration::get_conditionals();
		$expected = [
			Admin_Conditional::class,
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the register hooks method.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'admin_init' );

		$this->instance->register_hooks();
	}

	/**
	 * Tests maybe translating defaults.
	 *
	 * @dataProvider provider_maybe_translate_defaults
	 * @covers ::maybe_translate_defaults
	 * @covers ::replace_defaults_with_translations
	 * @covers ::replace_enriched_defaults_with_translations
	 *
	 * @param bool $set_up_options                                  Whether options are set up.
	 * @param int  $times_setting_set_up_options                    The number of times the set_up_options option is set.
	 * @param array<string, string> $translated_default_titles      The translated default titles.
	 * @param array<string, string> $untranslated_default_titles    The untranslated default titles.
	 * @param array<string, string> $translated_enriched_defaults   The translated enriched defaults.
	 * @param array<string, string> $untranslated_enriched_defaults The untranslated enriched defaults.
	 * @param array<string> $current_setting_values                 The current setting values.
	 * @param int $translate_times                                  The number of times the set method is called.
	 *
	 * @return void
	 */
	public function test_maybe_translate_defaults( $set_up_options, $times_setting_set_up_options, $translated_default_titles, $untranslated_default_titles, $translated_enriched_defaults, $untranslated_enriched_defaults, $current_setting_values, $translate_times ) {
		$this->options_helper
			->expects( 'get' )
			->with( 'set_up_options', false )
			->once()
			->andReturn( $set_up_options );

		$this->options_helper
			->expects( 'set' )
			->with( 'set_up_options', true )
			->times( $times_setting_set_up_options );

		$this->options_helper
			->expects( 'get_maybe_translated_default_titles' )
			->with( true )
			->times( $times_setting_set_up_options )
			->andReturn( $translated_default_titles );

		$this->options_helper
			->expects( 'get_maybe_translated_default_titles' )
			->with( false )
			->times( $times_setting_set_up_options )
			->andReturn( $untranslated_default_titles );

		$this->options_helper
			->expects( 'get_maybe_translated_enriched_defaults' )
			->with( true )
			->times( $times_setting_set_up_options )
			->andReturn( $translated_enriched_defaults );

		$this->options_helper
			->expects( 'get_maybe_translated_enriched_defaults' )
			->with( false )
			->times( $times_setting_set_up_options )
			->andReturn( $untranslated_enriched_defaults );

		$this->options_helper
			->expects( 'get' )
			->times( \count( \array_merge( $translated_default_titles, $translated_enriched_defaults ) ) )
			->andReturn( ...$current_setting_values );

		$this->options_helper
			->expects( 'set' )
			->times( $translate_times );

		$this->instance->maybe_translate_defaults();
	}

	/**
	 * Data provider for test_maybe_translate_defaults.
	 *
	 * @return array<string, array<string, bool|int|array<string, string>>
	 */
	public static function provider_maybe_translate_defaults() {
		yield 'Already set up options' => [
			'set_up_options'                 => true,
			'times_setting_set_up_options'   => 0,
			'translated_default_titles'      => [],
			'untranslated_default_titles'    => [],
			'translated_enriched_defaults'   => [],
			'untranslated_enriched_defaults' => [],
			'current_setting_values'         => [],
			'translate_times'                => 0,
		];
		yield 'No changed defaults and enriched defaults, to be replaced with translations' => [
			'set_up_options'                 => false,
			'times_setting_set_up_options'   => 1,
			'translated_default_titles'      => [
				'breadcrumbs-404crumb'      => 'Lorem 404: Ipsum',
				'breadcrumbs-archiveprefix' => 'Ipsum for',
			],
			'untranslated_default_titles'    => [
				'breadcrumbs-404crumb'      => 'Error 404: Page not found',
				'breadcrumbs-archiveprefix' => 'Archives for',
			],
			'translated_enriched_defaults'   => [
				'title-tax-category'      => '%%term_title%% Lorem %%page%% %%sep%% %%sitename%%',
				'title-tax-post_format' => '%%term_title%% Lorem %%page%% %%sep%% %%sitename%%',
			],
			'untranslated_enriched_defaults' => [
				'title-tax-category'      => '%%term_title%% Archives %%page%% %%sep%% %%sitename%%',
				'title-tax-post_format' => '%%term_title%% Archives %%page%% %%sep%% %%sitename%%',
			],
			'current_setting_values'         => [
				'Error 404: Page not found',
				'Archives for',
				'%%term_title%% Archives %%page%% %%sep%% %%sitename%%',
				'%%term_title%% Archives %%page%% %%sep%% %%sitename%%',
			],
			'translate_times'                => 4,
		];
		yield 'All defaults and enriched defaults are change, to not be replaced with translations' => [
			'set_up_options'                 => false,
			'times_setting_set_up_options'   => 1,
			'translated_default_titles'      => [
				'breadcrumbs-404crumb'      => 'Lorem 404: Ipsum',
				'breadcrumbs-archiveprefix' => 'Ipsum for',
			],
			'untranslated_default_titles'    => [
				'breadcrumbs-404crumb'      => 'Error 404: Page not found',
				'breadcrumbs-archiveprefix' => 'Archives for',
			],
			'translated_enriched_defaults'   => [
				'title-tax-category'      => '%%term_title%% Lorem %%page%% %%sep%% %%sitename%%',
				'title-tax-post_format' => '%%term_title%% Lorem %%page%% %%sep%% %%sitename%%',
			],
			'untranslated_enriched_defaults' => [
				'title-tax-category'      => '%%term_title%% Archives %%page%% %%sep%% %%sitename%%',
				'title-tax-post_format' => '%%term_title%% Archives %%page%% %%sep%% %%sitename%%',
			],
			'current_setting_values'         => [
				'Custom error page',
				'Custom archive page',
				'Custom archive for category',
				'Custom archive for post gormat',
			],
			'translate_times'                => 0,
		];
	}
}
