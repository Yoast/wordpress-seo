<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Brain\Monkey;
use Yoast\WP\SEO\Presenters\Admin\Search_Engines_Discouraged_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Search_Engines_Discouraged_Presenter_Test.
 *
 * @covers \Yoast\WP\SEO\Presenters\Admin\Search_Engines_Discouraged_Presenter
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Search_Engines_Discouraged_Presenter
 *
 * @group presenters
 */
final class Search_Engines_Discouraged_Presenter_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Search_Engines_Discouraged_Presenter
	 */
	protected $instance;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
		$this->instance = new Search_Engines_Discouraged_Presenter();
	}

	/**
	 * Tests returning the notification as an HTML string.
	 *
	 * @covers ::present
	 * @covers ::get_message
	 *
	 * @return void
	 */
	public function test_present() {
		Monkey\Functions\expect( 'admin_url' )
			->with( 'options-reading.php' )
			->andReturn( 'http://basic.wordpress.test/wp-admin/options-reading.php' );

		Monkey\Functions\expect( 'esc_url' )
			->with( 'http://basic.wordpress.test/wp-admin/options-reading.php' )
			->andReturn( 'http://basic.wordpress.test/wp-admin/options-reading.php' );

		Monkey\Functions\expect( 'wp_create_nonce' )
			->with( 'wpseo-ignore' )
			->once()
			->andReturn( 'this-is-a-random-nonce' );

		Monkey\Functions\expect( 'esc_js' )
			->with( 'this-is-a-random-nonce' )
			->once()
			->andReturn( 'this-is-a-random-nonce' );

		$expected = '<p><strong>Huge SEO Issue: You\'re blocking access to robots.</strong> If you want search engines to show this site in their results, you must <a href="http://basic.wordpress.test/wp-admin/options-reading.php">go to your Reading Settings</a> and uncheck the box for Search Engine Visibility. <button type="button" id="robotsmessage-dismiss-button" class="button-link hide-if-no-js" data-nonce="this-is-a-random-nonce">I don\'t want this site to show in the search results.</button></p>';

		$this->assertSame( $expected, $this->instance->present() );
	}
}
