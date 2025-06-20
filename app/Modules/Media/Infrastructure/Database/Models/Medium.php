<?php

declare(strict_types=1);

namespace App\Modules\Media\Infrastructure\Database\Models;

use Illuminate\Database\Eloquent\Model;

class Medium extends Model
{
    protected $table = 'media';

    protected $fillable = ['name'];

}
