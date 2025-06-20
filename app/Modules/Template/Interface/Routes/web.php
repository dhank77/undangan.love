<?php

use App\Modules\Template\Interface\Controllers\TemplateController;
use Illuminate\Support\Facades\Route;

Route::prefix('template')->name('template.')->group(function () {
    Route::get('/', [TemplateController::class, 'index'])->name('index');
    Route::get('/{id}', [TemplateController::class, 'show'])->name('show');
    Route::get('/{id}/preview', [TemplateController::class, 'preview'])->name('preview');
    
    Route::middleware('auth')->group(function () {
        Route::post('/', [TemplateController::class, 'store'])->name('store');
        Route::put('/{id}', [TemplateController::class, 'update'])->name('update');
        Route::delete('/{id}', [TemplateController::class, 'destroy'])->name('destroy');
    });
});
