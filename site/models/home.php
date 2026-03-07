<?php

use Kirby\Cms\Page;

class HomePage extends Page
{
    public function previewUrl(\Kirby\Content\VersionId|string $versionId = 'latest'): ?string
    {
        return rtrim(option('hb.frontend_url', 'http://localhost:5173'), '/');
    }
}
