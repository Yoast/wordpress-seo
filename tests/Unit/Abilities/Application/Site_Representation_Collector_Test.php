<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Mockery;
use Yoast\WP\SEO\Abilities\Application\Site_Representation_Collector;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Site_Representation_Collector class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Site_Representation_Collector
 */
final class Site_Representation_Collector_Test extends TestCase {

	/**
	 * The site representation field map mock.
	 *
	 * @var Mockery\MockInterface|Site_Representation_Field_Map
	 */
	private $field_map;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The instance under test.
	 *
	 * @var Site_Representation_Collector
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->field_map      = Mockery::mock( Site_Representation_Field_Map::class );
		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->instance = new Site_Representation_Collector( $this->field_map, $this->options_helper );
	}

	/**
	 * Tests that get returns the stored value of each field, cast to the type its schema declares.
	 *
	 * @covers ::__construct
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get() {
		$this->field_map->expects( 'get_fields' )->once()->andReturn(
			[
				'company_or_person'         => [ 'type' => 'string' ],
				'company_name'              => [ 'type' => 'string' ],
				'company_or_person_user_id' => [ 'type' => 'integer' ],
				'other_social_urls'         => [ 'type' => 'array' ],
			],
		);
		$this->options_helper->expects( 'get' )->once()->with( 'company_or_person' )->andReturn( 'person' );
		$this->options_helper->expects( 'get' )->once()->with( 'company_name' )->andReturnNull();
		$this->options_helper->expects( 'get' )->once()->with( 'company_or_person_user_id' )->andReturnFalse();
		$this->options_helper->expects( 'get' )->once()->with( 'other_social_urls' )->andReturn( [ 'https://example.com/yoast' ] );

		$this->assertSame(
			[
				'company_or_person'         => 'person',
				'company_name'              => '',
				'company_or_person_user_id' => 0,
				'other_social_urls'         => [ 'https://example.com/yoast' ],
			],
			$this->instance->get(),
		);
	}
}
