<?php

namespace Controllers;
use MVC\Router ; 
class CitaController {
    public static function index(Router  $router ) {
        error_reporting(E_ALL & ~E_NOTICE);
        ini_set('display_errors', '0');       
        session_start() ;
        
        isAuth() ; 

       $router->render('cita/index', [
           'nombre'=> $_SESSION['nombre'],
           'id'=> $_SESSION['id']  
       ]) ; 
    }
} 