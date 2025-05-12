<?php

namespace Yoast\WP\SEO\Llms_Txt\Application\File\Commands;

use Yoast\WP\SEO\Helpers\Options_Helper;

class Remove_File_Command_Handler {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Runs the command.
	 *
	 * @return bool Whether the file was created successfully.
	 */
	public function handle( Remove_File_Command $command ) {
		if ( \file_exists( $command->get_file_path() ) ) {
			\unlink( $command->get_file_path() );
			// Maybe move this to a class if we need to handle this option more often.
			$this->options_helper->set( 'llms_txt_content_hash', '' );
		}

		return false;
	}
}
