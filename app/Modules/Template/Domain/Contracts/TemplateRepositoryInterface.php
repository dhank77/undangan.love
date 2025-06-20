<?php

declare(strict_types=1);

namespace App\Modules\Template\Domain\Contracts;

use App\Modules\Template\Infrastructure\Database\Models\Template;
use Illuminate\Pagination\LengthAwarePaginator;

interface TemplateRepositoryInterface
{
    public function getAll(int $perPage = 10): LengthAwarePaginator;
    
    public function getFree(int $perPage = 10): LengthAwarePaginator;
    
    public function getPremium(int $perPage = 10): LengthAwarePaginator;
    
    public function getById(int $id): ?Template;
    
    public function create(array $data): Template;
    
    public function update(int $id, array $data): Template;
    
    public function delete(int $id): bool;
}
