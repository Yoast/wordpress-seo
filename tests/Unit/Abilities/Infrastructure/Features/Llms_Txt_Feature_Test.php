<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Features;

use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Features\Llms_Txt_Feature;
use Yoast\WP\SEO\Conditionals\Non_Multisite_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Llms_Txt_Feature class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Features\Llms_Txt_Feature
 */
final class Llms_Txt_Feature_Test extends TestCase {

	/**
	 * The non-multisite conditional mock.
	 *
	 * @var Mockery\MockInterface|Non_Multisite_Conditional
	 */
	private $non_multisite_conditional;

	/**
	 * The instance under test.
	 *
	 * @var Llms_Txt_Feature
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->non_multisite_conditional = Mockery::mock( Non_Multisite_Conditional::class );

		$this->instance = new Llms_Txt_Feature( $this->non_multisite_conditional );
	}

	/**
	 * Tests that the getters describe the feature.
	 *
	 * @covers ::get_key
	 * @covers ::get_option_name
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_getters() {
		$this->assertSame( 'llms_txt', $this->instance->get_key() );
		$this->assertSame( 'enable_llms_txt', $this->instance->get_option_name() );
		$this->assertSame( 'llms.txt', $this->instance->get_name() );
	}

	/**
	 * Data provider for the boolean outcome tests.
	 *
	 * @return array<string, array<bool>> The outcomes.
	 */
	public static function provide_boolean_outcomes(): array {
		return [
			'true'  => [ true ],
			'false' => [ false ],
		];
	}

	/**
	 * Tests that is_available follows the non-multisite conditional.
	 *
	 * @covers ::__construct
	 * @covers ::is_available
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $is_met Whether the site is not a multisite.
	 *
	 * @return void
	 */
	public function test_is_available( bool $is_met ) {
		$this->non_multisite_conditional->expects( 'is_met' )->once()->andReturn( $is_met );

		$this->assertSame( $is_met, $this->instance->is_available() );
	}
}
