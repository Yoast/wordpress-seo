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
			'The indexability from your website '. home_url(). ' is indexable at the moment.'
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
			'The indexability from your website '. home_url(). ' is not indexable at the moment.'
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
			'The indexability from your website '. home_url(). ', went from not indexable to indexable.'
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
			'The indexability from your website '. home_url(). ', went from indexable to not indexable.'
		);
	}

}