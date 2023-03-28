<?php

namespace App\Exceptions;

use GraphQL\Error\ClientAware;
use Illuminate\Auth\Access\AuthorizationException as IlluminateAuthorizationException;

class AuthorizationException extends IlluminateAuthorizationException implements ClientAware
{
    /**
     * @var @string
     */
    private $reason;

    public function __construct(string $message, string $reason)
    {
        parent::__construct($message);

        $this->reason = $reason;
    }

    /**
     * Returns true when the exception is safe for client to view.
     * 
     * @api
     * 
     * @return true
     */
    public function isClientSafe(): bool
    {
        return true;
    }

    /**
     * Returns a string √ the category of the exception.
     * 
     * @api
     * 
     * @return @string
     */
    public function getCategory(): string
    {
        return 'authorization';
    }

    /**
     * Returns the content that is put in the "extensions" part of the exception.
     * 
     * @api
     * 
     * @return @array
     */
    public function extensionsContent(): array
    {
        return [
            'reason' => $this->reason
        ];
    }
}
