<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::factory()->create([
            'name' => 'User 1',
            'email' => 'user1@mail.com',
            'password' => Hash::make('12345678'),
        ]);

        $this->call(CompanySeeder::class, false, ['user_id' => $user->id]);
    }
}
