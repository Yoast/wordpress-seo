<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\SEMrush;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\SEMrush\SEMrush_Phrases_Action;
use Yoast\WP\SEO\Config\SEMrush_Client;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class SEMrush_Phrases_Action_Test
 *
 * @group semrush
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\SEMrush\SEMrush_Phrases_Action
 */
final class SEMrush_Phrases_Action_Test extends TestCase {

	/**
	 * The class instance.
	 *
	 * @var SEMrush_Phrases_Action
	 */
	protected $instance;

	/**
	 * The client.
	 *
	 * @var Mockery\MockInterface|SEMrush_Client
	 */
	protected $client_instance;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->client_instance = Mockery::mock( SEMrush_Client::class );
		$this->instance        = new SEMrush_Phrases_Action( $this->client_instance );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			SEMrush_Client::class,
			$this->getPropertyValue( $this->instance, 'client' )
		);
	}

	/**
	 * Tests getting related keyphrases via an API call to SEMrush.
	 *
	 * @covers ::get_related_keyphrases
	 *
	 * @return void
	 */
	public function test_get_related_keyphrases_from_api() {
		$keyphrase    = 'seo';
		$country_code = 'us';

		Monkey\Functions\expect( 'get_transient' )
			->times( 1 )
			->with( 'wpseo_semrush_related_keyphrases_' . $keyphrase . '_' . $country_code )
			->andReturn( false );

		$options = [
			'params' => [
				'phrase'         => $keyphrase,
				'database'       => $country_code,
				'export_columns' => 'Ph,Nq,Td,In,Kd',
				'display_limit'  => 10,
				'display_offset' => 0,
				'display_sort'   => 'nq_desc',
				'display_filter' => '%2B|Nq|Lt|1000',
			],
		];

		$return_data = [
			'data'   => [
				'column_names' => [],
				'rows'         => [],
			],
			'status' => 200,
		];

		$this->client_instance
			->expects( 'get' )
			->with( SEMrush_Phrases_Action::KEYPHRASES_URL, $options )
			->andReturn( $return_data );

		Monkey\Functions\expect( 'set_transient' )
			->times( 1 )
			->with( 'wpseo_semrush_related_keyphrases_' . $keyphrase . '_' . $country_code, $return_data, \DAY_IN_SECONDS );

		$this->assertEquals(
			(object) [
				'results' => [
					'column_names' => [],
					'rows'         => [],
				],
				'status'  => 200,
			],
			$this->instance->get_related_keyphrases( $keyphrase, $country_code )
		);
	}

	/**
	 * Tests a valid related keyphrases retrieval from cache.
	 *
	 * @covers ::get_related_keyphrases
	 *
	 * @return void
	 */
	public function test_get_related_keyphrases_from_cache() {
		$keyphrase = 'seo';
		$database  = 'us';

		Monkey\Functions\expect( 'get_transient' )
			->times( 1 )
			->with( 'wpseo_semrush_related_keyphrases_' . $keyphrase . '_' . $database )
			->andReturn(
				[
					'data'   => [
						'columnNames' => [ 'Ph', 'Nq', 'Td', 'In', 'Kd' ],
						'rows'        => [],
					],
					'status' => 200,
				]
			);

		$this->client_instance->expects( 'get' )->times( 0 );

		Monkey\Functions\expect( 'set_transient' )->times( 0 );

		$this->assertEquals(
			(object) [
				'results' => [
					'columnNames' => [ 'Ph', 'Nq', 'Td', 'In', 'Kd' ],
					'rows'        => [],
				],
				'status'  => 200,
			],
			$this->instance->get_related_keyphrases( $keyphrase, $database )
		);
	}
}
