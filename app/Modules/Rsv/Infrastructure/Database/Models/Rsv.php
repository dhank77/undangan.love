<?php

declare(strict_types=1);

namespace App\Modules\Rsv\Infrastructure\Database\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class Rsv extends Model
{
    protected $table = 'rsvps';

    protected $fillable = [
        'user_id',
        'guest_name',
        'phone_number',
        'attending',
        'message'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
