<?php

namespace App\GraphQL\Validators;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Request;
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
            'subtitle' => ['string'],
            'slug' => [
                'alpha_dash',
                Rule::unique('projects', 'slug')->ignore($projectId, 'id'),
            ],
            'link' => ['url'],
            'start' => ['before:end', 'nullable'],
            'end' => ['after:start', 'nullable'],
            'work_done' => ['string', 'nullable'],
            'description' => ['string', 'nullable'],
        ];
    }

    public function messages(): array
    {
        return [
            'slug.unique' => 'This project slug is already in taken.',
        ];
    }
}
