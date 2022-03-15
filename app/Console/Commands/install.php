<?php

namespace App\Console\Commands;

use App\Models\User;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class install extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'moiracms:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup MoriaCMS for the first time.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Holds the user information.
     *
     * @var array
     */
    protected $user = [
        'name' => null,
        'email'      => null,
        'password'   => null
    ];

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $ascii = [
            "",
            "  __  __         _               ____  __  __  ____  ",
            " |  \/  |  ___  (_) _ __  __ _  / ___||  \/  |/ ___| ",
            " | |\/| | / _ \ | || '__|/ _` || |    | |\/| |\___ \ ",
            " | |  | || (_) || || |  | (_| || |___ | |  | | ___) |",
            " |_|  |_| \___/ |_||_|   \__,_| \____||_|  |_||____/ ",
            "",
        ];

        $this->line($ascii);

        $this->info(' Follow the promps for creating an Admin account.');

        // Ask for the users info for creating an admin account
        $this->askName();
        $this->askEmail();
        $this->askPassword();

        $this->comment('');
        $this->info('Preparing your Application');
        $this->comment('');

        // Generate the Application Encryption key
        $this->call('key:generate');

        // Run Migrations
        $this->call('migrate');

        // Seed DB tables
        $this->call('db:seed');

        // Create Passport Keys
        $this->call('passport:install');

        $this->comment('');
        $this->info('Copy the Password Grant ID/Secret and add it to your .env file.');
        $this->comment('');

        // Create Admin user
        $this->createAdmin();

        return 0;
    }

    /**
     * Asks for admins name.
     *
     * @return void
     */
    protected function askName()
    {
        do {
            $input = $this->ask('Enter Admin name');

            if (empty($input)) {
                $this->error('Name cannot be empty.');
            }

            $this->user['name'] = $input;
        } while (!$input);
    }

    /**
     * Asks for admin email
     *
     * @return void
     */
    protected function askEmail()
    {
        do {
            $input = $this->ask('Enter Admin email');

            if (empty($input)) {
                $this->error('Email cannot be empty');
            }

            $this->user['email'] = $input;
        } while (!$input);
    }

    /**
     * Asks for admin password.
     *
     * @return void
     */
    protected function askPassword()
    {
        do {
            $input = $this->ask('Enter Admin password');

            if (empty($input)) {
                $this->error('Password is invalid. Please try again.');
            }

            $this->user['password'] = Hash::make($input);
        } while (!$input);
    }

    protected function createAdmin()
    {
        try {
            DB::beginTransaction();

            $user = User::create($this->user);
            $user->syncRoles(['admin']);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            $this->error($e->getMessage());
        }
    }
}
