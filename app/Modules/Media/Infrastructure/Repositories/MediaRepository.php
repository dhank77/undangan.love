<?php

declare(strict_types=1);

namespace App\Modules\Media\Infrastructure\Repositories;

use App\Modules\Media\Domain\Contracts\MediaRepositoryInterface;
use App\Modules\Media\Infrastructure\Database\Models\Medium;

class MediaRepository implements MediaRepositoryInterface
{
    public function __construct(
        protected Medium $mediaModel
    ) {}

}
