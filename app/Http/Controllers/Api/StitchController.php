<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StitchLog;
use Illuminate\Http\Request;

class StitchController extends Controller
{
    public function getStatus()
    {
        $totalPoints = StitchLog::sum('points');

        $history = StitchLog::latest()->take(10)->get();

        return response()->json([
            'totola_points' => $totalPoints,
            'history' => $history
        ]);
    }

    public function addLog(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'points' => 'required"integer',
        ]);

        StitchLog::create($validated);

        return $this->getStatus();
    }
}
