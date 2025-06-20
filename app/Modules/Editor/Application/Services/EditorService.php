<?php

declare(strict_types=1);

namespace App\Modules\Editor\Application\Services;

use App\Modules\Editor\Domain\Contracts\EditorRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EditorService
{
    public function __construct(
        protected EditorRepositoryInterface $editorRepository
    ) {}

    /**
     * Get all editors by user
     */
    public function getAllByUser(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->editorRepository->getAllByUser($userId, $perPage);
    }

    /**
     * Get editor by ID
     */
    public function getById(int $id): ?object
    {
        return $this->editorRepository->getById($id);
    }

    /**
     * Create new editor
     */
    public function create(array $data): object
    {
        return $this->editorRepository->create($data);
    }

    /**
     * Update editor
     */
    public function update(int $id, array $data): object
    {
        return $this->editorRepository->update($id, $data);
    }

    /**
     * Delete editor
     */
    public function delete(int $id): bool
    {
        return $this->editorRepository->delete($id);
    }

    /**
     * Save editor as template
     */
    public function saveAsTemplate(array $data): object
    {
        return $this->editorRepository->saveAsTemplate($data);
    }

    /**
     * Get user templates
     */
    public function getUserTemplates(int $userId): Collection
    {
        return $this->editorRepository->getUserTemplates($userId);
    }

    /**
     * Duplicate editor
     */
    public function duplicate(int $id, string $newName): object
    {
        $editor = $this->getById($id);
        
        if (!$editor) {
            throw new \Exception('Editor not found');
        }

        return $this->create([
            'user_id' => $editor->user_id,
            'name' => $newName,
            'content' => $editor->content,
            'html' => $editor->html,
            'css' => $editor->css,
        ]);
    }

    /**
     * Get editor statistics
     */
    public function getStatistics(int $userId): array
    {
        return [
            'total_editors' => $this->editorRepository->countByUser($userId),
            'total_templates' => $this->editorRepository->countTemplatesByUser($userId),
            'recent_editors' => $this->editorRepository->getRecentByUser($userId, 5),
        ];
    }
}
