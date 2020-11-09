<?php

namespace App\Data;

class SearchData
{

    /**
     *  @var int
     */
    public $page = 1;
    /**
     * @var string
     */
    public $q ="";
    // servira au nom de la recherche

    /**
     * @var Category[]
     */
    public $categories = [];

    /**
     *  @var null|integer
     */
    public $max;

    // si il y a une val null
    // on ne veut pas prendre en compte le filtre donc on met a null
    /**
     * @var null|integer
     */
    public $min; 

    /**
     * @var boolean
     */
    public $promo = false;



    
}
