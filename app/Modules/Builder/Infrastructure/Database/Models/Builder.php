<?php

declare(strict_types=1);

namespace App\Modules\Builder\Infrastructure\Database\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use App\Modules\Template\Infrastructure\Database\Models\Template;
use App\Modules\Publish\Infrastructure\Database\Models\Publish;

class Builder extends Model
{
    protected $table = 'builders';

    protected $fillable = [
        'user_id',
        'template_id',
        'custom_data_json',
        'rendered_html',
        'name'
    ];

    protected $casts = [
        'custom_data_json' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    public function publishes(): HasMany
    {
        return $this->hasMany(Publish::class);
    }
}
