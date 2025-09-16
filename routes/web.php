<?php

use App\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('company', CompanyController::class);
    Route::patch('companies/{company}/toggle', [CompanyController::class, 'toggleStatus'])->name('company.toggleStatus');


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
