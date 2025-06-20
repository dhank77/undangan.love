<?php

declare(strict_types=1);

namespace App\Modules\Editor\Infrastructure\Database\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class Editor extends Model
{
    use HasFactory;

    protected $table = 'editors';

    protected $fillable = [
        'user_id',
        'name',
        'content',
        'html',
        'css',
        'is_template',
        'thumbnail',
        'published_at'
    ];

    protected $casts = [
        'content' => 'array',
        'is_template' => 'boolean',
        'published_at' => 'datetime'
    ];

    /**
     * Get the user that owns the editor
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for templates only
     */
    public function scopeTemplates($query)
    {
        return $query->where('is_template', true);
    }

    /**
     * Scope for editors only (not templates)
     */
    public function scopeEditors($query)
    {
        return $query->where('is_template', false);
    }

    /**
     * Scope for user's items
     */
    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for recent items
     */
    public function scopeRecent($query, int $limit = 5)
    {
        return $query->orderBy('updated_at', 'desc')->limit($limit);
    }
}
