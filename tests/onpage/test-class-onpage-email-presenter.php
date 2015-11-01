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
			$class_instance->get_message(),
			'Yoast SEO has detected that ' . home_url() . ' is indexable again.'
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
			$class_instance->get_message(),
			'Yoast SEO has detected that ' . home_url() . ' is not indexable. Please note that this will make it impossible for search engines like Google and Bing to index your site.'
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
			$class_instance->get_message(),
			'Yoast SEO has detected that '. home_url(). ' is indexable again.'
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
			$class_instance->get_message(),
			'Yoast SEO has detected that '. home_url(). ' is no longer indexable. Please note that this will make it impossible for search engines like Google and Bing to index your site.'
		);
	}

}