<?php

namespace App\Policies;

use App\Models\Book;
use App\Models\User;

class BookPolicy
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

    public function view(User $user, Book $book): bool
    {
        return $this->canManageContent($user);
    }

    public function create(User $user): bool
    {
        return $this->canManageContent($user);
    }

    public function update(User $user, Book $book): bool
    {
        return $this->canManageContent($user);
    }

    public function delete(User $user, Book $book): bool
    {
        return $user->isSuperAdmin();
    }

    public function restore(User $user, Book $book): bool
    {
        return $user->isSuperAdmin();
    }

    public function forceDelete(User $user, Book $book): bool
    {
        return $user->isSuperAdmin();
    }
}
