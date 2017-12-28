<?php

namespace Yoast\YoastSEO\Database\Services;

use Symfony\Component\Console\Output\NullOutput;
use Yoast\Fake_Input;
use Yoast\Migrate_Command;
use Yoast\WordPress\Integration;

class Migration implements Integration {
	public function add_hooks() {
		try {
			$input = new Fake_Input();
			$input->setArgument( 'command', 'migrate' );

			$migrate = new Migrate_Command();
			$migrate->run( $input, new NullOutput() );
		} catch ( \Exception $exception ) {
//			 @todo: Handle exception.
		}
	}
}
