<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Project::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'id' => $this->faker->uuid(),
            'title' => $this->faker->realText(50),
            'slug' => $this->faker->unique()->slug(),
            'content' => $this->faker->paragraphs(rand(2, 6), true),
            'link' => $this->faker->url(),
            'built_with' => [$this->faker->word(), $this->faker->word(), $this->faker->word()],
            'keywords' => [$this->faker->word(), $this->faker->word()],
            'description' => $this->faker->realText(20),
            'user_id' => User::factory()->create()->id,
        ];
    }
}
