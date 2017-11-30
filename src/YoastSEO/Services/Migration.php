<?php

namespace Yoast\YoastSEO\Services;

use Symfony\Component\Console\Output\NullOutput;
use Yoast\Fake_Input;
use Yoast\Migrate_Command;

class Migration {
	public function migrate() {

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
