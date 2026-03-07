<?php

// Load deploy config if it exists (server-only file, never committed)
$deployConfig = file_exists(__DIR__ . '/deploy.php')
	? require __DIR__ . '/deploy.php'
	: [];

function triggerDeployment(array $config): void {
	if (empty($config['github_token']) || empty($config['github_repo'])) {
		return;
	}

	$url = "https://api.github.com/repos/{$config['github_repo']}/actions/workflows/deploy.yml/dispatches";
	$ch  = curl_init($url);

	curl_setopt_array($ch, [
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_POST           => true,
		CURLOPT_HTTPHEADER     => [
			'Authorization: Bearer ' . $config['github_token'],
			'Accept: application/vnd.github+json',
			'Content-Type: application/json',
			'User-Agent: Kirby-Hobbylog',
		],
		CURLOPT_POSTFIELDS     => json_encode(['ref' => 'main']),
		CURLOPT_TIMEOUT        => 5,
	]);

	curl_exec($ch);
	curl_close($ch);
}

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
	 * Hooks
	 */

	'hooks' => [

		// CORS for headless SvelteKit frontend
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

		// Trigger frontend rebuild when content changes
		'page.update:after' => function ($newPage, $oldPage) use ($deployConfig) {
			triggerDeployment($deployConfig);
		},

		'page.create:after' => function ($page) use ($deployConfig) {
			triggerDeployment($deployConfig);
		},

		'page.delete:after' => function ($page) use ($deployConfig) {
			triggerDeployment($deployConfig);
		},

	],

	/**
	 * Additional config files
	 */

	'panel'   => require_once 'panel.php',
	'private' => require_once 'private.php',
];
