<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Mockery;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Services\Health_Check\Curl_Reports;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Curl_Reports
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Curl_Reports
 */
class Curl_Reports_Test extends TestCase {

	/**
	 * The Curl_Reports instance to be tested.
	 *
	 * @var Curl_Reports
	 */
	private $instance;

	/**
	 * A mocked Report_Builder object.
	 *
	 * @var Report_Builder
	 */
	private $report_builder_mock;

	/**
	 * A mock for WPSEO_Shortlinker used to mock its static get() method.
	 *
	 * @var WPSEO_Shortlinker
	 */
	private $shortlinker_mock;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$report_builder_factory_mock = Mockery::mock( Report_Builder_Factory::class );
		$this->report_builder_mock   = Mockery::mock( Report_Builder::class );
		$this->shortlinker_mock      = Mockery::mock( WPSEO_Shortlinker::class );
		$report_builder_factory_mock->shouldReceive( 'create' )->andReturn( $this->report_builder_mock );

		// Incorrectly detects direct calls to cURL.
		// phpcs:ignore
		$this->instance = new Curl_Reports( $report_builder_factory_mock, $this->shortlinker_mock );
	}

	/**
	 * Checks if the instance sets the identifier correctly on the Report_Builder.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::set_test_identifier
	 */
	public function test_sets_identifier_correctly() {
		$expected_test_identifier = 'identifier';
		$this->report_builder_mock
			->shouldReceive( 'set_test_identifier' )
			->once()
			->with( $expected_test_identifier );
		$this->instance->set_test_identifier( $expected_test_identifier );
	}

	/**
	 * Checks if the instance builds the correct success report.
	 *
	 * @return void
	 * @covers ::get_success_result
	 */
	public function test_get_success_result() {
		$expected_result      = [ 'correct' ];
		$expected_label       = 'Yoast premium plugin updates work fine';
		$expected_description = 'Great! You can activate your premium plugin(s) and receive updates.';

		$this->report_builder_mock
			->shouldReceive( 'set_label' )
			->once()
			->with( $expected_label )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_description' )
			->once()
			->with( $expected_description )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_status_good' )
			->once()
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'build' )
			->once()
			->andReturn( $expected_result );

		$actual_result = $this->instance->get_success_result();

		$this->assertEquals( $expected_result, $actual_result );
	}

	/**
	 * Checks if the instance builds the correct report for when the MyYoast API is not reachable.
	 *
	 * @return void
	 * @covers ::get_my_yoast_api_not_reachable_result
	 * @covers ::get_my_yoast_api_not_reachable_description
	 */
	public function test_get_my_yoast_api_not_reachable_result() {
		$expected_result      = [ 'correct' ];
		$expected_label       = 'Yoast premium plugins cannot update';
		$expected_description = 'You can <em>not</em> activate your premium plugin(s) and receive updates because Yoast SEO cannot connect to my.yoast.com. A common cause for not being able to connect is an out-of-date version of cURL, software used to connect to other servers. However, your cURL version seems fine. Please talk to your host and, if needed, the Yoast support team to figure out what is broken. <a href="link" target="_blank">Read more about cURL in our help center<span class="screen-reader-text">(Opens in a new browser tab)</span></a>.';

		$this->shortlinker_mock
			->shouldReceive( 'get' )
			->once()
			->andReturn( 'link' );
		$this->report_builder_mock
			->shouldReceive( 'set_label' )
			->once()
			->with( $expected_label )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_description' )
			->once()
			->with( $expected_description )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_status_critical' )
			->once()
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'build' )
			->once()
			->andReturn( $expected_result );

		$actual_result = $this->instance->get_my_yoast_api_not_reachable_result();

		$this->assertEquals( $expected_result, $actual_result );
	}

	/**
	 * Checks if the instance builds the correct report for when there's no recent version of cURL installed.
	 *
	 * @return void
	 * @covers ::get_no_recent_curl_version_installed_result
	 * @covers ::get_no_recent_curl_version_installed_description
	 */
	public function test_get_no_recent_curl_version_installed_result() {
		$expected_result      = [ 'correct' ];
		$expected_label       = 'Yoast premium plugins cannot update';
		$expected_description = 'You can <em>not</em> activate your premium plugin(s) and receive updates because Yoast SEO cannot connect to my.yoast.com. The cause for this error is probably that the cURL software on your server is too old. Please contact your host and ask them to update it to at least version 7.34. <a href="" target="_blank">Read more about cURL in our help center<span class="screen-reader-text">(Opens in a new browser tab)</span></a>.';

		$this->shortlinker_mock
			->shouldReceive( 'get' )
			->once();
		$this->report_builder_mock
			->shouldReceive( 'set_label' )
			->once()
			->with( $expected_label )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_description' )
			->once()
			->with( $expected_description )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_status_critical' )
			->once()
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'build' )
			->once()
			->andReturn( $expected_result );

		$actual_result = $this->instance->get_no_recent_curl_version_installed_result();

		$this->assertEquals( $expected_result, $actual_result );
	}
}
