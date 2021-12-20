<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Brain\Monkey;
use Mockery;
use WP_Post;
use Yoast\WP\SEO\Conditionals\Wincher_Conditional;
use Yoast\WP\SEO\Integrations\Third_Party\Wincher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Wincher.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\Wincher
 *
 * @group integrations
 */
class Wincher_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Wincher
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Wincher();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				Wincher_Conditional::class,
			],
			Wincher::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Filters\has( 'wpseo_integration_toggles', [ $this->instance, 'add_integration_toggle' ] ) );
		$this->assertNotFalse( Monkey\Actions\has( 'Yoast\WP\SEO\admin_integration_after', [ $this->instance, 'load_toggle_additional_content' ] ) );
	}

	/**
	 * Tests the add_integration_toggle request function.
	 *
	 * @covers ::add_integration_toggle
	 */
	public function test_add_integration_toggle() {
		$integration_toggles = [
			(object) [
				'name'            => 'Semrush integration',
				'setting'         => 'semrush_integration_active',
				'label'           => 'The Semrush integration offers suggestions and insights for keywords related to the entered focus keyphrase.',
				'order'           => 10,
			],
			(object) [
				'name'            => 'Ryte integration',
				'setting'         => 'ryte_indexability',
				'label'           => 'Ryte will check weekly if your site is still indexable by search engines and Yoast SEO will notify you when this is not the case.',
				'read_more_label' => 'Read more about how Ryte works.',
				'read_more_url'   => 'https://yoa.st/2an',
				'order'           => 15,
			],
		];

		Monkey\Functions\stubTranslationFunctions();

		$result = $this->instance->add_integration_toggle( $integration_toggles );
		$this->assertEquals(
			(object) [
				'name'    => 'Wincher integration',
				'setting' => 'wincher_integration_active',
				'label'   => 'The Wincher integration offers the option to track specific keyphrases and gain insights in their positions.',
				'order'   => 11,
			],
			$result[2]
		);
	}
}
