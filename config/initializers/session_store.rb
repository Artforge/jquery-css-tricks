# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_css_playground_session',
  :secret      => '09d5fb8a95fb0f6775fbffb1dab8f73a139f7ce45574d859f2daba877cf6c499222e622fa357f9993f374063243600bb0d2ba7c6c361ccc77d5812bb5fddb948'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
