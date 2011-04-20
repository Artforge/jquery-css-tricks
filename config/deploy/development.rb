# If you aren't deploying to /u/apps/#{application} on the target
# servers (which is the default), you can specify the actual location
# via the :deploy_to variable:
# set :deploy_to, "/var/www/#{application}"

role :app, "tricks.dev.artforge.com"
role :web, "tricks.dev.artforge.com"
role :db,  "tricks.dev.artforge.com", :primary => true
set :user, "rails"
set :use_sudo, true
set :rails_env, "development"
