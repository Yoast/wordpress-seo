<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Configuration;

use Brain\Monkey\Functions;
use Generator;

/**
 * Test class getting the configuration.
 *
 * @group Llms_Txt_Configuration
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\Configuration\Llms_Txt_Configuration::get_configuration
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Llms_Txt_Configuration_Get_Configuration_Test extends Abstract_Llms_Txt_Configuration_Test {

	/**
	 * Tests getting the configuration.
	 *
	 * @dataProvider get_configuration_data
	 *
	 * @param bool                                  $is_runner_successful       Whether the runner is successful.
	 * @param string                                $generation_failure_reason  The reason for generation failure.
	 * @param string                                $home_url                   The home URL.
	 * @param bool                                  $is_of_indexable_post_type  Whether the post type is indexable.
	 * @param int                                   $other_included_pages_limit The limit for other included pages.
	 * @param array<string, array<string|int|bool>> $expected                   The expected configuration.
	 *
	 * @return void
	 */
	public function test_get_configuration(
		$is_runner_successful,
		$generation_failure_reason,
		$home_url,
		$is_of_indexable_post_type,
		$other_included_pages_limit,
		$expected
	) {
		$this->runner
			->expects( 'run' )
			->once();

		$this->runner
			->expects( 'is_successful' )
			->once()
			->andReturn( $is_runner_successful );

		$this->runner
			->expects( 'get_generation_failure_reason' )
			->once()
			->andReturn( $generation_failure_reason );

		Functions\expect( 'home_url' )
			->once()
			->andReturn( $home_url );

		$this->post_type_helper
			->expects( 'is_of_indexable_post_type' )
			->once()
			->with( 'page' )
			->andReturn( $is_of_indexable_post_type );

		$this->options_helper
			->expects( 'get_other_included_pages_limit' )
			->once()
			->andReturn( $other_included_pages_limit );

		$this->assertEquals( $expected, $this->instance->get_configuration() );
	}

	/**
	 * Data provider for the get_configuration test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function get_configuration_data() {
		yield 'No generation failure' => [
			'is_runner_successful'       => true,
			'generation_failure_reason'  => '',
			'home_url'                   => 'https://example.com',
			'is_of_indexable_post_type'  => true,
			'other_included_pages_limit' => 10,
			'expected'                   => [
				'generationFailure'       => false,
				'generationFailureReason' => '',
				'llmsTxtUrl'              => 'https://example.com',
				'disabledPageIndexables'  => false,
				'otherIncludedPagesLimit' => 10, // Assuming default limit.
			],
		];
		yield 'Generation failure' => [
			'is_runner_successful'       => false,
			'generation_failure_reason'  => 'some_failure_reason',
			'home_url'                   => 'https://example2.com',
			'is_of_indexable_post_type'  => false,
			'other_included_pages_limit' => 5,
			'expected'                   => [
				'generationFailure'       => true,
				'generationFailureReason' => 'some_failure_reason',
				'llmsTxtUrl'              => 'https://example2.com',
				'disabledPageIndexables'  => true,
				'otherIncludedPagesLimit' => 5, // Assuming default limit.
			],
		];
	}
}
