<?php

namespace Tests\Integration\GraphQL;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

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
                    slug
                    content
                    link
                    built_with
                    keywords
                    description
                }
            }
        }
        '
        )->assertJson([
            'data' => [
                'projects' => [
                    'data' => [
                        [
                            'id'            => $project->id,
                            'title'         => $project->title,
                            'slug'          => $project->slug,
                            'content'       => $project->content,
                            'link'          => $project->link,
                            'built_with'    => $project->built_with,
                            'keywords'      => $project->keywords,
                            'description'   => $project->description,
                        ],
                        [
                            'id'            => $project_alt->id,
                            'title'         => $project_alt->title,
                            'slug'          => $project_alt->slug,
                            'content'       => $project_alt->content,
                            'link'          => $project_alt->link,
                            'built_with'    => $project_alt->built_with,
                            'keywords'      => $project_alt->keywords,
                            'description'   => $project_alt->description,
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
                slug
                content
                link
                built_with
                keywords
                description
            }
        }
        '
        )->assertJson([
            'data' => [
                'project' => [
                    'id'            => $project->id,
                    'title'         => $project->title,
                    'slug'          => $project->slug,
                    'content'       => $project->content,
                    'link'          => $project->link,
                    'built_with'    => $project->built_with,
                    'keywords'      => $project->keywords,
                    'description'   => $project->description,
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
                content: "Testing Content.",
                link: "http://www.moiracms.com",
                built_with: ["Laravel", "React"],
                keywords: ["Test", "Tester"],
                description: "Testing 123"
            }) {
                project {
                    id
                    title
                    slug
                    content
                    link
                    built_with
                    keywords
                    description
                }
            }
        }
        '
        );

        $project = Project::all()->last();

        $response->assertJson([
            'data' => [
                'createProject' => [
                    'project' => [
                        'id'            => $project->id,
                        'title'         => $project->title,
                        'slug'          => $project->slug,
                        'content'       => $project->content,
                        'link'          => $project->link,
                        'built_with'    => $project->built_with,
                        'keywords'      => $project->keywords,
                        'description'   => $project->description,
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
                title: "Testings 123",
                slug: "testings-123",
                content: "Testing Content.",
                link: "http://www.moiracms.com",
                built_with: ["Laravel", "React"],
                keywords: ["Test", "Tester"],
                description: "Testing 123"
            }) {
                project {
                    id
                    title
                    slug
                    content
                    link
                    built_with
                    keywords
                    description
                }
            }
        }
        '
        );

        $project = Project::all()->last();

        $response->assertJson([
            'data' => [
                'updateProject' => [
                    'project' => [
                        'id'            => $project->id,
                        'title'         => $project->title,
                        'slug'          => $project->slug,
                        'content'       => $project->content,
                        'link'          => $project->link,
                        'built_with'    => $project->built_with,
                        'keywords'      => $project->keywords,
                        'description'   => $project->description,
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
                    slug
                    content
                    link
                    built_with
                    keywords
                    description
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
                        'id'            => $project->id,
                        'title'         => $project->title,
                        'slug'          => $project->slug,
                        'content'       => $project->content,
                        'link'          => $project->link,
                        'built_with'    => $project->built_with,
                        'keywords'      => $project->keywords,
                        'description'   => $project->description,
                    ]
                ]
            ]
        ]);
    }
}
