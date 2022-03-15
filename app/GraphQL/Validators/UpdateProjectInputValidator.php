<?php

namespace App\GraphQL\Validators;

use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

class UpdateProjectInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $projectId = Request::instance()->input('variables.id');
        return [
            'title' => ['string'],
            'slug' => [
                'alpha_dash',
                Rule::unique('projects', 'slug')->ignore($projectId, 'id'),
            ],
            'link' => ['url'],
        ];
    }

    public function messages(): array
    {
        return [
            'slug.unique' => 'This project slug is already in taken.',
        ];
    }
}
