<?php

declare(strict_types=1);

namespace App\Modules\Builder\Application\Services;

use App\Modules\Builder\Domain\Contracts\BuilderRepositoryInterface;
use App\Modules\Builder\Application\Data\BuilderData;
use App\Modules\Builder\Infrastructure\Database\Models\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class BuilderService
{
    public function __construct(
        protected BuilderRepositoryInterface $builderRepository
    ) {}

    public function getAllByUser(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->builderRepository->getAllByUser($userId, $perPage);
    }

    public function getById(int $id): ?Builder
    {
        return $this->builderRepository->getById($id);
    }

    public function create(BuilderData $data): Builder
    {
        return $this->builderRepository->create($data->toArray());
    }

    public function update(int $id, BuilderData $data): Builder
    {
        return $this->builderRepository->update($id, $data->toArray());
    }

    public function delete(int $id): bool
    {
        return $this->builderRepository->delete($id);
    }

    public function saveLayout(int $id, array $customData): Builder
    {
        return $this->builderRepository->updateCustomData($id, $customData);
    }

    public function renderPreview(int $id): string
    {
        $builder = $this->getById($id);
        if (!$builder) {
            throw new \Exception('Builder not found');
        }

        // Render HTML dari template + custom data
        $html = $this->generateHtml($builder);
        
        // Update rendered_html
        $this->builderRepository->updateRenderedHtml($id, $html);
        
        return $html;
    }

    private function generateHtml(Builder $builder): string
    {
        $template = $builder->template;
        $customData = $builder->custom_data_json ?? [];
        
        // Simple template engine - replace placeholders
        $html = $template->html_layout;
        
        foreach ($customData as $key => $value) {
            if (is_string($value)) {
                $html = str_replace('{{' . $key . '}}', $value, $html);
            }
        }
        
        return $html;
    }
}
