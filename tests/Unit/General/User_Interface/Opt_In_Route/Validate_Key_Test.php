<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\General\User_Interface\Opt_In_Route;

/**
 * Tests the Opt_In_Route validate_key method.
 *
 * @group opt-in-route
 *
 * @covers \Yoast\WP\SEO\General\User_Interface\Opt_In_Route::validate_key
 */
final class Validate_Key_Test extends Abstract_Opt_In_Route_Test {

	/**
	 * Tests the validate_key method with a valid key.
	 *
	 * @return void
	 */
	public function test_validate_key_with_valid_key() {
		$this->assertTrue( $this->instance->validate_key( 'wpseo_seen_llm_txt_opt_in_notification' ) );
	}

	/**
	 * Tests the validate_key method with an invalid key.
	 *
	 * @return void
	 */
	public function test_validate_key_with_invalid_key() {
		$this->assertFalse( $this->instance->validate_key( 'invalid_key' ) );
	}

	/**
	 * Tests the validate_key method with an empty string.
	 *
	 * @return void
	 */
	public function test_validate_key_with_empty_string() {
		$this->assertFalse( $this->instance->validate_key( '' ) );
	}

	/**
	 * Tests the validate_key method with null.
	 *
	 * @return void
	 */
	public function test_validate_key_with_null() {
		$this->assertFalse( $this->instance->validate_key( null ) );
	}

	/**
	 * Tests the validate_key method with a partially matching key.
	 *
	 * @return void
	 */
	public function test_validate_key_with_partial_match() {
		$this->assertFalse( $this->instance->validate_key( 'wpseo_seen_llm_txt' ) );
	}

	/**
	 * Tests the validate_key method with a key containing extra characters.
	 *
	 * @return void
	 */
	public function test_validate_key_with_extra_characters() {
		$this->assertFalse( $this->instance->validate_key( 'wpseo_seen_llm_txt_opt_in_notification_extra' ) );
	}

	/**
	 * Tests the validate_key method is case-sensitive.
	 *
	 * @return void
	 */
	public function test_validate_key_is_case_sensitive() {
		$this->assertFalse( $this->instance->validate_key( 'WPSEO_SEEN_LLM_TXT_OPT_IN_NOTIFICATION' ) );
	}

	/**
	 * Tests the validate_key method with whitespace around valid key.
	 *
	 * @return void
	 */
	public function test_validate_key_with_whitespace() {
		$this->assertFalse( $this->instance->validate_key( ' wpseo_seen_llm_txt_opt_in_notification ' ) );
	}
}
