<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\ConfigUI\Components
 */

/**
 * Class WPSEO_Config_Component_Mailchimp_Signup_Test
 */
class WPSEO_Config_Component_Mailchimp_Signup_Test extends WPSEO_UnitTestCase {


	/**
	 * Tests the get_identifier
	 *
	 * @covers WPSEO_Config_Component_Mailchimp_Signup::get_identifier()
	 */
	public function test_get_identifier() {
		$mailchimp_signup = new WPSEO_Config_Component_Mailchimp_Signup();

		$this->assertEquals( 'MailchimpSignup', $mailchimp_signup->get_identifier() );
	}


	/**
	 * Tests the get_field
	 *
	 * @covers WPSEO_Config_Component_Mailchimp_Signup::get_field()
	 */
	public function test_get_field() {
		$mailchimp_signup = new WPSEO_Config_Component_Mailchimp_Signup();

		$this->assertInstanceOf( 'WPSEO_Config_Field', $mailchimp_signup->get_field() );
	}


	/**
	 * Tests getting the data.
	 *
	 * @covers WPSEO_Config_Component_Mailchimp_Signup::get_data()
	 */
	public function test_get_data() {
		$mailchimp_signup = new WPSEO_Config_Component_Mailchimp_Signup();

		$this->assertEquals(
			array( 'hasSignup' => false ),
			$mailchimp_signup->get_data() );
	}

	/**
	 * Tests setting the data.
	 *
	 * @covers WPSEO_Config_Component_Mailchimp_Signup::set_data()
	 */
	public function test_set_data() {
		// Sets the current user id to make sure hasSignup will be saved.
		wp_set_current_user( 1 );

		$mailchimp_signup = new WPSEO_Config_Component_Mailchimp_Signup();

		$this->assertEquals(
			array( 'hasSignup' => true ),
			$mailchimp_signup->set_data( array( 'hasSignup' => true ) )
		);
	}
}
