<?php
/**
 * Procesa el formulario de contacto de aureo-systems.com y envía los datos
 * del cliente por correo. Se invoca vía fetch (AJAX) desde Script.js.
 */

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$destinatario = 'jairo.pena@aureo-systems.com';
$dominioEnvio = 'aureo-systems.com';

function limpiar($valor) {
    $valor = trim((string) $valor);
    return str_replace(["\r", "\n"], ' ', $valor);
}

// Honeypot: los bots suelen rellenar todos los campos, incluido este,
// que para una persona real está oculto. Si viene lleno, fingimos éxito.
if (!empty($_POST['website'])) {
    echo json_encode(['success' => true]);
    exit;
}

$nombre       = limpiar($_POST['nombre'] ?? '');
$empresa      = limpiar($_POST['empresa'] ?? '');
$telefono     = limpiar($_POST['telefono'] ?? '');
$email        = limpiar($_POST['email'] ?? '');
$tipoSolucion = limpiar($_POST['tipo-solucion'] ?? '');
$mensaje      = trim((string) ($_POST['mensaje'] ?? ''));

$errores = [];

if ($nombre === '' || mb_strlen($nombre) > 150) {
    $errores['nombre'] = 'El nombre es obligatorio.';
}
if ($telefono === '' || mb_strlen($telefono) > 40) {
    $errores['telefono'] = 'El teléfono es obligatorio.';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errores['email'] = 'Ingresa un correo electrónico válido.';
}
if ($mensaje === '' || mb_strlen($mensaje) > 5000) {
    $errores['mensaje'] = 'El mensaje es obligatorio.';
}

if (!empty($errores)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errores]);
    exit;
}

$tiposSolucion = [
    'ciberseguridad'    => 'Ciberseguridad administrada',
    'software'          => 'Software crítico',
    'automatizacion-ia' => 'Automatización con IA',
    'datos-ia'          => 'Análisis de datos e IA',
    'marketing'         => 'Marketing digital',
    'consultoria'       => 'Consultoría tecnológica',
    'ecommerce'         => 'Ecommerce',
    'otro'              => 'Otro',
];
$tipoSolucionTexto = $tiposSolucion[$tipoSolucion] ?? 'No especificado';

