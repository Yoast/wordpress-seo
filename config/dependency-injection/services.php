<?php

use Symfony\Component\DependencyInjection\Definition;

$definition = new Definition();

$definition
	->setAutowired( true )
	->setAutoconfigured( true )
	->setPublic( true );

$this->registerClasses( $definition, 'Yoast\\WP\\Free\\', 'src/*', 'src/{config,models,loaders,wordpress,yoast-model.php,yoast-orm-wrapper.php}' );
