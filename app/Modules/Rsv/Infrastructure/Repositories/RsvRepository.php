<?php

declare(strict_types=1);

namespace App\Modules\Rsv\Infrastructure\Repositories;

use App\Modules\Rsv\Domain\Contracts\RsvRepositoryInterface;
use App\Modules\Rsv\Infrastructure\Database\Models\Rsv;

class RsvRepository implements RsvRepositoryInterface
{
    public function __construct(
        protected Rsv $rsvModel
    ) {}

}
