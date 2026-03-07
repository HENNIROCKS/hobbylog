<?php

return [

	'date' => [
		'handler' => 'intl',
	],

	'debug' => true,

	'locale' => 'en_US.utf-8',

	/**
	 * KQL — disable auth for local dev (restrict in production!)
	 */

	'kql' => [
		'auth' => false,
	],

	/**
	 * CORS for headless SvelteKit frontend
	 */

	'hooks' => [
		'route:before' => function ($route, $path, $method) {
			$allowedOrigins = [option('hb.frontend_url', 'http://localhost:5173')];
			$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

			if (in_array($origin, $allowedOrigins, true)) {
				header('Access-Control-Allow-Origin: ' . $origin);
				header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
				header('Access-Control-Allow-Headers: Content-Type, Authorization');
				header('Access-Control-Allow-Credentials: true');
			}

			if ($method === 'OPTIONS') {
				http_response_code(204);
				exit;
			}
		},
	],

	/**
	 * Additional config files
	 */

	'panel'   => require_once 'panel.php',
	'private' => require_once 'private.php',
];
