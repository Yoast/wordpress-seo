<?php

namespace Yoast\WP\SEO\Llms_Txt\Application\File\Commands;

class Populate_File_Command {

	/**
	 * The path where the file should be created.
	 *
	 * @var string
	 */
	private $file_path;

	/**
	 * Constructor.
	 *
	 * @param string $file_path The path where the file should be created.
	 */
	public function __construct( string $file_path ) {
		$this->file_path = $file_path;
	}

	public function get_file_path(): string {
		return $this->file_path;
	}
}
