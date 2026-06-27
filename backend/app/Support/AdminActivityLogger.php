<?php

namespace App\Support;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Throwable;

class AdminActivityLogger
{
    private static ?bool $schemaReady = null;

    private const SENSITIVE_KEYS = [
        'password',
        'remember_token',
        'token',
        'secret',
        'api_key',
    ];

    public static function created(Model $model): void
    {
        self::write('created', $model, null, self::filter($model->getAttributes()));
    }

    public static function updated(Model $model): void
    {
        $changes = self::filter($model->getChanges());
        unset($changes['updated_at']);

        if ($changes === []) {
            return;
        }

        $before = [];
        foreach (array_keys($changes) as $key) {
            $before[$key] = $model->getOriginal($key);
        }

        self::write('updated', $model, self::filter($before), $changes);
    }

    public static function deleted(Model $model): void
    {
        self::write('deleted', $model, self::filter($model->getOriginal()), null);
    }

    private static function write(string $event, Model $model, ?array $before, ?array $after): void
    {
        if (! Auth::check()) {
            return;
        }

        if (! self::isSchemaReady()) {
            Log::warning('Admin activity log skipped because the activity_logs schema is not ready.');

            return;
        }

        $request = request();

        try {
            DB::transaction(function () use ($event, $model, $before, $after, $request): void {
                $previousChecksum = ActivityLog::query()
                    ->lockForUpdate()
                    ->latest('id')
                    ->value('checksum');

                $payload = [
                    'user_id' => Auth::id(),
                    'event' => $event,
                    'model_type' => $model::class,
                    'model_id' => $model->getKey(),
                    'before_values' => $before,
                    'after_values' => $after,
                    'ip_address' => $request->ip(),
                    'user_agent' => substr((string) $request->userAgent(), 0, 512),
                    'previous_checksum' => $previousChecksum,
                ];

                ActivityLog::create($payload + [
                    'checksum' => self::checksum($payload),
                ]);
            });
        } catch (Throwable $exception) {
            Log::error('Admin activity log write failed.', [
                'event' => $event,
                'model_type' => $model::class,
                'model_id' => $model->getKey(),
                'exception' => $exception->getMessage(),
            ]);
        }
    }

    private static function isSchemaReady(): bool
    {
        if (self::$schemaReady !== null) {
            return self::$schemaReady;
        }

        try {
            return self::$schemaReady = Schema::hasTable('activity_logs')
                && Schema::hasColumn('activity_logs', 'checksum')
                && Schema::hasColumn('activity_logs', 'previous_checksum');
        } catch (Throwable) {
            return self::$schemaReady = false;
        }
    }

    private static function checksum(array $payload): string
    {
        ksort($payload);

        return hash_hmac(
            'sha256',
            json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            (string) config('app.key')
        );
    }

    private static function filter(array $values): array
    {
        return collect($values)
            ->reject(fn ($value, string $key): bool => self::isSensitive($key))
            ->map(fn ($value) => is_string($value) && strlen($value) > 2000 ? substr($value, 0, 2000) : $value)
            ->all();
    }

    private static function isSensitive(string $key): bool
    {
        foreach (self::SENSITIVE_KEYS as $sensitiveKey) {
            if (str_contains(strtolower($key), $sensitiveKey)) {
                return true;
            }
        }

        return false;
    }
}
