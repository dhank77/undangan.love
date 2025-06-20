<?php

declare(strict_types=1);

namespace App\Modules\Template\Infrastructure\Database\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Modules\Builder\Infrastructure\Database\Models\Builder;

class Template extends Model
{
    protected $table = 'templates';

    protected $fillable = [
        'name',
        'thumbnail_url',
        'html_layout',
        'config_json',
        'is_premium'
    ];

    protected $casts = [
        'config_json' => 'array',
        'is_premium' => 'boolean',
    ];

    public function builders(): HasMany
    {
        return $this->hasMany(Builder::class);
    }
}
