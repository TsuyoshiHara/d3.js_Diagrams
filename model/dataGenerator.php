<?php

$_data = array(
      'nodes' => array()
    , 'links' => array()
);

for($_i = 0; $_i < 8; $_i++) {
    array_push( $_data['nodes'], 
        array( "name" => chr(65+$_i) )
    );
}

$_link = array(
      array( "source" => 0, "target" => 2, "value" => rand(1,100) )
    , array( "source" => 1, "target" => 2, "value" => rand(1,100) )
    , array( "source" => 2, "target" => 3, "value" => rand(1,100) )
    , array( "source" => 2, "target" => 5, "value" => rand(1,100) )
    , array( "source" => 2, "target" => 6, "value" => rand(1,100) ) 
    , array( "source" => 3, "target" => 4, "value" => rand(1,100) )
    , array( "source" => 3, "target" => 5, "value" => rand(1,100) )
    , array( "source" => 6, "target" => 7, "value" => rand(1,100) )
);

$_data['links'] = $_link;

print_r(json_encode($_data));

?>