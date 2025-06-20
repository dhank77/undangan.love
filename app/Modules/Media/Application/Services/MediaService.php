<?php

declare(strict_types=1);

namespace App\Modules\Media\Application\Services;

use App\Modules\Media\Domain\Contracts\MediaRepositoryInterface;

class MediaService
{
    public function __construct(
        protected MediaRepositoryInterface $mediaRepository
    ) {}
}
