<?php

namespace Tests\Integration\GraphQL;

use App\Models\Media as Asset;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Testing\File;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class Assets extends TestCase
{
    use RefreshDatabase;

    /**
     * Setup helpers for test cases
     * 
     */
    public function setUp(): void
    {
        parent::setUp();

        Storage::fake('media');
        config()->set('filesystems.disks.media', [
            'driver' => 'local',
            'root'   => storage_path('app/media'),
        ]);

        config()->set('media-library.disk_name', 'media');
    }

    /**
     * Test all Assets GraphQL query
     * 
     */
    public function testQueryAssets(): void
    {
        $admin = $this->createAuthAdmin();
        $photo = $this->generatePhoto($admin);

        $this->graphQL(
            /** @lang GraphQL */
            '
        query {
            assets {
                data {
                    id
                    name
                    file_name
                    url
                    preview
                    type
                    extension
                    mime_type
                    size
                    alternative_text
                    caption
                }
            }
        }
        '
        )->assertJson([
            'data' => [
                'assets' => [
                    'data' => [
                        $photo->only([
                            'id',
                            'name',
                            'file_name',
                            'url',
                            'preview',
                            'type',
                            'extension',
                            'mime_type',
                            'size',
                            'alternative_text',
                            'caption',
                        ])
                    ]
                ]
            ]
        ]);
    }

    /**
     * Test single Asset GraphQL query
     * 
     */
    public function testQueryAsset(): void
    {
        $admin = $this->createAuthAdmin();
        $photo = $this->generatePhoto($admin);

        $this->graphQL(
            /** @lang GraphQL */
            '
        query {
            asset(id: "' . $photo->id . '") {
                id
                name
                file_name
                url
                preview
                type
                extension
                mime_type
                size
                alternative_text
                caption
            }
        }
        '
        )->assertJson([
            'data' => [
                'asset' => $photo->only([
                    'id',
                    'name',
                    'file_name',
                    'url',
                    'preview',
                    'type',
                    'extension',
                    'mime_type',
                    'size',
                    'alternative_text',
                    'caption',
                ])

            ]
        ]);
    }

    /**
     * Test delete Asset GraphQL mutation
     * 
     */
    public function testMutationDeleteAsset(): void
    {
        $admin = $this->createAuthAdmin();
        $photo = $this->generatePhoto($admin);

        $this->assertDatabaseHas($photo->getTable(), ['id' => $photo->id]);
        Storage::disk('media')->assertExists($photo->id . '/photo.jpg');

        $this->graphQL(
            /** @lang GraphQL */
            '
        mutation {
            deleteAsset(id: "' . $photo->id . '") {
                asset {
                    id
                    name
                    file_name
                    url
                    preview
                    type
                    extension
                    mime_type
                    size
                    alternative_text
                    caption
                }
            }
        }
        '
        )->assertJson([
            'data' => [
                'deleteAsset' => [
                    'asset' => $photo->only([
                        'id',
                        'name',
                        'file_name',
                        'url',
                        'preview',
                        'type',
                        'extension',
                        'mime_type',
                        'size',
                        'alternative_text',
                        'caption',
                    ])
                ]

            ]
        ]);

        $this->assertDatabaseMissing($photo->getTable(), ['id' => $photo->id]);
        Storage::disk('media')->assertMissing($photo->id . '/photo.jpg');
    }

    /**
     * Test upload Asset GraphQL mutation
     * 
     */
    public function testMutationUploadAsset(): void
    {
        $admin = $this->createAuthAdmin();

        $map = [
            '0' => ['variables.files.0'],
            '1' => ['variables.files.1']
        ];

        $files = [
            '0' => File::image('photo.jpg'),
            '1' => File::image('photoPNG.png')
        ];

        $response = $this->multipartGraphQL([
            'operationName' => 'upload',
            'query' => 'mutation upload ($files: [Upload]!) {
                upload (
                    input: {
                        ref_id: "' . $admin->id . '",
                        ref: "default",
                        info: {
                            name: "Tester",
                            alternative_text: "testing image",
                            caption: "Image"
                        },
                        responsive: true
                        files: $files,
                    }
                ) {
                    id
                    name
                    file_name
                    url
                    preview
                    type
                    extension
                    mime_type
                    size
                    alternative_text
                    caption
                }
            }',
            'variables' => [
                'files' => null,
            ]
        ], $map, $files);

        $files = $admin->getMedia();

        $this->assertDatabaseHas($files->first()->getTable(), ['id' => $files->first()->id]);
        $this->assertDatabaseHas($files->first()->getTable(), ['id' => $files->last()->id]);
        $this->assertTrue(Storage::disk('media')->exists($files->first()->id . '/photo.jpg'));
        $this->assertTrue(Storage::disk('media')->exists($files->last()->id . '/photoPNG.png'));

        $files = $files->map(function ($file) {
            return $file->only([
                'id',
                'name',
                'file_name',
                'url',
                'preview',
                'type',
                'extension',
                'mime_type',
                'size',
                'alternative_text',
                'caption',
            ]);
        });

        $response->assertJson([
            'data' => [
                'upload' => $files->toArray()
            ]
        ]);
    }

    /**
     * Test update Asset info GraphQL mutation
     * 
     */
    public function testMutationUpdateAssetInfo(): void
    {
        $admin = $this->createAuthAdmin();
        $photo = $this->generatePhoto($admin);

        $response = $this->graphQL(
            /** @lang GraphQL */
            '
        mutation {
            updateAssetInfo (
                id: "' . $photo->id . '",
                input: {
                    name: "New Name",
                    alternative_text: "new testing image",
                    caption: "New Image"
                }
            ) {
                asset {
                    id
                    name
                    file_name
                    url
                    preview
                    type
                    extension
                    mime_type
                    size
                    alternative_text
                    caption
                }
            }
        }
        '
        );

        $updatedPhoto = Asset::findOrFail($photo->id);

        $this->assertEquals("New Name", $updatedPhoto->name);
        $this->assertEquals("new testing image", $updatedPhoto->getCustomProperty('alternative_text'));
        $this->assertEquals("New Image", $updatedPhoto->getCustomProperty('caption'));

        $response->assertJson([
            'data' => [
                'updateAssetInfo' => [
                    'asset' => $updatedPhoto->only([
                        'id',
                        'name',
                        'file_name',
                        'url',
                        'preview',
                        'type',
                        'extension',
                        'mime_type',
                        'size',
                        'alternative_text',
                        'caption',
                    ])
                ]

            ]
        ]);
    }

    /**
     * Create a mock photos in the DB
     * 
     */
    protected function generatePhoto(Model $model): Model
    {
        return $model->addMedia(File::image('photo.jpg'))->toMediaCollection('default', 'media');
    }
}
