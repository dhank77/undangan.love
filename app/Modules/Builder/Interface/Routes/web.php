<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Builder\Interface\Controllers\BuilderController;

Route::group(['prefix' => 'builder', 'middleware' => ['auth']], function () {
    Route::get('/', [BuilderController::class, 'index'])->name('builder.index');
    Route::post('/', [BuilderController::class, 'store'])->name('builder.store');
    Route::get('/{builder}', [BuilderController::class, 'show'])->name('builder.show');
    Route::get('/{builder}/edit', [BuilderController::class, 'edit'])->name('builder.edit');
    Route::get('/{builder}/visual', [BuilderController::class, 'visual'])->name('builder.visual');
    Route::post('/{builder}/save-layout', [BuilderController::class, 'saveLayout'])->name('builder.save-layout');
    Route::put('/{builder}', [BuilderController::class, 'update'])->name('builder.update');
    Route::delete('/{builder}', [BuilderController::class, 'destroy'])->name('builder.destroy');
});
