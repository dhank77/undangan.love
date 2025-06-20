<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Editor\Interface\Controllers\EditorController;

Route::prefix('editor')->name('editor.')->middleware(['auth'])->group(function () {
    Route::get('/', [EditorController::class, 'index'])->name('index');
    Route::get('/create', [EditorController::class, 'create'])->name('create');
    Route::post('/save', [EditorController::class, 'save'])->name('save');
    Route::get('/{editor}', [EditorController::class, 'show'])->name('show');
    Route::put('/{editor}', [EditorController::class, 'update'])->name('update');
    Route::delete('/{editor}', [EditorController::class, 'destroy'])->name('destroy');
    
    // API routes for editor components
    Route::prefix('api')->name('api.')->group(function () {
        Route::get('/components', [EditorController::class, 'getComponents'])->name('components');
        Route::post('/upload-image', [EditorController::class, 'uploadImage'])->name('upload-image');
        Route::post('/save-template', [EditorController::class, 'saveTemplate'])->name('save-template');
        Route::get('/templates', [EditorController::class, 'getTemplates'])->name('templates');
    });
});
