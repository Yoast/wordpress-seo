<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\User_Meta\Framework\Custom_Meta;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\User_Meta\Framework\Custom_Meta\Author_Title;

/**
 * Class Author_Title_Test
 *
 * @group user-meta
 *
 * @coversDefaultClass \Yoast\WP\SEO\User_Meta\Framework\Custom_Meta\Author_Title
 */
final class Author_Title_Test extends TestCase {

	/**
	 * The Author_Title instance.
	 *
	 * @var Author_Title
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
		$this->instance       = new Author_Title( $this->options_helper );
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
		$this->assertSame( 'wpseo_title', $this->instance->get_key() );
		$this->assertSame( 'wpseo_author_title', $this->instance->get_field_id() );
		$this->assertSame( 100, $this->instance->get_render_priority() );
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
	 * @param bool $author_disabled Whether the author is disabled.
	 *
	 * @return void
	 */
	public function test_is_setting_enabled( $author_disabled ) {
		$this->options_helper
			->expects( 'get' )
			->with( 'disable-author' )
			->once()
			->andReturn( $author_disabled );

		$this->assertSame( ! $author_disabled, $this->instance->is_setting_enabled() );
	}

	/**
	 * Dataprovider for test_is_setting_enabled.
	 *
	 * @return array<string, array<string, bool>> Data for test_is_setting_enabled.
	 */
	public static function provider_is_setting_enabled() {
		yield 'Author archives are disabled' => [
			'author_disabled' => true,
		];

		yield 'Author archives are not disabled' => [
			'author_disabled' => false,
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
			->with( 'wpseo_title', 1 )
			->andReturn( 'title' );

		\ob_start();
		$this->instance->render_field( 1 );
		$output = \ob_get_clean();

		$expected_output = '

		<label for="wpseo_author_title">Title to use for Author page</label>

		<input
			class="yoast-settings__text regular-text"
			type="text" id="wpseo_author_title"
			name="wpseo_author_title"
			value="title"/><br>';

		$this->assertSame( $expected_output, $output );
	}
}
