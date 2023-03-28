<?php

namespace Tests\Integration\GraphQL;

use Tests\TestCase;
use App\Models\Media as Asset;
use Illuminate\Http\Testing\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;

class Assets extends TestCase
{
    use RefreshDatabase;

    const PARAMETERS = [
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
        'created_at',
        'updated_at',
    ];

    /**
     * Helper to get GraphQL parameters for Asset
     *
     */
    protected function assetGraphQL(): string
    {
        return implode("\n", self::PARAMETERS);
    }

    /**
     * Static method for getting Asset values for assert
     * 
     */
    protected function assetParameters(Model $media): array
    {
        $data = $media->only(self::PARAMETERS);
        $data['created_at'] = $media->created_at->format('Y-m-d H:i:s');
        $data['updated_at'] = $media->updated_at->format('Y-m-d H:i:s');

        return $data;
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
                data {' . $this->assetGraphQL() . '}
            }
        }
        '
        )->assertJson([
                'data' => [
                    'assets' => [
                        'data' => [$this->assetParameters($photo)]
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
            asset(id: "' . $photo->id . '") {' . $this->assetGraphQL() . '}
        }
        '
        )->assertJson([
                'data' => [
                    'asset' => $this->assetParameters($photo)
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
                asset {' . $this->assetGraphQL() . '}
            }
        }
        '
        )->assertJson([
                'data' => [
                    'deleteAsset' => [
                        'asset' => $this->assetParameters($photo)
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

        // Make sure to use XMLHttpRequest header
        $response = $this->multipartGraphQL([
            'operationName' => 'upload',
            'query' => 'mutation upload ($files: [Upload]!) {
                upload (
                    input: {
                        ref_id: "' . $admin->id . '",
                        info: {
                            name: "Tester",
                            alternative_text: "testing image",
                            caption: "Image"
                        },
                        responsive: true
                        files: $files,
                    }
                ) {' . $this->assetGraphQL() . '}
            }',
            'variables' => [
                'files' => null,
            ]
        ], $map, $files, ["X-Requested-With" => "XMLHttpRequest"]);

        $files = $admin->refresh()->getMedia();

        $this->assertDatabaseHas($files->first()->getTable(), ['id' => $files->first()->id]);
        $this->assertDatabaseHas($files->first()->getTable(), ['id' => $files->last()->id]);
        $this->assertTrue(Storage::disk('media')->exists($files->first()->id . '/photo.jpg'));
        $this->assertTrue(Storage::disk('media')->exists($files->last()->id . '/photoPNG.png'));

        $files = $files->map(function ($file) {
            return $this->assetParameters($file);
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
                asset {' . $this->assetGraphQL() . '}
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
                    'asset' => $this->assetParameters($updatedPhoto)
                ]

            ]
        ]);
    }
}