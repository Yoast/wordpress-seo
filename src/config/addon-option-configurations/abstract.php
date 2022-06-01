<?php

abstract class Addon_Option_Configurations {
    protected $option_name;

    protected $configurations = [];

    public function get_option_name() {
        return $this->option_name;
    }

    public function get_configurations() {
        return $this->configurations;
    }

    public function get_configuration_keys() {
        return array_keys( $this->configurations );
    }
} 