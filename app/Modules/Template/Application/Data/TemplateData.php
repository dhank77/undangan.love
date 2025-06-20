<?php

declare(strict_types=1);

namespace App\Modules\Template\Application\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Required;

class TemplateData extends Data
{
    public function __construct(
        public ?int $id,
        #[Required, Min(3)]
        public string $name,
        public ?string $thumbnail_url,
        #[Required]
        public string $html_layout,
        public ?array $config_json,
        public bool $is_premium = false,
    ) {}
}
