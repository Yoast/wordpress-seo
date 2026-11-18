<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Health_Check;

/**
 * Get_Generation_Failure_Result test.
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Health_Check\File_Reports::__construct
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Health_Check\File_Reports::get_generation_failure_result
 */
final class Get_Generation_Failure_Result_Test extends Abstract_File_Reports_Test {

	/**
	 * Check if the generation failure report is built correctly for not_managed_by_yoast_seo reason.
	 *
	 * @return void
	 */
	public function test_creates_generation_failure_report_for_not_managed_by_yoast_seo() {
		$expected = [ 'failure' ];

		$this->reports
			->shouldReceive( 'set_label' )
			->with( 'Your llms.txt file couldn\'t be auto-generated' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_status_recommended' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_description' )
			->with( '<p>You have activated the Yoast llms.txt feature, but we couldn\'t generate an llms.txt file.</p><p>It looks like there is an llms.txt file already that wasn\'t created by Yoast, or the llms.txt file created by Yoast has been edited manually.</p><p>We don\'t want to overwrite this file\'s content, so if you want to let Yoast keep auto-generating the llms.txt file, you can manually delete the existing one. Otherwise, consider disabling the Yoast feature.</p>' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'build' )
			->andReturn( $expected )
			->once();

		$actual = $this->instance->get_generation_failure_result( 'not_managed_by_yoast_seo' );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Check if the generation failure report is built correctly for filesystem_permissions reason.
	 *
	 * @return void
	 */
	public function test_creates_generation_failure_report_for_filesystem_permissions() {
		$expected = [ 'failure' ];

		$this->reports
			->shouldReceive( 'set_label' )
			->with( 'Your llms.txt file couldn\'t be auto-generated' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_status_recommended' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_description' )
			->with( '<p>You have activated the Yoast llms.txt feature, but we couldn\'t generate an llms.txt file.</p><p>It looks like there aren\'t sufficient permissions on the web server\'s filesystem.</p>' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'build' )
			->andReturn( $expected )
			->once();

		$actual = $this->instance->get_generation_failure_result( 'filesystem_permissions' );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Check if the generation failure report is built correctly for unknown reason.
	 *
	 * @return void
	 */
	public function test_creates_generation_failure_report_for_unknown_reason() {
		$expected = [ 'failure' ];

		$this->reports
			->shouldReceive( 'set_label' )
			->with( 'Your llms.txt file couldn\'t be auto-generated' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_status_recommended' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_description' )
			->with( 'You have activated the Yoast llms.txt feature, but we couldn\'t generate an llms.txt file, for unknown reasons.' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'build' )
			->andReturn( $expected )
			->once();

		$actual = $this->instance->get_generation_failure_result( 'unknown_reason' );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Check if the generation failure report defaults to unknown reason for invalid reason.
	 *
	 * @return void
	 */
	public function test_creates_generation_failure_report_defaults_to_unknown_for_invalid_reason() {
		$expected = [ 'failure' ];

		$this->reports
			->shouldReceive( 'set_label' )
			->with( 'Your llms.txt file couldn\'t be auto-generated' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_status_recommended' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_description' )
			->with( 'You have activated the Yoast llms.txt feature, but we couldn\'t generate an llms.txt file, for unknown reasons.' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'build' )
			->andReturn( $expected )
			->once();

		$actual = $this->instance->get_generation_failure_result( 'invalid_reason' );

		$this->assertSame( $expected, $actual );
	}
}