$fecha = date('d/m/Y H:i');
$mensajeHtml = nl2br(htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8'));
// Se calcula a partir de la petición real (en vez de asumir el dominio raíz)
// para que funcione sin importar si el sitio vive en la raíz, una subcarpeta
// o un subdominio del hosting.
$protocoloActual = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$hostActual = $_SERVER['HTTP_HOST'] ?? $dominioEnvio;
$rutaBase = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
$logoUrl = $protocoloActual . '://' . $hostActual . $rutaBase . '/assets/logo-aureo.png';
$telefonoLink = preg_replace('/[^0-9+]/', '', $telefono);
$nombreEscapado = htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8');
$emailEscapado = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$telefonoEscapado = htmlspecialchars($telefono, ENT_QUOTES, 'UTF-8');
$primerNombre = htmlspecialchars(explode(' ', trim($nombre))[0], ENT_QUOTES, 'UTF-8');

$filas = [
    'Nombre'   => $nombreEscapado,
    'Empresa'  => $empresa !== '' ? htmlspecialchars($empresa, ENT_QUOTES, 'UTF-8') : '—',
    'Teléfono' => '<a href="tel:' . htmlspecialchars($telefonoLink, ENT_QUOTES, 'UTF-8') . '" style="color:#1a3c5f;text-decoration:none;font-weight:600;">' . $telefonoEscapado . '</a>',
    'Correo'   => '<a href="mailto:' . $emailEscapado . '" style="color:#1a3c5f;text-decoration:none;font-weight:600;">' . $emailEscapado . '</a>',
];

$filasHtml = '';
foreach ($filas as $etiqueta => $valor) {
    $filasHtml .= '
        <tr>
            <td style="padding:12px 0;border-bottom:1px solid #ece6d6;color:#8a8272;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;white-space:nowrap;vertical-align:top;width:120px;">' . $etiqueta . '</td>
            <td style="padding:12px 0;border-bottom:1px solid #ece6d6;color:#1a1a1a;font-size:14.5px;">' . $valor . '</td>
        </tr>';
}

$badgeTipoSolucion = $tipoSolucion !== ''
    ? '<span style="display:inline-block;padding:5px 14px;background:#fdf6e3;color:#8a650a;border-radius:20px;font-size:12.5px;font-weight:700;">' . htmlspecialchars($tipoSolucionTexto, ENT_QUOTES, 'UTF-8') . '</span>'
    : '<span style="display:inline-block;padding:5px 14px;background:#f0ede3;color:#8a8272;border-radius:20px;font-size:12.5px;font-weight:600;">No especificado</span>';

$cuerpo = '<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f1e9;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Nueva solicitud de ' . $nombreEscapado . ' a través del formulario de aureo-systems.com</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1e9;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;max-width:600px;box-shadow:0 8px 24px rgba(20,30,40,0.08);">

<tr>
<td style="background:#ffffff;padding:32px 32px 22px;border-bottom:3px solid #e3b82f;">
<img src="' . $logoUrl . '" alt="Áureo Systems" width="164" style="display:block;border:0;outline:none;text-decoration:none;">
</td>
</tr>

<tr>
<td style="background:#1a3c5f;padding:18px 32px;">
<span style="color:#e3b82f;font-size:11px;letter-spacing:0.14em;font-weight:700;text-transform:uppercase;">Formulario de contacto</span><br>
<span style="color:#ffffff;font-size:20px;font-weight:700;">Nueva solicitud de ' . $primerNombre . '</span>
</td>
</tr>

<tr><td style="padding:28px 32px 4px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $filasHtml . '
<tr>
<td style="padding:14px 0 0;color:#8a8272;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;vertical-align:top;">Interés</td>
<td style="padding:14px 0 0;">' . $badgeTipoSolucion . '</td>
</tr>
</table>
</td></tr>

<tr><td style="padding:24px 32px 8px;">
<p style="margin:0 0 8px;color:#5c5443;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">Mensaje</p>
<p style="margin:0;color:#1a1a1a;font-size:14.5px;line-height:1.65;background:#f7f5ee;border-left:3px solid #e3b82f;padding:16px 18px;border-radius:0 8px 8px 0;">' . $mensajeHtml . '</p>
</td></tr>

<tr><td style="padding:28px 32px 32px;">
<a href="mailto:' . $emailEscapado . '?subject=' . rawurlencode('Re: tu solicitud a Áureo Systems') . '" style="display:inline-block;background:#e3b82f;color:#1a3c5f;font-size:14px;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:8px;">Responder a ' . $primerNombre . '</a>
</td></tr>

<tr>
<td style="background:#f4f1e9;padding:20px 32px;border-top:1px solid #ece6d6;">
<p style="margin:0 0 4px;color:#5c5443;font-size:12px;font-weight:700;">ÁUREO SYSTEMS</p>
<p style="margin:0;color:#8a8272;font-size:11.5px;line-height:1.6;">Morelos 36, Col. Francisco I. Madero, Puebla, Pue., C.P. 72130 · 222 152 9152<br>Recibido el ' . $fecha . ' vía el formulario de contacto de aureo-systems.com</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>';

$asunto = 'Nueva solicitud de contacto — ' . $nombre;
$asuntoCodificado = '=?UTF-8?B?' . base64_encode($asunto) . '?=';

$remitenteNombre = '=?UTF-8?B?' . base64_encode('Formulario Aureo Systems') . '?=';
$remitente = 'no-reply@' . $dominioEnvio;
$replyTo = '=?UTF-8?B?' . base64_encode($nombre) . '?= <' . $email . '>';

$cabeceras = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: ' . $remitenteNombre . ' <' . $remitente . '>',
    'Reply-To: ' . $replyTo,
    'X-Mailer: PHP/' . phpversion(),
];

$enviado = @mail($destinatario, $asuntoCodificado, $cuerpo, implode("\r\n", $cabeceras), '-f ' . $remitente);

if ($enviado) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'No se pudo enviar el mensaje. Intenta de nuevo o escríbenos a help@aureo-systems.com.',
    ]);
}
