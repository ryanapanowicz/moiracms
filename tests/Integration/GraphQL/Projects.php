<?php

namespace Tests\Integration\GraphQL;

use Tests\TestCase;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;

class Projects extends TestCase
{
    use RefreshDatabase;

    /**
     * Test all Projects GraphQL query
     *
     * @return void
     */
    public function testQueryProjects(): void
    {
        $project = Project::factory()->create();
        $project_alt = Project::factory()->create();

        $this->graphQL(
            /** @lang GraphQL */
            '
        query {
            projects {
                data {
                    id
                    title
                    subtitle
                    slug
                    content
                    link
                    work_done
                    built_with
                    keywords
                    description
                    start
                    end
                }
            }
        }
        '
        )->assertJson([
                'data' => [
                    'projects' => [
                        'data' => [
                            [
                                'id' => $project->id,
                                'title' => $project->title,
                                'subtitle' => $project->subtitle,
                                'slug' => $project->slug,
                                'content' => $project->content,
                                'link' => $project->link,
                                'work_done' => $project->work_done,
                                'built_with' => $project->built_with,
                                'keywords' => $project->keywords,
                                'description' => $project->description,
                                'start' => $project->start->format('Y-m-d'),
                                'end' => $project->end->format('Y-m-d'),
                            ],
                            [
                                'id' => $project_alt->id,
                                'title' => $project_alt->title,
                                'subtitle' => $project_alt->subtitle,
                                'slug' => $project_alt->slug,
                                'content' => $project_alt->content,
                                'link' => $project_alt->link,
                                'work_done' => $project_alt->work_done,
                                'built_with' => $project_alt->built_with,
                                'keywords' => $project_alt->keywords,
                                'description' => $project_alt->description,
                                'start' => $project_alt->start->format('Y-m-d'),
                                'end' => $project_alt->end->format('Y-m-d'),
                            ]
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

        $project = Project::factory()->create();

        $this->graphQL(
            /** @lang GraphQL */
            '
        query {
            project(id: "' . $project->id . '") {
                id
                title
                subtitle
                slug
                content
                link
                work_done
                built_with
                keywords
                description
                start
                end
            }
        }
        '
        )->assertJson([
                'data' => [
                    'project' => [
                        'id' => $project->id,
                        'title' => $project->title,
                        'subtitle' => $project->subtitle,
                        'slug' => $project->slug,
                        'content' => $project->content,
                        'link' => $project->link,
                        'work_done' => $project->work_done,
                        'built_with' => $project->built_with,
                        'keywords' => $project->keywords,
                        'description' => $project->description,
                        'start' => $project->start->format('Y-m-d'),
                        'end' => $project->end->format('Y-m-d'),
                    ]
                ]
            ]);
    }

    /**
     * Test create Project GraphQL mutation
     * 
     */
    public function testMutationCreateProject(): void
    {
        $this->createAuthAdmin();

        $response = $this->graphQL(
            /** @lang GraphQL */
            '
        mutation {
            createProject(input: {
                title: "Testing 123",
                subtitle: "Testing",
                content: "Testing Content.",
                link: "http://www.moiracms.com",
                work_done: "Some work description",
                built_with: ["Laravel", "React"],
                keywords: ["Test", "Tester"],
                description: "Testing 123"
                start: "2023-01-01",
                end: "2023-12-01",
            }) {
                project {
                    id
                    title
                    subtitle
                    slug
                    content
                    link
                    work_done
                    built_with
                    keywords
                    description
                    start
                    end
                }
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
                        'link' => 'http://www.moiracms.com',
                        'work_done' => 'Some work description',
                        'built_with' => ['Laravel', 'React'],
                        'keywords' => ['Test', 'Tester'],
                        'description' => 'Testing 123',
                        'start' => '2023-01-01',
                        'end' => '2023-12-01',
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

        $this->createAuthAdmin();

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
                link: "http://www.moiracms.com",
                work_done: "Some work description",
                built_with: ["Laravel", "React"],
                keywords: ["Test", "Tester"],
                description: "Testing 123"
                start: "2023-01-01",
                end: "2023-12-01",
            }) {
                project {
                    id
                    title
                    subtitle
                    slug
                    content
                    link
                    work_done
                    built_with
                    keywords
                    description
                    start
                    end
                }
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
                        'link' => 'http://www.moiracms.com',
                        'work_done' => 'Some work description',
                        'built_with' => ['Laravel', 'React'],
                        'keywords' => ['Test', 'Tester'],
                        'description' => 'Testing 123',
                        'start' => '2023-01-01',
                        'end' => '2023-12-01',
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

        $this->createAuthAdmin();

        $project = Project::factory()->create();

        $response = $this->graphQL(
            /** @lang GraphQL */
            '
        mutation {
            deleteProject(id: "' . $project->id . '") {
                project {
                    id
                    title
                    subtitle
                    slug
                    content
                    link
                    work_done
                    built_with
                    keywords
                    description
                    start
                    end
                }
            }
        }
        '
        );

        $this->assertDatabaseMissing($project->getTable(), ['id' => $project->id]);

        $response->assertJson([
            'data' => [
                'deleteProject' => [
                    'project' => [
                        'id' => $project->id,
                        'title' => $project->title,
                        'subtitle' => $project->subtitle,
                        'slug' => $project->slug,
                        'content' => $project->content,
                        'link' => $project->link,
                        'work_done' => $project->work_done,
                        'built_with' => $project->built_with,
                        'keywords' => $project->keywords,
                        'description' => $project->description,
                        'start' => $project->start->format('Y-m-d'),
                        'end' => $project->end->format('Y-m-d'),
                    ]
                ]
            ]
        ]);
    }
}