<?php

namespace App\Exceptions;

use Throwable;
use Symfony\Component\HttpFoundation\Request;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->renderable(function (BadRequestHttpException $e, Request $request) {
            if ($request->getRealMethod() === 'GET') {
                return $this->renderHttpException($e);
            }
        });

        $this->reportable(function (Throwable $e) {
            //
        });
    }
}