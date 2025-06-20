<?php

declare(strict_types=1);

namespace App\Modules\Rsv\Application\Services;

use App\Modules\Rsv\Domain\Contracts\RsvRepositoryInterface;

class RsvService
{
    public function __construct(
        protected RsvRepositoryInterface $rsvRepository
    ) {}
}
