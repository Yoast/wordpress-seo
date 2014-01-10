<?php

interface iWPSEO_Redirect_File {
	public function format_redirect( $old_url, $new_url );
}

abstract class WPSEO_Redirect_File implements iWPSEO_Redirect_File {

	private function generate_file_content() {
		$file_content = "";
		$redirects    = WPSEO_Redirect_Manager::get_redirects();
		if ( count( $redirects ) > 0 ) {
			foreach ( $redirects as $old_url => $new_url ) {
				$file_content .= $this->format_redirect( $old_url, $new_url ) . "\n";
			}
		}
		return $file_content;
	}

	public function save_file() {

		// Generate file content
		$file_content = $this->generate_file_content();

		// Check if the file content isset
		if ( null == $file_content ) {
			return false;
		}

		// Save the actual file
		@file_put_contents( WPSEO_Redirect_File_Manager::get_file_path(), $file_content );
	}

}