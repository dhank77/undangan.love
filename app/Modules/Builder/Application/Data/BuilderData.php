<?php

declare(strict_types=1);

namespace App\Modules\Builder\Application\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Required;

class BuilderData extends Data
{
    public function __construct(
        public ?int $id,
        #[Required]
        public int $user_id,
        #[Required]
        public int $template_id,
        public ?array $custom_data_json,
        public ?string $rendered_html,
        #[Min(3)]
        public ?string $name,
    ) {}
}
