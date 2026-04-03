<?php
namespace GEO\Models;

class Post_Model {
    public $id;
    public $content;
    public $seo_title;
    public $meta_description;

    public function __construct($id) {
        $this->id = $id;
    }
}
