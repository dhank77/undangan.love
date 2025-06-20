<?php

declare(strict_types=1);

namespace App\Modules\Builder\Domain\Contracts;

use App\Modules\Builder\Infrastructure\Database\Models\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

interface BuilderRepositoryInterface
{
    public function getAllByUser(int $userId, int $perPage = 10): LengthAwarePaginator;
    
    public function getById(int $id): ?Builder;
    
    public function create(array $data): Builder;
    
    public function update(int $id, array $data): Builder;
    
    public function delete(int $id): bool;
    
    public function updateCustomData(int $id, array $customData): Builder;
    
    public function updateRenderedHtml(int $id, string $html): Builder;
}
