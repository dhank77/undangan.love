<?php

declare(strict_types=1);

namespace App\Modules\Media\Application\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Min;

class MediaData extends Data
{
    public function __construct(
        public ?int $id,
        #[Min(3)]
        public string $name,
    ) {}
}
