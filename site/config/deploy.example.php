<?php

/**
 * Deploy config — server-only, never commit the real version.
 * Copy this file to deploy.php and fill in your values.
 *
 * GitHub PAT requires the `workflow` scope.
 * github_repo format: "username/repo-name"
 */

return [
    'github_token' => 'ghp_xxxxxxxxxxxxxxxxxxxx',
    'github_repo'  => 'your-username/hobbylog.hendrik-berends.de',
];
