<?php

declare(strict_types=1);

namespace App\Modules\Publish\Application\Services;

use App\Modules\Publish\Domain\Contracts\PublishRepositoryInterface;

class PublishService
{
    public function __construct(
        protected PublishRepositoryInterface $publishRepository
    ) {}
}
