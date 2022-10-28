<?php

namespace App\GraphQL\Validators;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Request;
use Nuwave\Lighthouse\Validation\Validator;

class UpdateUserInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $userId = Request::instance()->input('variables.id');
        return [
            'name' => ['string'],
            'email' => [
                'email',
                Rule::unique('users', 'email')->ignore($userId, 'id'),
            ],
            'password' => ['confirmed', 'min:8'],
            'password_confirmation' => ['min:8'],
            'avatar' => ['string', 'nullable'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email address is already taken.',
        ];
    }
}
