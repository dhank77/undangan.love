<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Daftarkan middleware aliases
        
        // Load module routes
        $this->loadModuleRoutes();
    }
    
    private function loadModuleRoutes(): void
    {
        $modulesPath = app_path('Modules');
        
        if (is_dir($modulesPath)) {
            $modules = scandir($modulesPath);
            
            foreach ($modules as $module) {
                if ($module === '.' || $module === '..') continue;
                
                $routePath = $modulesPath . '/' . $module . '/Interface/Routes/web.php';
                
                if (file_exists($routePath)) {
                    Route::middleware('web')->group($routePath);
                }
            }
        }
    }
}
