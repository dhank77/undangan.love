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
        Schema::create('editors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->json('content')->nullable(); // GrapesJS editor content
            $table->longText('html')->nullable(); // Generated HTML
            $table->longText('css')->nullable(); // Generated CSS
            $table->boolean('is_template')->default(false);
            $table->string('thumbnail')->nullable(); // Template thumbnail
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'is_template']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('editors');
    }
};