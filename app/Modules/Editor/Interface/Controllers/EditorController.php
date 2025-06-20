<?php

declare(strict_types=1);

namespace App\Modules\Editor\Interface\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Editor\Application\Services\EditorService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class EditorController extends Controller
{
    public function __construct(
        protected EditorService $editorService
    ) {}

    /**
     * Display the editor index page
     */
    public function index(): Response
    {
        return Inertia::render('editor/index', [
            'editors' => $this->editorService->getAllByUser(auth()->user()->id)
        ]);
    }

    /**
     * Show the form for creating a new editor
     */
    public function create(): Response
    {
        return Inertia::render('editor/create', [
            'components' => $this->getAvailableComponents()
        ]);
    }

    /**
     * Display the specified editor
     */
    public function show(int $id): Response
    {
        $editor = $this->editorService->getById($id);
        
        if (!$editor) {
            abort(404);
        }

        return Inertia::render('editor/show', [
            'editor' => $editor,
            'components' => $this->getAvailableComponents()
        ]);
    }

    /**
     * Save editor content
     */
    public function save(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|array',
            'html' => 'required|string',
            'css' => 'nullable|string',
        ]);

        $editor = $this->editorService->create([
            'user_id' => auth()->user()->id,
            'name' => $validated['name'],
            'content' => $validated['content'],
            'html' => $validated['html'],
            'css' => $validated['css'] ?? '',
        ]);

        return response()->json([
            'success' => true,
            'editor' => $editor,
            'message' => 'Editor saved successfully'
        ]);
    }

    /**
     * Update the specified editor
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'content' => 'sometimes|array',
            'html' => 'sometimes|string',
            'css' => 'nullable|string',
        ]);

        $editor = $this->editorService->update($id, $validated);

        return response()->json([
            'success' => true,
            'editor' => $editor,
            'message' => 'Editor updated successfully'
        ]);
    }

    /**
     * Remove the specified editor
     */
    public function destroy(int $id): JsonResponse
    {
        $this->editorService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'Editor deleted successfully'
        ]);
    }

    /**
     * Get available editor components
     */
    public function getComponents(): JsonResponse
    {
        return response()->json([
            'components' => $this->getAvailableComponents()
        ]);
    }

    /**
     * Upload image for editor
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        /** @var UploadedFile $image */
        $image = $request->file('image');
        $path = $image->store('editor-images', 'public');
        $url = Storage::url($path);

        return response()->json([
            'success' => true,
            'url' => $url,
            'path' => $path
        ]);
    }

    /**
     * Save template
     */
    public function saveTemplate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|array',
            'html' => 'required|string',
            'css' => 'nullable|string',
            'thumbnail' => 'nullable|string'
        ]);

        $template = $this->editorService->saveAsTemplate([
            'user_id' => auth()->user()->id,
            'name' => $validated['name'],
            'content' => $validated['content'],
            'html' => $validated['html'],
            'css' => $validated['css'] ?? '',
            'thumbnail' => $validated['thumbnail'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'template' => $template,
            'message' => 'Template saved successfully'
        ]);
    }

    /**
     * Get user templates
     */
    public function getTemplates(): JsonResponse
    {
        return response()->json([
            'templates' => $this->editorService->getUserTemplates(auth()->user()->id)
        ]);
    }

    /**
     * Get available components for the editor
     */
    private function getAvailableComponents(): array
    {
        return [
            [
                'id' => 'text-block',
                'name' => 'Text Block',
                'category' => 'basic',
                'icon' => 'text',
                'description' => 'Add text content with formatting options',
                'defaultProps' => [
                    'text' => 'Your text here...',
                    'fontSize' => '16px',
                    'color' => '#000000',
                    'textAlign' => 'left',
                    'fontWeight' => 'normal'
                ]
            ],
            [
                'id' => 'image-block',
                'name' => 'Image Block',
                'category' => 'media',
                'icon' => 'image',
                'description' => 'Add images with customizable properties',
                'defaultProps' => [
                    'src' => '',
                    'alt' => 'Image',
                    'width' => '100%',
                    'height' => 'auto',
                    'borderRadius' => '0px'
                ]
            ],
            [
                'id' => 'gallery',
                'name' => 'Gallery',
                'category' => 'media',
                'icon' => 'images',
                'description' => 'Create image galleries with multiple photos',
                'defaultProps' => [
                    'images' => [],
                    'columns' => 3,
                    'spacing' => '10px',
                    'showThumbnails' => true
                ]
            ],
            [
                'id' => 'rsvp-form',
                'name' => 'RSVP Form',
                'category' => 'forms',
                'icon' => 'form',
                'description' => 'Add RSVP form for guest responses',
                'defaultProps' => [
                    'title' => 'RSVP',
                    'fields' => ['name', 'email', 'attendance', 'guests'],
                    'submitText' => 'Submit RSVP',
                    'successMessage' => 'Thank you for your RSVP!'
                ]
            ],
            [
                'id' => 'countdown-timer',
                'name' => 'Countdown Timer',
                'category' => 'interactive',
                'icon' => 'clock',
                'description' => 'Add countdown timer to event date',
                'defaultProps' => [
                    'targetDate' => '',
                    'format' => 'days-hours-minutes-seconds',
                    'labels' => ['Days', 'Hours', 'Minutes', 'Seconds'],
                    'fontSize' => '24px',
                    'color' => '#000000'
                ]
            ],
            [
                'id' => 'map',
                'name' => 'Map',
                'category' => 'location',
                'icon' => 'map',
                'description' => 'Embed location map',
                'defaultProps' => [
                    'address' => '',
                    'zoom' => 15,
                    'height' => '300px',
                    'showMarker' => true,
                    'mapType' => 'roadmap'
                ]
            ],
            [
                'id' => 'background-music-player',
                'name' => 'Background Music Player',
                'category' => 'media',
                'icon' => 'music',
                'description' => 'Add background music player',
                'defaultProps' => [
                    'audioUrl' => '',
                    'autoplay' => false,
                    'loop' => true,
                    'volume' => 0.5,
                    'showControls' => true
                ]
            ]
        ];
    }
}
