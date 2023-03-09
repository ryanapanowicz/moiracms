<?php

namespace Tests\Integration\GraphQL;

use Tests\TestCase;
use App\Models\Project;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;

class Projects extends TestCase
{
    use RefreshDatabase;

    const PARAMETERS = [
        'id',
        'title',
        'subtitle',
        'slug',
        'content',
        'link',
        'work_done',
        'built_with',
        'keywords',
        'description',
        'start',
        'end',
        'created_at',
        'updated_at',
    ];

    /**
     * Helper to get GraphQL parameters for Project
     *
     */
    protected function projectGraphQL(): string
    {
        $parameters = self::PARAMETERS;
        $parameters[] = "featured {\n" . implode("\n", Assets::PARAMETERS) . "\n}";
        $parameters[] = "assets {\n" . implode("\n", Assets::PARAMETERS) . "\n}";

        return implode("\n", $parameters);
    }

    /**
     * Static method for getting Project values for assert
     * 
     */
    protected function projectParameters(Model $project): array
    {
        $data = $project->only(self::PARAMETERS);
        $data['start'] = $project->start->format('Y-m-d');
        $data['end'] = $project->end->format('Y-m-d');
        $data['created_at'] = $project->created_at->format('Y-m-d H:i:s');
        $data['updated_at'] = $project->updated_at->format('Y-m-d H:i:s');

        return $data;
    }

    /**
     * Test all Projects GraphQL query
     *
     * @return void
     */
    public function testQueryProjects(): void
    {
        $admin = $this->createAuthAdmin();
        $photo = $this->generatePhoto($admin);

        $project = Project::factory()->afterCreating(function ($model) use ($photo) {
            $model->assets()->attach($photo->id);
        })->create([
                'featured_id' => $photo->id,
            ]);

        $project_alt = Project::factory()->create();

        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            query {
                projects {
                    data { ' . $this->projectGraphQL() . ' }
                }
            }
            '
        )->assertJson([
                'data' => [
                    'projects' => [
                        'data' => [
                            $this->projectParameters($project),
                            $this->projectParameters($project_alt),
                        ]
                    ]
                ]
            ]);
    }

    /**
     * Test single Project GraphQL query
     * 
     */
    public function testQueryProject(): void
    {
        $admin = $this->createAuthAdmin();
        $photo = $this->generatePhoto($admin);

        $project = Project::factory()->afterCreating(function ($model) use ($photo) {
            $model->assets()->attach($photo->id);
        })->create([
                'featured_id' => $photo->id,
            ]);

        $this->graphQL(
            /** @lang GraphQL */
            '
        query {
            project(id: "' . $project->id . '") { ' . $this->projectGraphQL() . ' }
        }
        '
        )->assertJson([
                'data' => [
                    'project' => $this->projectParameters($project),
                ]
            ]);
    }

    /**
     * Test create Project GraphQL mutation
     * 
     */
    public function testMutationCreateProject(): void
    {
        $admin = $this->createAuthAdmin();
        $photo = $this->generatePhoto($admin);

        $response = $this->graphQL(
            /** @lang GraphQL */
            '
        mutation {
            createProject(input: {
                title: "Testing 123",
                subtitle: "Testing",
                content: "Testing Content.",
                featured: "' . $photo->id . '",
                link: "http://www.moiracms.com",
                work_done: "Some work description",
                built_with: ["Laravel", "React"],
                keywords: ["Test", "Tester"],
                description: "Testing 123"
                start: "2023-01-01",
                end: "2023-12-01",
                assets: ["' . $photo->id . '"],
            }) {
                project { ' . $this->projectGraphQL() . ' }
            }
        }
        '
        );

        $result = Project::all()->last();

        $response->assertJson([
            'data' => [
                'createProject' => [
                    'project' => [
                        'id' => $result->id,
                        'title' => 'Testing 123',
                        'subtitle' => 'Testing',
                        'slug' => 'testing-123',
                        'content' => 'Testing Content.',
                        'featured' => $photo->only(Assets::PARAMETERS),
                        'link' => 'http://www.moiracms.com',
                        'work_done' => 'Some work description',
                        'built_with' => ['Laravel', 'React'],
                        'keywords' => ['Test', 'Tester'],
                        'description' => 'Testing 123',
                        'start' => '2023-01-01',
                        'end' => '2023-12-01',
                        'assets' => [
                            $photo->only(Assets::PARAMETERS)
                        ],
                    ]
                ]
            ]
        ]);
    }

    /**
     * Test update Project GraphQL mutation
     * 
     */
    public function testMutationUpdateProject(): void
    {
        $admin = $this->createAuthAdmin();
        $photo = $this->generatePhoto($admin);

        $project = Project::factory()->create();

        $response = $this->graphQL(
            /** @lang GraphQL */
            '
        mutation {
            updateProject(id: "' . $project->id . '", input: {
                title: "Testing 123",
                subtitle: "Testing",
                slug: "testing-123",
                content: "Testing Content.",
                featured: "' . $photo->id . '",
                link: "http://www.moiracms.com",
                work_done: "Some work description",
                built_with: ["Laravel", "React"],
                keywords: ["Test", "Tester"],
                description: "Testing 123"
                start: "2023-01-01",
                end: "2023-12-01",
                assets: ["' . $photo->id . '"],
            }) {
                project { ' . $this->projectGraphQL() . ' }
            }
        }
        '
        );

        $response->assertJson([
            'data' => [
                'updateProject' => [
                    'project' => [
                        'id' => $project->id,
                        'title' => 'Testing 123',
                        'subtitle' => 'Testing',
                        'slug' => 'testing-123',
                        'content' => 'Testing Content.',
                        'featured' => $photo->only(Assets::PARAMETERS),
                        'link' => 'http://www.moiracms.com',
                        'work_done' => 'Some work description',
                        'built_with' => ['Laravel', 'React'],
                        'keywords' => ['Test', 'Tester'],
                        'description' => 'Testing 123',
                        'start' => '2023-01-01',
                        'end' => '2023-12-01',
                        'assets' => [
                            $photo->only(Assets::PARAMETERS)
                        ],
                    ]
                ]
            ]
        ]);
    }

    /**
     * Test delete Project GraphQL mutation
     * 
     */
    public function testMutationDeleteProject(): void
    {
        $admin = $this->createAuthAdmin();
        $photo = $this->generatePhoto($admin);

        $project = Project::factory()->afterCreating(function ($model) use ($photo) {
            $model->assets()->attach($photo->id);
        })->create([
                'featured_id' => $photo->id,
            ]);


        $response = $this->graphQL(
            /** @lang GraphQL */
            '
        mutation {
            deleteProject(id: "' . $project->id . '") {
                project { ' . $this->projectGraphQL() . ' }
            }
        }
        '
        );

        $this->assertDatabaseMissing($project->getTable(), ['id' => $project->id]);

        $response->assertJson([
            'data' => [
                'deleteProject' => [
                    'project' => $this->projectParameters($project),
                ]
            ]
        ]);
    }
}