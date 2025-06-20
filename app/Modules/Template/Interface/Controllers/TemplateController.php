<?php

declare(strict_types=1);

namespace App\Modules\Template\Interface\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Template\Application\Services\TemplateService;
use App\Modules\Template\Application\Data\TemplateData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Response;

class TemplateController extends Controller
{

    public function __construct(
        protected TemplateService $templateService
    ) {}

    public function index(Request $request): Response 
    {
        $type = $request->get('type', 'all'); // all, free, premium
        $perPage = $request->get('per_page', 12);
        
        $templates = match($type) {
            'free' => $this->templateService->getFree($perPage),
            'premium' => $this->templateService->getPremium($perPage),
            default => $this->templateService->getAll($perPage)
        };
        
        return inertia('template/index', [
            'templates' => $templates,
            'type' => $type
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $template = $this->templateService->getById($id);
        
        if (!$template) {
            return response()->json(['message' => 'Template not found'], 404);
        }
        
        return response()->json($template);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|min:3|max:255',
            'thumbnail_url' => 'nullable|string|url',
            'html_layout' => 'required|string',
            'config_json' => 'nullable|array',
            'is_premium' => 'boolean'
        ]);
        
        $templateData = TemplateData::from($validated);
        $template = $this->templateService->create($templateData);
        
        return response()->json($template, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|min:3|max:255',
            'thumbnail_url' => 'nullable|string|url',
            'html_layout' => 'sometimes|required|string',
            'config_json' => 'nullable|array',
            'is_premium' => 'boolean'
        ]);
        
        $templateData = TemplateData::from($validated);
        $template = $this->templateService->update($id, $templateData);
        
        return response()->json($template);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->templateService->delete($id);
        
        if (!$deleted) {
            return response()->json(['message' => 'Template not found'], 404);
        }
        
        return response()->json(['message' => 'Template deleted successfully']);
    }

    public function preview(int $id): JsonResponse
    {
        try {
            $html = $this->templateService->preview($id);
            return response()->json(['html' => $html]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

}
