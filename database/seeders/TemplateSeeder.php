<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Modules\Template\Infrastructure\Database\Models\Template;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Classic Elegant',
                'thumbnail_url' => 'https://via.placeholder.com/300x400/f8f9fa/6c757d?text=Classic+Elegant',
                'html_layout' => $this->getClassicTemplate(),
                'config_json' => json_encode([
                    'colors' => ['primary' => '#8B4513', 'secondary' => '#F5F5DC'],
                    'fonts' => ['heading' => 'serif', 'body' => 'sans-serif']
                ]),
                'is_premium' => false,
            ],
            [
                'name' => 'Modern Minimalist',
                'thumbnail_url' => 'https://via.placeholder.com/300x400/ffffff/333333?text=Modern+Minimalist',
                'html_layout' => $this->getModernTemplate(),
                'config_json' => json_encode([
                    'colors' => ['primary' => '#2C3E50', 'secondary' => '#ECF0F1'],
                    'fonts' => ['heading' => 'sans-serif', 'body' => 'sans-serif']
                ]),
                'is_premium' => false,
            ],
            [
                'name' => 'Floral Romance',
                'thumbnail_url' => 'https://via.placeholder.com/300x400/ffeef0/d63384?text=Floral+Romance',
                'html_layout' => $this->getFloralTemplate(),
                'config_json' => json_encode([
                    'colors' => ['primary' => '#D63384', 'secondary' => '#FFF0F5'],
                    'fonts' => ['heading' => 'cursive', 'body' => 'serif']
                ]),
                'is_premium' => true,
            ],
            [
                'name' => 'Royal Gold',
                'thumbnail_url' => 'https://via.placeholder.com/300x400/ffd700/000000?text=Royal+Gold',
                'html_layout' => $this->getRoyalTemplate(),
                'config_json' => json_encode([
                    'colors' => ['primary' => '#FFD700', 'secondary' => '#000000'],
                    'fonts' => ['heading' => 'serif', 'body' => 'serif']
                ]),
                'is_premium' => true,
            ],
        ];

        foreach ($templates as $template) {
            Template::create($template);
        }
    }

    private function getClassicTemplate(): string
    {
        return '
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Undangan Pernikahan</title>
    <style>
        body { font-family: Georgia, serif; margin: 0; padding: 20px; background: #f5f5dc; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .names { font-size: 2.5em; color: #8B4513; margin: 20px 0; }
        .date { font-size: 1.2em; color: #666; }
        .venue { margin: 20px 0; text-align: center; }
        .message { font-style: italic; text-align: center; margin: 30px 0; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #8B4513; margin-bottom: 10px;">Undangan Pernikahan</h1>
            <div class="names">{{bride_name}} & {{groom_name}}</div>
        </div>
        
        <div class="date">
            <strong>{{wedding_date}}</strong><br>
            Pukul {{wedding_time}}
        </div>
        
        <div class="venue">
            <h3 style="color: #8B4513;">{{venue_name}}</h3>
            <p>{{venue_address}}</p>
        </div>
        
        <div class="message">
            {{message}}
        </div>
    </div>
</body>
</html>';
    }

    private function getModernTemplate(): string
    {
        return '
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Undangan Pernikahan</title>
    <style>
        body { font-family: "Helvetica Neue", Arial, sans-serif; margin: 0; padding: 20px; background: #ecf0f1; }
        .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #2C3E50; color: white; padding: 40px 20px; text-align: center; }
        .content { padding: 40px 20px; }
        .names { font-size: 2em; font-weight: 300; margin: 20px 0; }
        .date { font-size: 1.1em; color: #2C3E50; font-weight: 500; }
        .venue { margin: 30px 0; }
        .message { color: #555; line-height: 1.8; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="font-weight: 300; margin: 0;">WEDDING INVITATION</h1>
        </div>
        
        <div class="content">
            <div class="names" style="text-align: center; color: #2C3E50;">
                {{bride_name}} & {{groom_name}}
            </div>
            
            <div class="date" style="text-align: center;">
                {{wedding_date}} | {{wedding_time}}
            </div>
            
            <div class="venue" style="text-align: center;">
                <h3 style="color: #2C3E50; font-weight: 500;">{{venue_name}}</h3>
                <p style="color: #666;">{{venue_address}}</p>
            </div>
            
            <div class="message" style="text-align: center;">
                {{message}}
            </div>
        </div>
    </div>
</body>
</html>';
    }

    private function getFloralTemplate(): string
    {
        return '
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Undangan Pernikahan</title>
    <style>
        body { font-family: "Times New Roman", serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #fff0f5, #ffeef0); }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 50px; border-radius: 20px; box-shadow: 0 8px 25px rgba(214,51,132,0.2); border: 2px solid #D63384; }
        .header { text-align: center; margin-bottom: 40px; position: relative; }
        .floral-border { border: 3px solid #D63384; border-radius: 15px; padding: 20px; margin: 20px 0; }
        .names { font-size: 2.8em; color: #D63384; margin: 25px 0; font-family: cursive; }
        .date { font-size: 1.3em; color: #8B4513; }
        .venue { margin: 30px 0; text-align: center; }
        .message { font-style: italic; text-align: center; margin: 40px 0; line-height: 1.8; color: #555; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #D63384; margin-bottom: 15px; font-family: cursive;">🌸 Undangan Pernikahan 🌸</h1>
        </div>
        
        <div class="floral-border">
            <div class="names" style="text-align: center;">
                {{bride_name}} & {{groom_name}}
            </div>
        </div>
        
        <div class="date" style="text-align: center;">
            <strong>{{wedding_date}}</strong><br>
            Pukul {{wedding_time}}
        </div>
        
        <div class="venue">
            <h3 style="color: #D63384;">🏛️ {{venue_name}}</h3>
            <p style="color: #666;">{{venue_address}}</p>
        </div>
        
        <div class="message">
            {{message}}
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #D63384;">
            🌹 ❤️ 🌹
        </div>
    </div>
</body>
</html>';
    }

    private function getRoyalTemplate(): string
    {
        return '
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Undangan Pernikahan</title>
    <style>
        body { font-family: "Times New Roman", serif; margin: 0; padding: 20px; background: linear-gradient(45deg, #000000, #1a1a1a); }
        .container { max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #FFD700, #FFA500); padding: 60px; border-radius: 0; box-shadow: 0 10px 30px rgba(255,215,0,0.3); border: 5px solid #FFD700; }
        .inner { background: black; color: #FFD700; padding: 40px; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 40px; }
        .crown { font-size: 3em; margin-bottom: 20px; }
        .names { font-size: 3em; margin: 30px 0; text-shadow: 2px 2px 4px rgba(255,215,0,0.5); }
        .date { font-size: 1.4em; }
        .venue { margin: 30px 0; text-align: center; }
        .message { font-style: italic; text-align: center; margin: 40px 0; line-height: 1.8; }
        .royal-border { border: 2px solid #FFD700; padding: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="inner">
            <div class="header">
                <div class="crown">👑</div>
                <h1 style="margin: 0; font-size: 2em;">ROYAL WEDDING INVITATION</h1>
            </div>
            
            <div class="royal-border">
                <div class="names" style="text-align: center;">
                    {{bride_name}} & {{groom_name}}
                </div>
            </div>
            
            <div class="date" style="text-align: center;">
                <strong>{{wedding_date}}</strong><br>
                Pukul {{wedding_time}}
            </div>
            
            <div class="venue">
                <h3 style="font-size: 1.5em;">🏰 {{venue_name}}</h3>
                <p>{{venue_address}}</p>
            </div>
            
            <div class="message">
                {{message}}
            </div>
            
            <div style="text-align: center; margin-top: 30px; font-size: 1.5em;">
                ✨ 👑 ✨
            </div>
        </div>
    </div>
</body>
</html>';
    }
}
