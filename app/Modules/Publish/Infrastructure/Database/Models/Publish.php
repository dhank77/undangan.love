<?php

declare(strict_types=1);

namespace App\Modules\Publish\Infrastructure\Database\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Modules\Builder\Infrastructure\Database\Models\Builder;

class Publish extends Model
{
    protected $table = 'publishes';

    protected $fillable = [
        'user_id',
        'builder_id',
        'subdomain',
        'custom_domain',
        'published_at',
        'status'
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function builder(): BelongsTo
    {
        return $this->belongsTo(Builder::class);
    }
}
