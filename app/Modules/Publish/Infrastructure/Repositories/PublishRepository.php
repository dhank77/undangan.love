<?php

declare(strict_types=1);

namespace App\Modules\Publish\Infrastructure\Repositories;

use App\Modules\Publish\Domain\Contracts\PublishRepositoryInterface;
use App\Modules\Publish\Infrastructure\Database\Models\Publish;

class PublishRepository implements PublishRepositoryInterface
{
    public function __construct(
        protected Publish $publishModel
    ) {}

}
