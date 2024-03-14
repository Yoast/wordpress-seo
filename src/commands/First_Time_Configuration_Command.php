<?php

namespace Yoast\WP\SEO\Commands;

use WP_CLI;
use WP_CLI\Utils;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Actions\Indexing\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Indexing_Complete_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexation_Action_Interface;
use Yoast\WP\SEO\Actions\Indexing\Indexing_Prepare_Action;
use Yoast\WP\SEO\Actions\Indexing\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Actions\Indexing\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Main;

/**
 * Command to generate indexables for all posts and terms.
 */
class First_Time_Configuration_Command implements Command_Interface {

	/**
	 * The main command.
	 *
	 * @param array|null $args       The arguments.
	 * @param array|null $assoc_args The associative arguments.
	 *
	 * @return void
	 */
	public function first_time_configuration() {
		/*WP_CLI::confirm( \__( 'Do you want to run the SEO data optimization?', 'wordpress-seo' ) );

		WP_CLI::runcommand( 'yoast index', $options = [] );
		
		WP_CLI::line( "SEO data optimization completed successfully");
		*/

		$options=['organization', 'person'];

		$chosen_option = $this->ask( \__( 'Does your site represent an Organization or aPerson?'. 'wordpress-seo' ), $options );

		WP_CLI::line( $chosen_option );

	}
	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public static function get_namespace() {
		return Main::WP_CLI_NAMESPACE;
	}
	
	private function ask( $question, $options = [] ) {
		if ( ! empty( $options ) ) {
			fwrite( STDOUT, $question . ' [' . implode( ',', $options ) . '] ' );

			$answer = strtolower( trim( fgets( STDIN ) ) );

			if ( ! in_array( $answer, $options, true ) ) {
				WP_CLI::error( 'Invalid answer', false );
				return $this->ask( $question, $options );
			}
			return $answer;
		}

		fwrite( STDOUT, $question );

		return fgets( STDIN );
	}
}
