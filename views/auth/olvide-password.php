<h1 class="nombre-pagina">Olvide Password</h1>
<p class="descripcion-pagina">Restablece tu Password escribiendo tu email a continuacion</p>
<?php 
include_once __DIR__ . "/../templates/alertas.php"
?>


<form class="formulario" action="/olvide" method="POST">
    <div class="campo">
        <label for="email">Email</label>
        <input type="email"
        id="email"
        name="email"
        placeholder="Tu email.."
        />
    </div>
    <input type="submit" class="boton" value="enviar instrucciones" >
</form>

<div class="acciones">
    <a href="/">Ya tienes una cuenta ? Inicia Sesion</a>
    <a href="/crear-cuenta">Aun no tienes una cuenta? Crear Una</a>
</div>