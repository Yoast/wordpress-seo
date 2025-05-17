<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\User_Meta\Framework\Additional_Contactmethods;

use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\User_Meta\Framework\Additional_Contactmethods\Instagram;

/**
 * Class Instagram_Test
 *
 * @group user-meta
 *
 * @coversDefaultClass \Yoast\WP\SEO\User_Meta\Framework\Additional_Contactmethods\Instagram
 */
final class Instagram_Test extends TestCase {

	/**
	 * The Instagram instance.
	 *
	 * @var Instagram
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$this->instance = new Instagram();
	}

	/**
	 * Tests the getters.
	 *
	 * @covers ::get_key
	 * @covers ::get_label
	 *
	 * @return void
	 */
	public function test_getters() {
		$this->stubTranslationFunctions();

		$this->assertSame( 'instagram', $this->instance->get_key() );
		$this->assertSame( 'Instagram profile URL', $this->instance->get_label() );
	}
}
