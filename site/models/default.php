<?php

use Kirby\Cms\Page;

class DefaultPage extends Page
{
    public function previewUrl(\Kirby\Content\VersionId|string $versionId = 'latest'): ?string
    {
        $base = option('hb.frontend_url', 'http://localhost:5173');
        return rtrim($base, '/') . '/' . $this->slug();
    }
}
