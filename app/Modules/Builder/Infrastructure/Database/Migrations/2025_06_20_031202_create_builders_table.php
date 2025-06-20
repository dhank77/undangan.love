<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('builders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('template_id')->constrained()->onDelete('cascade');
            $table->json('custom_data_json')->nullable(); // semua konten dan layout
            $table->longText('rendered_html')->nullable(); // HTML yang dirender
            $table->string('name')->nullable(); // nama project
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('builders');
    }
};
