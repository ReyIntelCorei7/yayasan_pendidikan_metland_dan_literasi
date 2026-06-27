<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    private function canManageContent(User $user): bool
    {
        return $user->isSuperAdmin() || $user->isAdminKonten();
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $this->canManageContent($user);
    }

    public function view(User $user, Post $post): bool
    {
        return $this->canManageContent($user);
    }

    public function create(User $user): bool
    {
        return $this->canManageContent($user);
    }

    public function update(User $user, Post $post): bool
    {
        return $this->canManageContent($user);
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->isSuperAdmin();
    }

    public function restore(User $user, Post $post): bool
    {
        return $user->isSuperAdmin();
    }

    public function forceDelete(User $user, Post $post): bool
    {
        return $user->isSuperAdmin();
    }
}
