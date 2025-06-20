<?php

declare(strict_types=1);

namespace App\Modules\Publish\Interface\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Publish\Application\Services\PublishService;

class PublishController extends Controller
{

    public function __construct(
        protected PublishService $publishService
    ) {}

}
