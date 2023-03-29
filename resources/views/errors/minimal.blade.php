<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>@yield('title')</title>
        @vite('resources/css/app.css')
    </head>
    <body class="antialiased">
        <div class="relative flex items-top justify-center min-h-screen bg-white sm:items-center sm:pt-0">
            <div class="max-w-xl mx-auto sm:px-6 lg:px-8">
                <div class="flex text-center pt-8 sm:justify-start sm:pt-0">
                    <div class="text-2xl text-gray-200 uppercase tracking-wider">
                        @yield('message') —
                    </div>
                    <div class="ml-2 text-2xl font-bold text-gray-300 tracking-wider">
                        @yield('code')
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
