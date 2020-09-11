<?php

namespace Yoast\WP\SEO;

interface Fruit_Interface {}

class Fruit_Manager {
    public $fruit;

    public function __construct( Fruit_Interface ...$fruit ) {
        $this->fruit = $fruit;
        var_dump($this->fruit);
    }
}

class Apple implements Fruit_Interface {};

class Pear implements Fruit_Interface {};
