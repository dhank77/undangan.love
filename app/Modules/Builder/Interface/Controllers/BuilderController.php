<?php

declare(strict_types=1);

namespace App\Modules\Builder\Interface\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Builder\Application\Services\BuilderService;
use App\Modules\Builder\Application\Data\BuilderData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class BuilderController extends Controller
{
    public function __construct(
        protected BuilderService $builderService
    ) {}

    public function index(Request $request): Response
    {
        $templateId = $request->get('template_id');
        $builderId = $request->get('builder_id');
        
        if ($templateId || $builderId) {
            $builder = null;
            if ($builderId) {
                $builder = $this->builderService->getById($builderId);
                if ($builder) {
                    $builder->load(['template']);
                }
            }
            
            return Inertia::render('builder/index', [
                'builder' => $builder,
                'template_id' => $templateId ? (int)$templateId : null,
            ]);
        }
        
        // Jika tidak ada parameter, tampilkan daftar builders
        $builders = $this->builderService->getAllByUser(
            $request->user()->id,
            $request->get('per_page', 10)
        );

        return Inertia::render('builder/index', [
            'builders' => $builders
        ]);
    }

    public function show(int $id): Response
    {
        $builder = $this->builderService->getById($id);
        
        if (!$builder) {
            abort(404);
        }

        return Inertia::render('builder/index', [
            'builder' => $builder->load(['template']),
            'template_id' => $builder->template_id
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = BuilderData::from($request->all());
        $builder = $this->builderService->create($data);

        return response()->json([
            'success' => true,
            'data' => $builder
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = BuilderData::from($request->all());
        $builder = $this->builderService->update($id, $data);

        return response()->json([
            'success' => true,
            'data' => $builder
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $success = $this->builderService->delete($id);

        return response()->json([
            'success' => $success
        ]);
    }

    public function visual(int $id): Response
    {
        $builder = $this->builderService->getById($id);
        
        if (!$builder) {
            abort(404);
        }

        return Inertia::render('builder/visual-editor', [
            'builder' => $builder->load(['template'])
        ]);
    }

    public function saveLayout(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'html_layout' => 'nullable|string',
            'css_styles' => 'nullable|string',
            'rendered_html' => 'nullable|string',
            'custom_data_json' => 'nullable|array',
        ]);

        $data = [
            'html_layout' => $request->get('html_layout'),
            'css_styles' => $request->get('css_styles'),
            'rendered_html' => $request->get('rendered_html'),
            'custom_data_json' => $request->get('custom_data_json', []),
        ];
        
        $builder = $this->builderService->saveLayout($id, $data);

        return response()->json([
            'success' => true,
            'data' => $builder
        ]);
    }

    public function preview(int $id): Response
    {
        $html = $this->builderService->renderPreview($id);
        
        return Inertia::render('builder/preview', [
            'html' => $html
        ]);
    }

    public function renderHtml(int $id): JsonResponse
    {
        $html = $this->builderService->renderPreview($id);
        
        return response()->json([
            'html' => $html
        ]);
    }
}
