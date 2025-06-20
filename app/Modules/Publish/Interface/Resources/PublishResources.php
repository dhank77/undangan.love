<?php

declare(strict_types=1);

namespace App\Modules\Publish\Interface\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class PublishResources extends JsonResource
{
    public function toArray(Request $request) : array|Arrayable|JsonSerializable
    {
        return parent::toArray($request);
    }
}
