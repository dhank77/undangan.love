<?php

declare(strict_types=1);

namespace App\Modules\Media\Interface\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Media\Application\Services\MediaService;

class MediaController extends Controller
{

    public function __construct(
        protected MediaService $mediaService
    ) {}

}
