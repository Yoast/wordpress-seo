<?php

namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Editors\Framework\Previously_Used_Keyphrase;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Previously_Used_Keyphrase_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Framework\Previously_Used_Keyphrase
 */
final class Previously_Used_Keyphrase_Test extends TestCase {

	/**
	 * The Content_Analysis.
	 *
	 * @var Previously_Used_Keyphrase
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();

		$this->instance = new Previously_Used_Keyphrase();
	}

	/**
	 * Tests the getters.
	 *
	 * @covers ::get_name
	 * @covers ::get_legacy_key
	 *
	 * @return void
	 */
	public function test_getters(): void {
		$this->assertSame( 'previouslyUsedKeyphrase', $this->instance->get_name() );
		$this->assertSame( 'previouslyUsedKeywordActive', $this->instance->get_legacy_key() );
	}

	/**
	 * Tests the is_enabled method.
	 *
	 * @covers ::is_enabled
	 *
	 * @dataProvider data_provider_is_enabled
	 *
	 * @param bool $enable_previously_used_keyphrase Return value of the `wpseo_previously_used_keyword_active` filter.
	 * @param bool $expected                         The expected outcome.
	 *
	 * @return void
	 */
	public function test_is_enabled( bool $enable_previously_used_keyphrase, bool $expected ) {
		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_previously_used_keyword_active', true )
			->andReturn( $enable_previously_used_keyphrase );
		$this->assertSame( $expected, $this->instance->is_enabled() );
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array<array<string|bool>>
	 */
	public static function data_provider_is_enabled(): array {
		return [
			'Enabled'  => [
				'enable_previously_used_keyphrase' => true,
				'expected'                         => true,
			],
			'Disabled' => [
				'enable_previously_used_keyphrase' => false,
				'expected'                         => false,
			],
		];
	}
}
