<?php
/**
 * JWT Utility Class
 * Handles JWT token generation and verification
 */
class JwtUtil {
    private $secret;
    private $issuer;
    private $audience;
    private $tokenExpiry;
    
    /**
     * Constructor
     */
    public function __construct() {
        // In production, these should be loaded from environment variables
        $this->secret = 'vaxhakal_jwt_secret_key_change_in_production';
        $this->issuer = 'vaxhakal_api';
        $this->audience = 'vaxhakal_app';
        $this->tokenExpiry = 3600; // 1 hour in seconds
    }
    
    /**
     * Generate JWT token
     * @param array $payload Data to include in token
     * @return string JWT token
     */
    public function generateToken($payload) {
        $issuedAt = time();
        $expiresAt = $issuedAt + $this->tokenExpiry;
        
        $tokenPayload = [
            'iss' => $this->issuer,      // Issuer
            'aud' => $this->audience,    // Audience
            'iat' => $issuedAt,          // Issued at time
            'exp' => $expiresAt,         // Expiration time
            'nbf' => $issuedAt,          // Not before time
            'data' => $payload           // Custom data
        ];
        
        return $this->encode($tokenPayload);
    }
    
    /**
     * Verify JWT token
     * @param string $token JWT token
     * @return array Decoded payload
     * @throws Exception If token is invalid
     */
    public function verifyToken($token) {
        try {
            $decoded = $this->decode($token);
            
            // Check if token is expired
            if ($decoded['exp'] < time()) {
                throw new Exception('Token has expired');
            }
            
            // Check issuer
            if ($decoded['iss'] !== $this->issuer) {
                throw new Exception('Invalid token issuer');
            }
            
            // Check audience
            if ($decoded['aud'] !== $this->audience) {
                throw new Exception('Invalid token audience');
            }
            
            return $decoded['data'];
        } catch (Exception $e) {
            throw new Exception('Token verification failed: ' . $e->getMessage());
        }
    }
    
    /**
     * Encode payload into JWT token
     * @param array $payload Data to encode
     * @return string JWT token
     */
    private function encode($payload) {
        // Create JWT header
        $header = json_encode([
            'typ' => 'JWT',
            'alg' => 'HS256'
        ]);
        
        // Create JWT payload
        $payload = json_encode($payload);
        
        // Base64 encode header and payload
        $base64Header = $this->base64UrlEncode($header);
        $base64Payload = $this->base64UrlEncode($payload);
        
        // Create signature
        $signature = hash_hmac('sha256', $base64Header . '.' . $base64Payload, $this->secret, true);
        $base64Signature = $this->base64UrlEncode($signature);
        
        // Create JWT token
        return $base64Header . '.' . $base64Payload . '.' . $base64Signature;
    }
    
    /**
     * Decode JWT token
     * @param string $token JWT token
     * @return array Decoded payload
     * @throws Exception If token is invalid
     */
    private function decode($token) {
        // Split token into parts
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }
        
        list($base64Header, $base64Payload, $base64Signature) = $parts;
        
        // Verify signature
        $signature = $this->base64UrlDecode($base64Signature);
        $expectedSignature = hash_hmac('sha256', $base64Header . '.' . $base64Payload, $this->secret, true);
        
        if (!hash_equals($signature, $expectedSignature)) {
            throw new Exception('Invalid token signature');
        }
        
        // Decode payload
        $payload = json_decode($this->base64UrlDecode($base64Payload), true);
        
        if (!$payload) {
            throw new Exception('Invalid token payload');
        }
        
        return $payload;
    }
    
    /**
     * Base64 URL encode
     * @param string $data Data to encode
     * @return string Base64 URL encoded string
     */
    private function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    /**
     * Base64 URL decode
     * @param string $data Data to decode
     * @return string Decoded data
     */
    private function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}