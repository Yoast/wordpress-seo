<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Wincher;

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
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->client_instance      = Mockery::mock( Wincher_Client::class );
		$this->options_helper       = Mockery::mock( Options_Helper::class );
		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->instance             = new Wincher_Keyphrases_Action(
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
			->with( 'wincher_website_id' )
			->once()
			->andReturns( '12345' );

		$this->client_instance
			->expects( 'post' )
			->once()
			->with(
				'https://api.wincher.com/beta/websites/12345/keywords/bulk',
				\WPSEO_Utils::format_json_encode(
					[
						[
							'keyword' => 'yoast seo',
							'groups'  => [],
						],
					]
				)
			)
			->andReturns(
				[
					'data' => [
						[
							'keyword' => 'yoast seo',
							'id'      => 12345,
						],
					],
				]
			);

		$this->assertEquals(
			(object) [
				'results' => [
					'yoast seo' => [
						'keyword' => 'yoast seo',
						'id'      => 12345,
					],
				],
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
			->with( 'wincher_website_id' )
			->once()
			->andReturns( '12345' );

		$this->assertEquals(
			(object) [
				'results' => [
					'limit'    => 1000,
					'canTrack' => false,
				],
				'error'   => 'Account limit exceeded',
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
			->with( 'wincher_website_id' )
			->once()
			->andReturns( '12345' );

		$this->assertEquals(
			(object) [
				'results' => [
					'limit'    => 1000,
					'canTrack' => true,
				],
				'error'   => 'Account limit exceeded',
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
			->with( 'wincher_website_id' )
			->once()
			->andReturns( '12345' );

		$this->client_instance
			->expects( 'delete' )
			->once()
			->with( 'https://api.wincher.com/beta/websites/12345/keywords/12345' )
			->andReturns(
				[
					'data'   => [],
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
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
			->with( 'wincher_website_id' )
			->once()
			->andReturns( '12345' );

		$this->indexable_repository
			->expects( 'query->select->where_not_null->where->where_not_equal->distinct->find_array' )
			->andReturns(
				[
					[ 'primary_focus_keyword' => 'yoast seo' ],
					[ 'primary_focus_keyword' => 'wincher' ],
				]
			);

		$product_helper_mock = Mockery::mock( Product_Helper::class );
		$product_helper_mock->expects( 'is_premium' )->once()->andReturn( false );
		$helpers_mock = (object) [ 'product' => $product_helper_mock ];

		Monkey\Functions\expect( 'YoastSEO' )->once()->andReturn(
			(object) [
				'helpers' => $helpers_mock,
			]
		);

		$this->client_instance
			->expects( 'post' )
			->once()
			->with(
				'https://api.wincher.com/beta/yoast/12345',
				\WPSEO_Utils::format_json_encode(
					[
						'keywords' => [ 'yoast seo', 'wincher' ],
						'url'      => null,
					]
				),
				[
					'timeout' => 60,
				]
			)
			->andReturns(
				[
					'data' => [
						[
							'keyword' => 'yoast seo',
							'id'      => 12345,
						],
						[
							'keyword' => 'wincher',
							'id'      => 12346,
						],

					],
				]
			);

		$this->assertEquals(
			(object) [
				'results' => [
					'yoast seo' => [
						'keyword' => 'yoast seo',
						'id'      => 12345,
					],
					'wincher'   => [
						'keyword' => 'wincher',
						'id'      => 12346,
					],
				],
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
			->with( 'wincher_website_id' )
			->once()
			->andReturns( '12345' );

		$this->client_instance
			->expects( 'post' )
			->once()
			->with(
				'https://api.wincher.com/beta/yoast/12345',
				\WPSEO_Utils::format_json_encode(
					[
						'keywords' => [ 'yoast seo' ],
						'url'      => null,
					]
				),
				[
					'timeout' => 60,
				]
			)
			->andReturns(
				[
					'some_other_key' => [],
				]
			);

		$this->assertEquals(
			(object) [
				'some_other_key' => [],
			],
			$this->instance->get_tracked_keyphrases( [ 'yoast seo' ] )
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
			->with( 'wincher_website_id' )
			->once()
			->andReturns( '12345' );

		$this->client_instance
			->expects( 'post' )
			->once()
			->with(
				'https://api.wincher.com/beta/yoast/12345',
				\WPSEO_Utils::format_json_encode(
					[
						'keywords' => [ 'yoast seo' ],
						'url'      => null,
					]
				),
				[
					'timeout' => 60,
				]
			)
			->andReturns(
				[
					'data' => [
						[
							'keyword' => 'yoast seo',
							'id'      => 12345,
						],
						[
							'keyword' => 'wincher',
							'id'      => 12346,
						],

					],
				]
			);

		$this->assertEquals(
			(object) [
				'results' => [
					'yoast seo' => [
						'keyword' => 'yoast seo',
						'id'      => 12345,
					],
				],
			],
			$this->instance->get_tracked_keyphrases( [ 'yoast seo' ] )
		);
	}

	/**
	 * Tests retrieval of tracked keyphrases chart data filtered by the passed permalink.
	 *
	 * @covers ::get_tracked_keyphrases
	 */
	public function test_get_tracked_keyphrases_with_permalink() {
		$this->options_helper
			->expects( 'get' )
			->with( 'wincher_website_id' )
			->once()
			->andReturns( '12345' );

		$this->client_instance
			->expects( 'post' )
			->once()
			->with(
				'https://api.wincher.com/beta/yoast/12345',
				\WPSEO_Utils::format_json_encode(
					[
						'keywords' => [ 'yoast seo', 'blog seo' ],
						'url'      => 'https://yoast.com/blog/',
					]
				),
				[
					'timeout' => 60,
				]
			)
			->andReturns(
				[
					'data' => [
						[
							'keyword'  => 'yoast seo',
							'id'       => 22345,
							'position' => 20,
						],
						[
							'keyword'  => 'blog seo',
							'id'       => 22346,
							'position' => 22,
						],
					],
				]
			);

		$this->assertEquals(
			(object) [
				'results' => [
					'yoast seo' => [
						'keyword'  => 'yoast seo',
						'id'       => 22345,
						'position' => 20,
					],
					'blog seo'  => [
						'keyword'  => 'blog seo',
						'id'       => 22346,
						'position' => 22,
					],
				],
			],
			$this->instance->get_tracked_keyphrases( [ 'yoast seo', 'blog seo' ], 'https://yoast.com/blog/' )
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
			->with( 'wincher_website_id' )
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
			->expects( 'query->select->where_not_null->where->where_not_equal->distinct->find_array' )
			->andReturns(
				[
					[ 'primary_focus_keyword' => 'yoast seo' ],
					[ 'primary_focus_keyword' => 'blog seo' ],
					[ 'primary_focus_keyword' => '' ],
				]
			);

		$this->client_instance->expects( 'post' )->once()->andReturn(
			[
				'data' => [
					[
						'keyword' => 'yoast seo',
						'id'      => 12345,
					],
					[
						'keyword' => 'blog seo',
						'id'      => 12346,
					],
				],
			]
		);

		$this->assertEquals(
			(object) [
				'results' => [
					'yoast seo' => [
						'keyword' => 'yoast seo',
						'id'      => 12345,
					],
					'blog seo'  => [
						'keyword' => 'blog seo',
						'id'      => 12346,
					],
				],
			],
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
			->with( 'wincher_website_id' )
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
			->expects( 'query->select->where_not_null->where->where_not_equal->distinct->find_array' )
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
					'limit'    => 1000,
					'canTrack' => false,
				],
				'error'   => 'Account limit exceeded',
				'status'  => 400,
			],
			$this->instance->track_all( $limits )
		);
	}
}
