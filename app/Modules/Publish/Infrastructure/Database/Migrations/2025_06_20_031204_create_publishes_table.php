<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('publishes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('builder_id')->constrained()->onDelete('cascade');
            $table->string('subdomain')->unique(); // subdomain *.undanganmu.com
            $table->string('custom_domain')->nullable(); // domain custom
            $table->timestamp('published_at')->nullable();
            $table->enum('status', ['draft', 'published', 'unpublished'])->default('draft');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('publishes');
    }
};