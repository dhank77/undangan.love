<?php

declare(strict_types=1);

namespace App\Modules\Template\Application\Services;

use App\Modules\Template\Domain\Contracts\TemplateRepositoryInterface;
use App\Modules\Template\Application\Data\TemplateData;
use App\Modules\Template\Infrastructure\Database\Models\Template;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class TemplateService
{
    public function __construct(
        protected TemplateRepositoryInterface $templateRepository
    ) {}

    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return $this->templateRepository->getAll($perPage);
    }

    public function getFree(int $perPage = 10): LengthAwarePaginator
    {
        return $this->templateRepository->getFree($perPage);
    }

    public function getPremium(int $perPage = 10): LengthAwarePaginator
    {
        return $this->templateRepository->getPremium($perPage);
    }

    public function getById(int $id): ?Template
    {
        return $this->templateRepository->getById($id);
    }

    public function create(TemplateData $data): Template
    {
        return $this->templateRepository->create($data->toArray());
    }

    public function update(int $id, TemplateData $data): Template
    {
        return $this->templateRepository->update($id, $data->toArray());
    }

    public function delete(int $id): bool
    {
        return $this->templateRepository->delete($id);
    }

    public function preview(int $id): string
    {
        $template = $this->getById($id);
        if (!$template) {
            throw new \Exception('Template not found');
        }

        // Return HTML layout with sample data
        return $this->renderWithSampleData($template);
    }

    private function renderWithSampleData(Template $template): string
    {
        $sampleData = [
            'bride_name' => 'Sarah',
            'groom_name' => 'Ahmad',
            'wedding_date' => '15 Januari 2025',
            'wedding_time' => '09:00 WIB',
            'venue_name' => 'Gedung Serbaguna',
            'venue_address' => 'Jl. Merdeka No. 123, Jakarta',
            'message' => 'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami.'
        ];

        $html = $template->html_layout;
        
        foreach ($sampleData as $key => $value) {
            $html = str_replace('{{' . $key . '}}', $value, $html);
        }
        
        return $html;
    }
}
