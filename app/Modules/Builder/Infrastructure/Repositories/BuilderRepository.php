<?php

declare(strict_types=1);

namespace App\Modules\Builder\Infrastructure\Repositories;

use App\Modules\Builder\Domain\Contracts\BuilderRepositoryInterface;
use App\Modules\Builder\Infrastructure\Database\Models\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class BuilderRepository implements BuilderRepositoryInterface
{
    public function __construct(
        protected Builder $builderModel
    ) {}

    public function getAllByUser(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->builderModel
            ->where('user_id', $userId)
            ->with(['template'])
            ->orderBy('updated_at', 'desc')
            ->paginate($perPage);
    }

    public function getById(int $id): ?Builder
    {
        return $this->builderModel
            ->with(['template', 'user'])
            ->find($id);
    }

    public function create(array $data): Builder
    {
        return $this->builderModel->create($data);
    }

    public function update(int $id, array $data): Builder
    {
        $builder = $this->getById($id);
        $builder->update($data);
        return $builder->fresh();
    }

    public function delete(int $id): bool
    {
        return $this->builderModel->destroy($id) > 0;
    }

    public function updateCustomData(int $id, array $customData): Builder
    {
        $builder = $this->getById($id);
        $builder->update(['custom_data_json' => $customData]);
        return $builder->fresh();
    }

    public function updateRenderedHtml(int $id, string $html): Builder
    {
        $builder = $this->getById($id);
        $builder->update(['rendered_html' => $html]);
        return $builder->fresh();
    }
}
