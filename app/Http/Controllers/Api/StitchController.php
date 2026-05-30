<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StitchLog;
use Illuminate\Http\Request;

class StitchController extends Controller
{
    public function getStatus()
    {
        // Принудительно приводим к числу. Если записей нет, вернется 0
        $totalPoints = (int) StitchLog::sum('points');

        $history = StitchLog::latest()->take(10)->get();

        return response()->json([
            'total_points' => $totalPoints,
            'history' => $history
        ]);
    }

    public function addLog(Request $request)
    {
        // Берем данные напрямую из запроса
        $description = $request->input('description', 'Без описания');
        $points = (int) $request->input('points', 0);

        // Явно создаем запись через Eloquent
        $log = new StitchLog();
        $log->description = $description;
        $log->points = $points;
        $log->save();

        // Сразу же пересчитываем заново и возвращаем обновленный статус
        return $this->getStatus();
    }
}
