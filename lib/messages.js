"use strict";

const error_messages = {

    internal: {
        status_code: 'E_500',
        message: 'Internal server error.'
    },
    login_failed: {
        status_code: 'E_001',
        message: 'Email or password incorrect.'
    },
    validation_failed: {
        status_code: 'E_002',
        message: 'Validation failed.'
    },
    email_already_registered: {
        status_code: 'E_003',
        message: 'User with this email already exist.'
    },
    email_not_verified: {
        status_code: 'E_004',
        message: 'Email not verified.'
    },
    user_not_found: {
        status_code: 'E_005',
        message: 'User not found.'
    },
    email_verification_failed: {
        status_code: 'E_006',
        message: 'Email verification failed.'
    }
}

const success_messages = {
    signup_successful: {
        status_code: 'S_001',
        message: 'New user sign up successful.'
    },
    ico_created: {
        status_code: 'S_002',
        message: 'New ICO successfully created.'
    },
    login_successful: {
        status_code: 'S_003',
        message: "Login successful."
    },
    update_successful: {
        status_code: 'S_003',
        message: "User detail updated."
    }
}

module.exports = {
    error: error_messages,
    success: success_messages
}