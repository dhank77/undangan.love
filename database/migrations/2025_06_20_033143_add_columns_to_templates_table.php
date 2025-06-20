<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            $table->string('thumbnail_url')->nullable()->after('name');
            $table->text('html_layout')->after('thumbnail_url');
            $table->text('config_json')->nullable()->after('html_layout');
            $table->boolean('is_premium')->default(false)->after('config_json');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            $table->dropColumn(['thumbnail_url', 'html_layout', 'config_json', 'is_premium']);
        });
    }
};
