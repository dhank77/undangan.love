<?php

declare(strict_types=1);

namespace App\Modules\Editor\Infrastructure\Repositories;

use App\Modules\Editor\Domain\Contracts\EditorRepositoryInterface;
use App\Modules\Editor\Infrastructure\Database\Models\Editor;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EditorRepository implements EditorRepositoryInterface
{
    /**
     * Get all editors by user with pagination
     */
    public function getAllByUser(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return Editor::byUser($userId)
            ->editors()
            ->orderBy('updated_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get editor by ID
     */
    public function getById(int $id): ?object
    {
        return Editor::find($id);
    }

    /**
     * Create new editor
     */
    public function create(array $data): object
    {
        return Editor::create(array_merge($data, ['is_template' => false]));
    }

    /**
     * Update editor
     */
    public function update(int $id, array $data): object
    {
        $editor = Editor::findOrFail($id);
        $editor->update($data);
        return $editor->fresh();
    }

    /**
     * Delete editor
     */
    public function delete(int $id): bool
    {
        $editor = Editor::findOrFail($id);
        return $editor->delete();
    }

    /**
     * Save editor as template
     */
    public function saveAsTemplate(array $data): object
    {
        return Editor::create(array_merge($data, ['is_template' => true]));
    }

    /**
     * Get user templates
     */
    public function getUserTemplates(int $userId): Collection
    {
        return Editor::byUser($userId)
            ->templates()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Count editors by user
     */
    public function countByUser(int $userId): int
    {
        return Editor::byUser($userId)->editors()->count();
    }

    /**
     * Count templates by user
     */
    public function countTemplatesByUser(int $userId): int
    {
        return Editor::byUser($userId)->templates()->count();
    }

    /**
     * Get recent editors by user
     */
    public function getRecentByUser(int $userId, int $limit = 5): Collection
    {
        return Editor::byUser($userId)
            ->editors()
            ->recent($limit)
            ->get();
    }
}
