<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Domain\Seo;

use Yoast\WP\SEO\Editors\Domain\Seo\Social;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Social_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Domain\Seo\Social
 */
final class Social_Test extends TestCase {

	/**
	 * The Social.
	 *
	 * @var Social
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$this->instance = new Social( 'social-title-template', 'social-description-template', 'social-image-template', 'https://wordpress.test/image.png' );
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
				'social_title_template'              => 'social-title-template',
				'social_description_template'        => 'social-description-template',
				'social_image_template'              => 'social-image-template',
				'first_content_image_social_preview' => 'https://wordpress.test/image.png',
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
				'social_title_template'              => 'social-title-template',
				'social_description_template'        => 'social-description-template',
				'social_image_template'              => 'social-image-template',
				'first_content_image'                => 'https://wordpress.test/image.png',
			],
			$this->instance->to_legacy_array()
		);
	}
}
