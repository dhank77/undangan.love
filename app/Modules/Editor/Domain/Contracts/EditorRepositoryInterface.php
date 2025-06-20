<?php

declare(strict_types=1);

namespace App\Modules\Editor\Domain\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface EditorRepositoryInterface
{
    /**
     * Get all editors by user with pagination
     */
    public function getAllByUser(int $userId, int $perPage = 10): LengthAwarePaginator;

    /**
     * Get editor by ID
     */
    public function getById(int $id): ?object;

    /**
     * Create new editor
     */
    public function create(array $data): object;

    /**
     * Update editor
     */
    public function update(int $id, array $data): object;

    /**
     * Delete editor
     */
    public function delete(int $id): bool;

    /**
     * Save editor as template
     */
    public function saveAsTemplate(array $data): object;

    /**
     * Get user templates
     */
    public function getUserTemplates(int $userId): Collection;

    /**
     * Count editors by user
     */
    public function countByUser(int $userId): int;

    /**
     * Count templates by user
     */
    public function countTemplatesByUser(int $userId): int;

    /**
     * Get recent editors by user
     */
    public function getRecentByUser(int $userId, int $limit = 5): Collection;
}
