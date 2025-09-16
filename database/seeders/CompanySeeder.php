<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */


    public function run(): void
    {
        Company::factory()
        ->count(25)
        ->create([
            'user_id' => $this->argiments['user_id'] ?? 1
        ]);
    }
}
