<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\User_Meta\Framework\Custom_Meta;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\User_Meta\Framework\Custom_Meta\Keyword_Analysis_Disable;

/**
 * Class Keyword_Analysis_Disable_Test
 *
 * @group user-meta
 *
 * @coversDefaultClass \Yoast\WP\SEO\User_Meta\Framework\Custom_Meta\Keyword_Analysis_Disable
 */
final class Keyword_Analysis_Disable_Test extends TestCase {

	/**
	 * The Keyword_Analysis_Disable instance.
	 *
	 * @var Keyword_Analysis_Disable
	 */
	private $instance;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->instance       = new Keyword_Analysis_Disable( $this->options_helper );
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
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}

	/**
	 * Tests the getters.
	 *
	 * @covers ::get_key
	 * @covers ::get_field_id
	 * @covers ::get_render_priority
	 *
	 * @return void
	 */
	public function test_getters() {
		$this->assertSame( 'wpseo_keyword_analysis_disable', $this->instance->get_key() );
		$this->assertSame( 'wpseo_keyword_analysis_disable', $this->instance->get_field_id() );
		$this->assertSame( 400, $this->instance->get_render_priority() );
	}

	/**
	 * Tests getting if empty is allowed.
	 *
	 * @covers ::is_empty_allowed
	 *
	 * @return void
	 */
	public function test_is_empty_allowed() {
		$this->assertSame( true, $this->instance->is_empty_allowed() );
	}

	/**
	 * Tests getting if setting is enabled.
	 *
	 * @dataProvider provider_is_setting_enabled
	 * @covers ::is_setting_enabled
	 *
	 * @param bool $keyword_analysis_active Whether the keyword analysis is enabled.
	 *
	 * @return void
	 */
	public function test_is_setting_enabled( $keyword_analysis_active ) {
		$this->options_helper
			->expects( 'get' )
			->with( 'keyword_analysis_active', false )
			->once()
			->andReturn( $keyword_analysis_active );

		$this->assertSame( $keyword_analysis_active, $this->instance->is_setting_enabled() );
	}

	/**
	 * Dataprovider for test_is_setting_enabled.
	 *
	 * @return array<string, array<string, bool>> Data for test_is_setting_enabled.
	 */
	public static function provider_is_setting_enabled() {
		yield 'Keyword analysis is enabled' => [
			'keyword_analysis_active' => true,
		];

		yield 'Keyword analysis is disabled' => [
			'keyword_analysis_active' => false,
		];
	}

	/**
	 * Tests rendering the form field.
	 *
	 * @covers ::render_field
	 * @covers ::get_value
	 *
	 * @return void
	 */
	public function test_render_field() {

		Monkey\Functions\expect( 'get_the_author_meta' )
			->once()
			->with( 'wpseo_keyword_analysis_disable', 1 )
			->andReturn( 'on' );

		Monkey\Functions\expect( 'checked' )
			->once()
			->with( 'on', 'on', false )
			->andReturn( 'checked="checked"' );

		\ob_start();
		$this->instance->render_field( 1 );
		$output = \ob_get_clean();

		$expected_output = '

		<input
			class="yoast-settings__checkbox double"
			type="checkbox"
			id="wpseo_keyword_analysis_disable"
			name="wpseo_keyword_analysis_disable"
			aria-describedby="wpseo_keyword_analysis_disable_desc"
			value="on" checked="checked"/>

		<label class="yoast-label-strong" for="wpseo_keyword_analysis_disable">Disable SEO analysis</label><br>

		<p class="description" id="wpseo_keyword_analysis_disable_desc">Removes the focus keyphrase section from the metabox and disables all SEO-related suggestions.</p>';

		$this->assertSame( $expected_output, $output );
	}
}
