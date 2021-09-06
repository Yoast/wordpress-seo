<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\SEMrush;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Wincher\Wincher_Keyphrases_Action;
use Yoast\WP\SEO\Config\Wincher_Client;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Wincher_Keyphrases_Action_Test
 *
 * @group semrush
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Wincher\Wincher_Keyphrases_Action
 */
class Wincher_Keyphrases_Action_Test extends TestCase {

	/**
	 * The class instance.
	 *
	 * @var Wincher_Keyphrases_Action
	 */
	protected $instance;

	/**
	 * The client.
	 *
	 * @var Mockery\MockInterface|Wincher_Client
	 */
	protected $client_instance;

	/**
	 * The Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * The Indexable_Repository instance.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Placeholder for the start date.
	 *
	 * @var string
	 */
	private $start_date;

	/**
	 * Placeholder for the end date.
	 *
	 * @var string
	 */
	private $end_date;


	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->client_instance = Mockery::mock( Wincher_Client::class );
		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->instance        = new Wincher_Keyphrases_Action(
			$this->client_instance,
			$this->options_helper,
			$this->indexable_repository
		);
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Wincher_Client::class,
			$this->getPropertyValue( $this->instance, 'client' )
		);

		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);

		$this->assertInstanceOf(
			Indexable_Repository::class,
			$this->getPropertyValue( $this->instance, 'indexable_repository' )
		);
	}

	/**
	 * Tests tracking of keyphrases.
	 *
	 * @covers ::track_keyphrases
	 */
	public function test_track_keyphrases() {
		$limits = (object) [
			'canTrack' => true,
			'limit'    => 1000,
			'usage'    => 10,
			'status'   => 200,
		];

		$this->options_helper
			->expects( 'get' )
			->with('wincher_website_id')
			->once()
			->andReturns( '12345' );

		$this->client_instance
			->expects( 'post' )
			->once()
			->with(
				'https://api.wincher.com/beta/websites/12345/keywords/bulk',
				\WPSEO_Utils::format_json_encode( [ [ 'keyword' => 'yoast seo', 'groups' => [] ] ] )
			)
			->andReturns(
				[
					'data' => [
						[ 'keyword' => 'yoast seo', 'id' => 12345 ],
					],
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
				'results' => [
					'yoast seo' => [ 'keyword' => 'yoast seo', 'id' => 12345 ],
				],
				'status'  => 200,
			],
			$this->instance->track_keyphrases( [ 'yoast seo' ], $limits )
		);
	}

	/**
	 * Tests tracking of keyphrases where the limit is already reached.
	 *
	 * @covers ::track_keyphrases
	 */
	public function test_track_keyphrases_where_limit_is_reached() {
		$limits = (object) [
			'canTrack' => false,
			'limit'    => 1000,
			'usage'    => 1000,
			'status'   => 200,
		];

		$this->options_helper
			->expects( 'get' )
			->with('wincher_website_id')
			->once()
			->andReturns( '12345' );

		$this->assertEquals(
			(object) [
				'results' => [
					'limit' => 1000,
					'canTrack' => false,
				],
				'error' => 'Account limit exceeded',
				'status'  => 400,
			],
			$this->instance->track_keyphrases( [ 'yoast seo' ], $limits )
		);
	}

	/**
	 * Tests tracking of keyphrases where the limit will be exceeded.
	 *
	 * @covers ::track_keyphrases
	 */
	public function test_track_keyphrases_where_limit_will_be_exceeded() {
		$limits = (object) [
			'canTrack' => true,
			'limit'    => 1000,
			'usage'    => 999,
			'status'   => 200,
		];

		$this->options_helper
			->expects( 'get' )
			->with('wincher_website_id')
			->once()
			->andReturns( '12345' );

		$this->assertEquals(
			(object) [
				'results' => [
					'limit' => 1000,
					'canTrack' => true,
				],
				'error' => 'Account limit exceeded',
				'status'  => 400,
			],
			$this->instance->track_keyphrases( [ 'yoast seo', 'wincher' ], $limits )
		);
	}

	/**
	 * Tests untracking of keyphrases.
	 *
	 * @covers ::untrack_keyphrase
	 */
	public function test_untrack_keyphrase() {
		$this->options_helper
			->expects( 'get' )
			->with('wincher_website_id')
			->once()
			->andReturns( '12345' );

		$this->client_instance
			->expects( 'delete' )
			->once()
			->with( 'https://api.wincher.com/beta/websites/12345/keywords/12345' )
			->andReturns(
				[
					'data' => [],
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
				'results' => [],
				'status'  => 200,
			],
			$this->instance->untrack_keyphrase( 12345 )
		);
	}

	/**
	 * Tests retrieval of tracked keyphrases.
	 *
	 * @covers ::get_tracked_keyphrases
	 */
	public function test_get_tracked_keyphrases() {
		$this->options_helper
			->expects( 'get' )
			->with('wincher_website_id')
			->once()
			->andReturns( '12345' );

		$this->client_instance
			->expects( 'get' )
			->once()
			->with(
				'https://api.wincher.com/beta/websites/12345/keywords',
				[
					'params' => [
						'include_ranking' => 'false',
						]
				]
			)
			->andReturns(
				[
					'data' => [
						[ 'keyword' => 'yoast seo', 'id' => 12345 ],
						[ 'keyword' => 'wincher', 'id' => 12346 ],

					],
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
				'results' => [
					'yoast seo' => [ 'keyword' => 'yoast seo', 'id' => 12345 ],
					'wincher' => [ 'keyword' => 'wincher', 'id' => 12346 ],
				],
				'status'  => 200,
			],
			$this->instance->get_tracked_keyphrases()
		);
	}

	/**
	 * Tests retrieval of keyphrases when there is no data available.
	 *
	 * @covers ::get_tracked_keyphrases
	 */
	public function test_get_tracked_keyphrases_no_data_key() {
		$this->options_helper
			->expects( 'get' )
			->with('wincher_website_id')
			->once()
			->andReturns( '12345' );

		$this->client_instance
			->expects( 'get' )
			->once()
			->with(
				'https://api.wincher.com/beta/websites/12345/keywords',
				[
					'params' => [
						'include_ranking' => 'false',
					]
				]
			)
			->andReturns(
				[
					'some_other_key' => [],
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
				'some_other_key' => [],
				'status'  => 200,
			],
			$this->instance->get_tracked_keyphrases()
		);
	}

	/**
	 * Tests retrieval of tracked keyphrases filtered with the used keyphrases.
	 *
	 * @covers ::get_tracked_keyphrases
	 */
	public function test_get_tracked_keyphrases_filtered_by_used_keyphrases() {
		$this->options_helper
			->expects( 'get' )
			->with('wincher_website_id')
			->once()
			->andReturns( '12345' );

		$this->client_instance
			->expects( 'get' )
			->once()
			->with(
				'https://api.wincher.com/beta/websites/12345/keywords',
				[
					'params' => [
						'include_ranking' => 'false',
					]
				]
			)
			->andReturns(
				[
					'data' => [
						[ 'keyword' => 'yoast seo', 'id' => 12345 ],
						[ 'keyword' => 'wincher', 'id' => 12346 ],

					],
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
				'results' => [
					'yoast seo' => [ 'keyword' => 'yoast seo', 'id' => 12345 ],
				],
				'status'  => 200,
			],
			$this->instance->get_tracked_keyphrases( [ 'yoast seo' ] )
		);
	}

	/**
	 * Tests retrieval of tracked keyphrases including their ranking.
	 *
	 * @covers ::get_tracked_keyphrases
	 */
	public function test_get_tracked_keyphrases_including_ranking() {
		$this->options_helper
			->expects( 'get' )
			->with('wincher_website_id')
			->once()
			->andReturns( '12345' );

		$this->client_instance
			->expects( 'get' )
			->once()
			->with(
				'https://api.wincher.com/beta/websites/12345/keywords',
				[
					'params' => [
						'include_ranking' => 'true',
					]
				]
			)
			->andReturns(
				[
					'data' => [
						[ 'keyword' => 'yoast seo', 'id' => 12345, 'ranking' => [] ],
						[ 'keyword' => 'wincher', 'id' => 12346, 'ranking' => [] ],

					],
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
				'results' => [
					'yoast seo' => [ 'keyword' => 'yoast seo', 'id' => 12345, 'ranking' => [] ],
					'wincher' => [ 'keyword' => 'wincher', 'id' => 12346, 'ranking' => [] ],
				],
				'status'  => 200,
			],
			$this->instance->get_tracked_keyphrases( [], true )
		);
	}

	/**
	 * Tests retrieval of tracked keyphrases chart data.
	 *
	 * @covers ::get_keyphrase_chart_data
	 */
	public function test_get_tracked_keyphrases_chart_data() {
		$this->start_date = \gmdate( 'Y-m-d\T00:00:00\Z', strtotime( '-90 days' ) );
		$this->end_date   = \gmdate( 'Y-m-d\TH:i:s\Z' );

		$this->options_helper
			->expects( 'get' )
			->with('wincher_website_id')
			->once()
			->andReturns( '12345' );

		Monkey\Functions\expect( 'get_site_url' )
			->once()
			->with( null, '/' )
			->andReturn( 'https://yoast.com/' );

		$this->client_instance
			->expects( 'get' )
			->once()
			->with(
				'https://api.wincher.com/beta/int/websites/12345/pages',
				[
					'query' => [
						'start_at' => $this->start_date,
						'end_at' => $this->end_date,
					],
					'timeout' => 60,
				]
			)
			->andReturns(
				[
					'data' => [
						[
							'url' => 'https://yoast.com/',
							'keywords' => [
								[ 'keyword' => 'yoast seo', 'id' => 12345, 'position' => 1 ],
								[ 'keyword' => 'seo expertise', 'id' => 12346, 'position' => 22 ],
							],
						],
						[
							'url' => 'https://yoast.com/blog/',
							'keywords' => [
								[ 'keyword' => 'yoast seo', 'id' => 22345, 'position' => 20 ],
								[ 'keyword' => 'blog seo', 'id' => 22346, 'position' => 22 ],
							],
						],
					],
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
				'results' => [
					'yoast seo' => [ 'keyword' => 'yoast seo', 'id' => 12345, 'position' => 1 ],
					'seo expertise' =>	[ 'keyword' => 'seo expertise', 'id' => 12346, 'position' => 22 ],
				],
				'status'  => 200,
			],
			$this->instance->get_keyphrase_chart_data()
		);
	}

	/**
	 * Tests retrieval of tracked keyphrases chart data filtered by the passed keyphrases.
	 *
	 * @covers ::get_keyphrase_chart_data
	 */
	public function test_get_tracked_keyphrases_chart_data_with_filter() {
		$this->start_date = \gmdate( 'Y-m-d\T00:00:00\Z', strtotime( '-90 days' ) );
		$this->end_date   = \gmdate( 'Y-m-d\TH:i:s\Z' );

		$this->options_helper
			->expects( 'get' )
			->with('wincher_website_id')
			->once()
			->andReturns( '12345' );

		Monkey\Functions\expect( 'get_site_url' )
			->once()
			->with( null, '/' )
			->andReturn( 'https://yoast.com/' );

		$this->client_instance
			->expects( 'get' )
			->once()
			->with(
				'https://api.wincher.com/beta/int/websites/12345/pages',
				[
					'query' => [
						'start_at' => $this->start_date,
						'end_at' => $this->end_date,
					],
					'timeout' => 60,
				]
			)
			->andReturns(
				[
					'data' => [
						[
							'url' => 'https://yoast.com/',
							'keywords' => [
								[ 'keyword' => 'yoast seo', 'id' => 12345, 'position' => 1 ],
								[ 'keyword' => 'seo expertise', 'id' => 12346, 'position' => 22 ],
							],
						],
						[
							'url' => 'https://yoast.com/blog/',
							'keywords' => [
								[ 'keyword' => 'yoast seo', 'id' => 22345, 'position' => 20 ],
								[ 'keyword' => 'blog seo', 'id' => 22346, 'position' => 22 ],
							],
						],
					],
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
				'results' => [
					'seo expertise' =>	[ 'keyword' => 'seo expertise', 'id' => 12346, 'position' => 22 ],
				],
				'status'  => 200,
			],
			$this->instance->get_keyphrase_chart_data( [ 'seo expertise' ] )
		);
	}

	/**
	 * Tests retrieval of tracked keyphrases chart data filtered by the passed permalink.
	 *
	 * @covers ::get_keyphrase_chart_data
	 */
	public function test_get_tracked_keyphrases_chart_data_with_permalink() {
		$this->start_date = \gmdate( 'Y-m-d\T00:00:00\Z', strtotime( '-90 days' ) );
		$this->end_date   = \gmdate( 'Y-m-d\TH:i:s\Z' );

		$this->options_helper
			->expects( 'get' )
			->with('wincher_website_id')
			->once()
			->andReturns( '12345' );

		$this->client_instance
			->expects( 'get' )
			->once()
			->with(
				'https://api.wincher.com/beta/int/websites/12345/pages',
				[
					'query' => [
						'start_at' => $this->start_date,
						'end_at' => $this->end_date,
					],
					'timeout' => 60,
				]
			)
			->andReturns(
				[
					'data' => [
						[
							'url' => 'https://yoast.com/',
							'keywords' => [
								[ 'keyword' => 'yoast seo', 'id' => 12345, 'position' => 1 ],
								[ 'keyword' => 'seo expertise', 'id' => 12346, 'position' => 22 ],
							],
						],
						[
							'url' => 'https://yoast.com/blog/',
							'keywords' => [
								[ 'keyword' => 'yoast seo', 'id' => 22345, 'position' => 20 ],
								[ 'keyword' => 'blog seo', 'id' => 22346, 'position' => 22 ],
							],
						],
					],
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
				'results' => [
					'yoast seo' =>	[ 'keyword' => 'yoast seo', 'id' => 22345, 'position' => 20 ],
					'blog seo' =>	[ 'keyword' => 'blog seo', 'id' => 22346, 'position' => 22 ],
				],
				'status'  => 200,
			],
			$this->instance->get_keyphrase_chart_data( [], 'https://yoast.com/blog/' )
		);
	}

	/**
	 * Tests tracking of all keyphrases.
	 *
	 * @covers ::track_all
	 */
	public function test_track_all_keyphrases() {
		$limits = (object) [
			'canTrack' => true,
			'limit'    => 1000,
			'usage'    => 10,
			'status'   => 200,
		];

		$this->options_helper
			->expects( 'get' )
			->with('wincher_website_id')
			->once()
			->andReturns( '12345' );

		$product_helper_mock = Mockery::mock( Product_Helper::class );
		$product_helper_mock->expects( 'is_premium' )->once()->andReturn( false );
		$helpers_mock = (object) [ 'product' => $product_helper_mock ];

		Monkey\Functions\expect( 'YoastSEO' )->once()->andReturn(
			(object) [
				'helpers' => $helpers_mock,
			]
		);

		$this->indexable_repository
			->expects( 'query->select->where_not_null->find_array' )
			->andReturns(
				[
					[ 'primary_focus_keyword' => 'yoast seo' ],
					[ 'primary_focus_keyword' => 'blog seo' ],
					[ 'primary_focus_keyword' => '' ],
				]
			);

		$this->client_instance->expects( 'post' )->once()->andReturn( [
			'data' => [
				[ 'keyword' => 'yoast seo', 'id' => 12345 ],
				[ 'keyword' => 'blog seo', 'id' => 12346 ],
			],
			'status' => 200,
		] );

		$this->assertEquals(
			(object) [
				'results' => [
					'yoast seo' => [ 'keyword' => 'yoast seo', 'id' => 12345 ],
					'blog seo' => [ 'keyword' => 'blog seo', 'id' => 12346 ],
				],
				'status'  => 200,
			] ,
			$this->instance->track_all( $limits )
		);
	}

	/**
	 * Tests tracking of all keyphrases where the limit will be exceeded.
	 *
	 * @covers ::track_all
	 */
	public function test_track_all_keyphrases_where_limit_will_be_exceeded() {
		$limits = (object) [
			'canTrack' => false,
			'limit'    => 1000,
			'usage'    => 1000,
			'status'   => 200,
		];

		$this->options_helper
			->expects( 'get' )
			->with('wincher_website_id')
			->once()
			->andReturns( '12345' );

		$product_helper_mock = Mockery::mock( Product_Helper::class );
		$product_helper_mock->expects( 'is_premium' )->once()->andReturn( false );
		$helpers_mock = (object) [ 'product' => $product_helper_mock ];

		Monkey\Functions\expect( 'YoastSEO' )->once()->andReturn(
			(object) [
				'helpers' => $helpers_mock,
			]
		);

		$this->indexable_repository
			->expects( 'query->select->where_not_null->find_array' )
			->andReturns(
				[
					[ 'primary_focus_keyword' => 'yoast seo' ],
					[ 'primary_focus_keyword' => 'blog seo' ],
					[ 'primary_focus_keyword' => '' ],
				]
			);

		$this->assertEquals(
			(object) [
				'results' => [
					'limit' => 1000,
					'canTrack' => false,
				],
				'error' => 'Account limit exceeded',
				'status'  => 400,
			],
			$this->instance->track_all( $limits )
		);
	}
}
