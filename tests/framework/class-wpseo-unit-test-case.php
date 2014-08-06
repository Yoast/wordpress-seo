<?php

/**
* TestCase base class for convenience methods.
*/
class WPSEO_UnitTestCase extends WP_UnitTestCase {

	/**
	* @param string $key
	* @param mixed $value
	*/
	protected function set_post( $key, $value ) {
		$_POST[$key] = $_REQUEST[$key] = addslashes( $value );
	}

	/**
	* @param string $key
	*/
	protected function unset_post( $key ) {
		unset( $_POST[$key], $_REQUEST[$key] );
	}

	/**
	* Fake a request to the WP front page
	*/
	protected function go_to_home() {
		$this->go_to( home_url( '/' ) );
	}

	/**
	* @param string $expected
	*/
	protected function expectOutput( $expected ) {
		$output = ob_get_contents();
		ob_clean();
		$this->assertEquals( $expected, $output );
	}

	/**
	 * Skips the current test if there is an open plugin ticket with id $ticket_id
	 */
	public function knownPluginBug( $ticket_id ) {
		if ( WP_TESTS_FORCE_KNOWN_BUGS || in_array( 'Plugin' . $ticket_id, self::$forced_tickets ) ) {
			return;
		}
		if ( GithubIssues::is_github_issue_open( $ticket_id ) ) {
			$this->markTestSkipped( "\n" . sprintf( '%s issue #%d is not fixed', $GLOBALS['github_repo']['name'], $ticket_id ) );
		}
	}
}