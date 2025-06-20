<?php

declare(strict_types=1);

namespace App\Modules\Template\Infrastructure\Repositories;

use App\Modules\Template\Domain\Contracts\TemplateRepositoryInterface;
use App\Modules\Template\Infrastructure\Database\Models\Template;
use Illuminate\Pagination\LengthAwarePaginator;

class TemplateRepository implements TemplateRepositoryInterface
{
    public function __construct(
        protected Template $templateModel
    ) {}

    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return $this->templateModel->paginate($perPage);
    }

    public function getFree(int $perPage = 10): LengthAwarePaginator
    {
        return $this->templateModel->where('is_premium', false)->paginate($perPage);
    }

    public function getPremium(int $perPage = 10): LengthAwarePaginator
    {
        return $this->templateModel->where('is_premium', true)->paginate($perPage);
    }

    public function getById(int $id): ?Template
    {
        return $this->templateModel->find($id);
    }

    public function create(array $data): Template
    {
        return $this->templateModel->create($data);
    }

    public function update(int $id, array $data): Template
    {
        $template = $this->templateModel->findOrFail($id);
        $template->update($data);
        return $template->fresh();
    }

    public function delete(int $id): bool
    {
        $template = $this->templateModel->findOrFail($id);
        return $template->delete();
    }
}
