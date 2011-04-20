set :stages, %w(development staging production)
set :default_stage, "development"
require 'capistrano/ext/multistage'

set :application, "tricks"
set :repository,  "git@github.com:Artforge/jquery-css-tricks.git"


# If you aren't using Subversion to manage your source code, specify
# your SCM below:
set :scm, :git
set :branch, "master"
set :deploy_via, :remote_cache

ssh_options[:forward_agent] = true
default_run_options[:pty] = true

namespace :deploy do
  task :after_update do
    # link_database_yml
  end
  
  desc "Restart Phusion Application"
  task :restart_phusion, :roles => :app do
    run "touch #{current_path}/tmp/restart.txt"
  end

  desc "Restart with Phusion"
  task :restart, :roles => :app do
    restart_phusion
  end
  
  desc "Link the shared database.yml to the release path's config"
  task :link_database_yml, :roles => :app do
    run "ln -nfs #{deploy_to}/#{shared_dir}/config/database.yml #{release_path}/config/database.yml"
  end
end

namespace :gems do
  desc "Install gems"
  task :install, :roles => :app do
    run "cd #{current_path} && #{sudo} rake gems:install"
  end
end