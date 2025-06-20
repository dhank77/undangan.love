<?php

declare(strict_types=1);

namespace App\Modules\Rsv\Interface\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Rsv\Application\Services\RsvService;

class RsvController extends Controller
{

    public function __construct(
        protected RsvService $rsvService
    ) {}

}
