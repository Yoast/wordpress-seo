<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Domain\Seo;

use Yoast\WP\SEO\Editors\Domain\Seo\Keyphrase;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Keyphrase_Test.
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Domain\Seo\Keyphrase
 */
final class Keyphrase_Test extends TestCase {

	/**
	 * The Keyphrase SEO data.
	 *
	 * @var Keyphrase
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$this->instance = new Keyphrase( [ 'post' => 1 ], [ 'post' => 2 ] );
	}

	/**
	 * Tests the to_array method.
	 *
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_to_array(): void {
		$this->assertSame(
			[
				'keyphrase_usage'          => [ 'post' => 1 ],
				'keyphrase_usage_per_type' => [ 'post' => 2 ],
			],
			$this->instance->to_array()
		);
	}

	/**
	 * Tests the to_legacy_method method.
	 *
	 * @covers ::to_legacy_array
	 *
	 * @return void
	 */
	public function test_to_legacy_array(): void {
		$this->assertSame(
			[
				'keyword_usage'            => [ 'post' => 1 ],
				'keyword_usage_post_types' => [ 'post' => 2 ],
			],
			$this->instance->to_legacy_array()
		);
	}
}
