<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_OnPage_Email_Presenter_Test extends WPSEO_UnitTestCase {

	/**
	 * Getting the message when run the first time with the site being indexable
	 *
	 * @covers WPSEO_OnPage_Email_Presenter::get_message
	 */
	public function test_get_message_first_time_indexable() {
		$class_instance = new WPSEO_OnPage_Email_Presenter(
			array(
				'old_status' => null,
				'new_status' => 1
			)
		);

		$this->assertContains(
			'Yoast SEO has detected that ' . home_url() . ' can be indexed.<br /><br />Indexation powered by',
			$class_instance->get_message()
		);
	}

	/**
	 * Getting the message when run the first time with the site being indexable
	 *
	 * @covers WPSEO_OnPage_Email_Presenter::get_message
	 */
	public function test_get_message_first_time_not_indexable() {
		$class_instance = new WPSEO_OnPage_Email_Presenter(
			array(
				'old_status' => null,
				'new_status' => 0
			)
		);

		$this->assertContains(
			'Yoast SEO has detected that ' . home_url() . ' can not be indexed. Please note that this will make it impossible for search engines like Google and Bing to index your site.',
			$class_instance->get_message()
		);
	}

	/**
	 * Getting the message when run the first time with the site being indexable
	 *
	 * @covers WPSEO_OnPage_Email_Presenter::get_message
	 */
	public function test_get_message_indexable() {
		$class_instance = new WPSEO_OnPage_Email_Presenter(
			array(
				'old_status' => 0,
				'new_status' => 1
			)
		);

		$this->assertContains(
			'Yoast SEO has detected that ' . home_url() . ' can be indexed again.<br /><br />Indexation powered by',
			$class_instance->get_message()
		);
	}

	/**
	 * Getting the message when run the first time with the site being indexable
	 *
	 * @covers WPSEO_OnPage_Email_Presenter::get_message
	 */
	public function test_get_message_not_indexable() {
		$class_instance = new WPSEO_OnPage_Email_Presenter(
			array(
				'old_status' => 1,
				'new_status' => 0
			)
		);

		$this->assertContains(
			'Yoast SEO has detected that '. home_url(). ' can no longer be indexed. Please note that this will make it impossible for search engines like Google and Bing to index your site.',
			$class_instance->get_message()
		);
	}

}