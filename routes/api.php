<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StitchController;

Route::get('/stitch/status', [StitchController::class, 'getStatus']);

Route::post('/stitch/log', [StitchController::class, 'addLog']);
